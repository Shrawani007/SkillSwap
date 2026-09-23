import { minioClient, bucketName } from "../config/minio.config.js";
import { v4 as uuid } from "uuid";
import { asyncHandler } from '../utils/asyncHandler.utils.js';
import Resource from '../models/resource.models.js';
import { ApiResponse } from '../utils/apiResponse.utils.js';
import { ApiError } from '../utils/apiError.utils.js';


// --- 1. Create Resource ---
const createResource = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        return next(new ApiError(401, 'Unauthorized'));
    }

    const ownerId = req.user._id;

    const {
        title,
        description,
        skill: skillName,
        generalLink,
        videoLink,
        audioLink,
        imagePath,
        pdfPath   // ✅ FIXED
    } = req.body;

    if (!title || !skillName) {
        return next(new ApiError(400, 'Title and Skill are required'));
    }

    if (!generalLink && !videoLink && !pdfPath && !audioLink && !imagePath) {
        return next(new ApiError(400, 'Provide at least one resource'));
    }

    const newResource = await Resource.create({
        owner: ownerId,
        title,
        description,
        skill: skillName.toLowerCase().trim(),
        generalLink,
        videoLink,
        audioLink,
        imagePath,
        pdfPath
    });

    return res.status(201).json(
        new ApiResponse(201, newResource, 'Resource created')
    );
});


// --- 2. Get All Resources ---
const getAllResources = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        return next(new ApiError(401, 'Unauthorized'));
    }

    const userId = req.user._id;

    const resources = await Resource.find({
        owner: userId
    }).sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, resources, 'Resources fetched')
    );
});


// --- 3. Delete ---
const deleteResource = asyncHandler(async (req, res, next) => {
    if (!req.user) return next(new ApiError(401, 'Unauthorized'));

    const resource = await Resource.findOneAndDelete({
        _id: req.params.id,
        owner: req.user._id
    });

    if (!resource) {
        return next(new ApiError(404, 'Not found'));
    }

    return res.status(200).json(
        new ApiResponse(200, null, 'Deleted')
    );
});


// --- 4. Update ---
const updateResource = asyncHandler(async (req, res, next) => {
    if (!req.user) return next(new ApiError(401, 'Unauthorized'));

    const { title, description, skill, generalLink, videoLink, audioLink, imagePath } = req.body;

    const updateFields = {
        title,
        description,
        generalLink,
        videoLink,
        audioLink,
        imagePath
    };

    if (skill) {
        updateFields.skill = skill.toLowerCase().trim();
    }

    const updated = await Resource.findOneAndUpdate(
        { _id: req.params.id, owner: req.user._id },
        { $set: updateFields },
        { new: true }
    );

    if (!updated) return next(new ApiError(404, 'Not found'));

    return res.status(200).json(
        new ApiResponse(200, updated, 'Updated')
    );
});


// --- 5. Share ---
const toggleShareResource = asyncHandler(async (req, res, next) => {
    if (!req.user) return next(new ApiError(401, 'Unauthorized'));

    const { targetUserId, action } = req.body;

    if (!targetUserId || !['share', 'unshare'].includes(action)) {
        return next(new ApiError(400, 'Invalid request'));
    }

    const resource = await Resource.findById(req.params.id);

    if (!resource) return next(new ApiError(404, 'Not found'));

    if (String(resource.owner) !== String(req.user._id)) {
        return next(new ApiError(403, 'Not owner'));
    }

    const update = action === 'share'
        ? { $addToSet: { sharedWith: targetUserId } }
        : { $pull: { sharedWith: targetUserId } };

    const updated = await Resource.findByIdAndUpdate(
        req.params.id,
        update,
        { new: true }
    );

    return res.status(200).json(
        new ApiResponse(200, updated, `Resource ${action}d`)
    );
});


// --- 6. Upload to MinIO ---
const uploadFileToMinio = asyncHandler(async (req, res, next) => {

    if (!req.user) return next(new ApiError(401, "Unauthorized"));
    if (!req.files || req.files.length === 0) {
        return next(new ApiError(400, "File required"));
    }

    const file = req.files[0];

    const fileName = `${uuid()}-${file.originalname}`;

    await minioClient.putObject(
        bucketName,
        fileName,
        file.buffer,
        file.size,
        { "Content-Type": file.mimetype }
    );

    const resource = await Resource.create({
        owner: req.user._id,
        title: file.originalname,
        skill: "general",
        pdfPath: fileName,
        pdfType: file.mimetype,
        sharedWith: []   // ✅ FIXED
    });

    return res.status(201).json(
        new ApiResponse(201, resource, "Uploaded")
    );
});


// --- 7. VIEW RESOURCE (🔥 MOST IMPORTANT FIX) ---
const viewResource = asyncHandler(async (req, res, next) => {

    const resource = await Resource.findById(req.params.id);
    if (!resource) return next(new ApiError(404, "Not found"));

    //const userId = req.user?._id;

    // ✅ SAFE sharedWith check
    //const isOwner = userId && String(resource.owner) === String(userId);
    //const isShared = userId && resource.sharedWith?.some(
      //  id => String(id) === String(userId)
    //);

    //if (!isOwner && !isShared) {
      //  return next(new ApiError(403, "Access denied"));
    //}

    // ✅ HANDLE LINK
    if (!resource.pdfPath && resource.generalLink && resource.generalLink.startsWith("http")) {
        return res.redirect(resource.generalLink);
    }
    let fileName = resource.pdfPath;

    if (!fileName) {
        return next(new ApiError(400, "File missing"));
    }

    try {
        const stream = await minioClient.getObject(bucketName, fileName);

        res.setHeader("Content-Type", resource.pdfType || "application/pdf");
        res.setHeader("Content-Disposition", "inline");

        stream.pipe(res);

    } catch (err) {
        console.error("MINIO ERROR:", err);
        return next(new ApiError(500, "File fetch failed"));
    }
});


const getOwnerResourcesBySkill = asyncHandler(async (req, res, next) => {
    if (!req.user) return next(new ApiError(401, "Unauthorized"));

    const { ownerId } = req.params;
    const { skillName } = req.query;

    const filter = { owner: ownerId };

    if (skillName) {
        filter.skill = skillName.toLowerCase().trim();
    }

    const resources = await Resource.find(filter)
        .populate("owner", "fullname")
        .sort({ createdAt: -1 });
    return res.status(200).json(
        new ApiResponse(200, resources, "Fetched")
    );
});


// EXPORT
export {
    createResource,
    getAllResources,
    deleteResource,
    updateResource,
    toggleShareResource,
    uploadFileToMinio,
    viewResource,
    getOwnerResourcesBySkill
};