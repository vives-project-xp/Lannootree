import { Router } from 'express'
import { upload } from '../helpers/uploader.js'
import { index, uploadMultiple } from '../controllers/upload.controller.js';

const router = Router();

router.get('/', index);
router.post('/upload/post', upload.array('files', 5), uploadMultiple); 

export default router;

