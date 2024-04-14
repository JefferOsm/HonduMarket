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

//Imagenes de Usuarios
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Imagenes_Usuarios', 
    public_id: (req, file) => `${req.user}_${Date.now()}`,
  },
});

export const parserUsuarios = multer({ storage: storage });


// imágenes de productos
const productoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Imagenes_Productos', 
    public_id: (req, file) => `${req.user}_${file.originalname}`,
  },
});

export const productoParser = multer({ storage: productoStorage });


// imágenes de productos
const videoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Videos_Productos',
    resource_type:'video',
    allowed_formats: ['mp4', 'mov', 'avi'], 
    public_id: (req, file) => `${req.user}_${Date.now()}`,
  },
});

export const videoParser = multer({ storage: videoStorage });