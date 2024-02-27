// middlewares/multer.js
import multer from 'multer';
import pkg from 'cloudinary';
const { v2: cloudinary } = pkg;
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: 'dubnnnfe1',
  api_key: '243683651229892',
  api_secret: '6_fwqgGlj6q95OMzSqmzQtRZ6q8'
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Imagenes_Usuarios', 
    public_id: (req, file) => `${req.user}_${Date.now()}`,
  },
});

const parser = multer({ storage: storage });

export default parser;