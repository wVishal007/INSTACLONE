import express from 'express';
import {addNewPost,addComment,deletePost,likePost,unLikePost,getCommentsOfPost,savePost, getAllPosts, getUserPosts} from '../controllers/post.controller.js'
import upload from '../middlewares/multer.js';

import isauthenticated from '../middlewares/isauthenticated.js'

const router = express.Router();
router.route('/addpost').post(isauthenticated , upload.single('image'),addNewPost);
router.route('/all').get(isauthenticated , getAllPosts);
router.route('/userpost/all').get(isauthenticated , getUserPosts);
router.route('/:id/like').get(isauthenticated , likePost);
router.route('/:id/unlike').get(isauthenticated , unLikePost);
router.route('/:id/comment').post(isauthenticated , addComment);
router.route('/:id/comment/all').post(isauthenticated , getCommentsOfPost);
router.route('/delete/:id').delete(isauthenticated , deletePost);
router.route('/:id/save').post(isauthenticated , savePost);


export default router;
