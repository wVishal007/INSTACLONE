import express from 'express';
import { register,login,logout, followOrUnfollow, getSuggestedUsers ,getprofile, editprofile,getUserSavedPosts } from '../controllers/user.controller.js'

import isauthenticated from '../middlewares/isauthenticated.js'
import upload from '../middlewares/multer.js';

const router = express.Router();
router.route('/register').post(register)
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/:id/profile').get(isauthenticated , getprofile)
router.route('/profile/edit').post(isauthenticated , upload.single('ProfilePicture'),editprofile);
router.route('/suggested').get(isauthenticated , getSuggestedUsers);
router.route('/followorUnfollow/:id').post(isauthenticated , followOrUnfollow);
router.route('/saved').post(isauthenticated , getUserSavedPosts);

export default router;
