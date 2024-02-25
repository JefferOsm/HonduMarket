import express from "express";
import indexRoutes from "./routes/index.routes.js";
import usuariosRoutes from "./routes/usuarios.routes.js";
import morgan from 'morgan';
import cookieParser from "cookie-parser";
const app = express();

//midlewares
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser())


//EndPoints
app.use('/home',indexRoutes);
app.use('/usuarios',usuariosRoutes);

//fallo al buscar endpoint
app.use((req,res,next)=>{
    res.status(404).json({
        message: 'Not Found'
    })
})

export default app;