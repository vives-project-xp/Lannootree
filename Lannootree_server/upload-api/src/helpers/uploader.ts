import multer from 'multer'
import uniqid from 'uniqid'
import * as path from 'path'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './src/storage/uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '_' + uniqid() + '_' + file.originalname)
  },
});

export const upload = multer({ storage: storage });

