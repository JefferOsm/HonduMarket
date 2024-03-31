import express from "express";
import indexRoutes from "./routes/index.routes.js";
import usuariosRoutes from "./routes/usuarios.routes.js";
import productosRouter from './routes/productos.routes.js'
import chatRouter from './routes/chat.routes.js'
import morgan from 'morgan';
import cookieParser from "cookie-parser";
import cors from 'cors';
import http from 'http';
import { Server as SocketServer } from "socket.io";
const app = express();

//midlewares
app.use(cors({
    origin:'http://localhost:5173',
    credentials: true
}));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());


//EndPoints
app.use('/home',indexRoutes);
app.use('/usuarios',usuariosRoutes);
app.use('/productos',productosRouter);
app.use('/chat', chatRouter )


//fallo al buscar endpoint
app.use((req,res,next)=>{
    res.status(404).json({
        message: 'Not Found'
    })
})

export const server= http.createServer(app)

export const io= new SocketServer(server,{
    cors:{
        origin:'http://localhost:5173'
    }
})


