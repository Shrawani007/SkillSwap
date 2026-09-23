// recommendations.controller.js

import { asyncHandler } from '../utils/asyncHandler.utils.js';
import User from '../models/user.models.js';

export const getRecommendations = asyncHandler(async (req, res) => {
    try {
        let currentUser = null;

        // 1. Find user via JWT token
        if (req.user && req.user._id) {
            currentUser = await User.findById(req.user._id)
                                    .select('offering interested')
                                    // 🔑 FIX 1: Populate BOTH fields to get names for the current user's profile/pills
                                    .populate({ path: 'offering', select: 'name' }) 
                                    .populate({ path: 'interested', select: 'name' }) // <--- ADDED POPULATE
                                    .lean();
        }

        if (!currentUser) {
            return res.status(404).json({ message: "Logged-in user not found" });
        }
        
        // Extract the Skill IDs from the populated interested array
        const interestedSkillIds = currentUser.interested.map(skill => skill._id) || [];

        if (interestedSkillIds.length === 0) {
            return res.status(400).json({ message: "User has no interests. Please update your profile." });
        }

        // --- Corrected MongoDB Recommendation Query (Aggregation Pipeline) ---
        const recommendations = await User.aggregate([
            { $match: { _id: { $ne: currentUser._id } } },
            { $match: { offering: { $in: interestedSkillIds } } },
            
            // Look up the skill names for the recommended user's offerings
            {
                $lookup: {
                    from: 'skills', 
                    localField: 'offering',
                    foreignField: '_id',
                    as: 'offeringDetails'
                }
            },
            // Look up the skill names for the recommended user's interests
            {
                $lookup: {
                    from: 'skills', 
                    localField: 'interested',
                    foreignField: '_id',
                    as: 'interestedDetails' // <-- This detail is looked up correctly
                }
            }, 
            
            // Limit and project necessary fields
            { $limit: 10 },
            { 
                $project: { 
                    fullname: 1, 
                    username: 1, 
                    bio: 1, 
                    location: 1, 
                    offering: '$offeringDetails.name', 
                    interested: '$interestedDetails.name' // <--- FIX 2: ADDED THIS FIELD
                } 
            }
        ]);
        
        // Return both the recommendations and the current user's interested skill names
        return res.json({ 
            data: recommendations,
            currentUserInterests: currentUser.interested.map(s => s.name) 
        });

    } catch (err) {
        console.error('Error in getRecommendations:', err);
        return res.status(500).json({ message: 'Server error loading recommendations', error: err.message });
    }
});