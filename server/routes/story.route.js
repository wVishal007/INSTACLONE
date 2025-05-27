import express from 'express';
import { addStory,getAllStories,getMystories } from '../controllers/story.controller.js';
import upload from '../middlewares/multer.js';
import isauthenticated from '../middlewares/isauthenticated.js'

const router = express.Router();
router.route('/addstory').post(isauthenticated , upload.single('image'),addStory);
router.route('/allstories').get(isauthenticated , getAllStories);
router.route('/myStory').get(isauthenticated,getMystories)



export default router;
