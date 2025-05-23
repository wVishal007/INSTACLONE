import express from 'express';
import { sendMessage,getMessage,SendPostMessage } from '../controllers/message.controller.js'

import isauthenticated from '../middlewares/isauthenticated.js'

const router = express.Router();
router.route('/send/:id').post(isauthenticated , sendMessage)
router.route('/sendPost/:id').post(isauthenticated , SendPostMessage)
router.route('/all/:id').get(isauthenticated , getMessage);

export default router;
