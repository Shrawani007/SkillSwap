import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { register, loginUserHandler, logoutUser, getUserProfile, updateUserProfile } from "../controllers/user.controller.js";


const router=express.Router();

router.post("/register", register);
router.route('/login').post((req, res, next) => {
    console.log(`Request body: ${JSON.stringify(req.body)}`);
    next();
}, loginUserHandler);
router.route("/logout").post(verifyJWT, logoutUser);
router.route('/profile').get(verifyJWT, getUserProfile);
router.route('/profile').put(verifyJWT, updateUserProfile);


export default router;