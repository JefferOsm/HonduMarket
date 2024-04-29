import { pool } from '../db.js'
import nodemailer from 'nodemailer';
import cron from 'node-cron';
import pdfMake from 'pdfmake/build/pdfmake.js';
import pdfFonts from 'pdfmake/build/vfs_fonts.js';


pdfMake.vfs = pdfFonts.pdfMake.vfs;


// Crear un transportador de correo con la configuración de Ethereal
 const transporter = nodemailer.createTransport({
     service:'gmail',
     host: 'smtp.gmail.com',
     port: 587,
     secure: false, // true for 465, false for other ports
     auth: {
         user: 'hondu.market22@gmail.com', // generated ethereal user
         pass: 'yozochdyyrcgjjxs ', // generated ethereal password
     },

 });

// Función para obtener todos los usuarios suscritos
const obtenerUsuariosSuscritos = async () => {
    const [rows] = await pool.query(`
      SELECT tbl_usuarios.correo, tbl_categorias.nombre_categoria, tbl_categorias.categoria_id 
      FROM tbl_suscipciones_categorias 
      JOIN tbl_usuarios ON tbl_suscipciones_categorias.usuario = tbl_usuarios.id
      JOIN tbl_categorias ON tbl_suscipciones_categorias.categoria = tbl_categorias.categoria_id
    `);
    return rows;
};


// Función para obtener los productos de las categorías a las que el usuario está suscrito
const obtenerProductos = async (categoriasId) => {
    let productosPorCategoria = {};
    const unaSemanaAtras = new Date();
    unaSemanaAtras.setDate(unaSemanaAtras.getDate() - 7);

    for (const categoriaId of categoriasId) {
        const [rows] = await pool.query(`
        SELECT DISTINCT tbl_productos.nombre_producto, tbl_productos.descripcion_producto, tbl_productos.precio_producto,
        tbl_productos.producto_id,
            (SELECT url_imagen 
            FROM tbl_imagenesProductos 
            WHERE tbl_imagenesProductos.producto_id = tbl_productos.producto_id 
            LIMIT 1) AS url_imagen
        FROM tbl_productos
        WHERE tbl_productos.categoria_id = ? AND tbl_productos.fecha_publicacion >= ?
        ORDER BY
            tbl_productos.producto_id DESC
        LIMIT 5
        `, [categoriaId, unaSemanaAtras]);
        const [categoria] = await pool.query(`
            SELECT nombre_categoria
            FROM tbl_categorias
            WHERE categoria_id = ?
        `, [categoriaId]);
        productosPorCategoria[categoria[0].nombre_categoria] = rows;
    }
    return productosPorCategoria;
};


// Función para crear el PDF y Estilo del pdf
const crearPDF = async (productosPorCategoria) => {
    const docDefinition = {
        content: [],
        styles: {
            siteHeader: {
                fontSize: 26,
                bold: true,
                margin: [0, 0, 0, 20],
                color: 'white'
            },
            header: {
                fontSize: 18,
                bold: true,
                margin: [0, 20, 0, 10],
                color: 'black'
            },
            subheader: {
                fontSize: 16,
                bold: true,
                margin: [0, 15, 0, 5],
                color: 'darkgreen'
            },
            productLink: {
                color: 'blue',
                decoration: 'underline',
                fontSize: 14,
                italics: true
            },
            price: {
                fontSize: 16,
                bold: true,
                color: 'red'
            },
            productCard: {
                margin: [0, 10, 0, 10],
                fillColor: '#f5f5f5',
                border: [true, true, true, true]
            },
            description: {
                fontSize: 14,
                bold: false,
                margin: [0, 0, 0, 10],
                color: 'black'
            }
        }
    };

    // Añadir el encabezado del sitio
    docDefinition.content.push({
        table: {
            widths: ['*'],
            body: [
                [{ text: 'HonduMarket', style: 'siteHeader', fillColor: 'purple' }]
            ]
        },
        layout: 'noBorders'
    });

    // Añadir la descripción debajo del encabezado
    docDefinition.content.push({ text: 'Aquí están los productos agregados recientemente en tus categorías suscritas.', style: 'description' });

    for (const nombreCategoria in productosPorCategoria) {
        const productos = productosPorCategoria[nombreCategoria];
        docDefinition.content.push({ text: `Categoría: ${nombreCategoria}`, style: 'header' });

        // Añadir un espacio después de cada categoría
        docDefinition.content.push({ text: ' ', margin: [0, 0, 0, 10] });

        for (const producto of productos) {
            const productCard = {
                stack: [],
                style: 'productCard'
            };
            productCard.stack.push({ text: producto.nombre_producto, style: 'subheader' });
            productCard.stack.push({ text: producto.descripcion_producto });

            // Añadir un espacio después de la descripción del producto
            productCard.stack.push({ text: ' ', margin: [0, 0, 0, 10] });

             if (producto.url_imagen) {
                 try {
                     const response = await fetch(producto.url_imagen);
                     const arrayBuffer = await response.arrayBuffer();
                     const buffer = Buffer.from(arrayBuffer);
                     const base64Image = buffer.toString('base64');
                     productCard.stack.push({
                         image: `data:image/jpeg;base64,${base64Image}`,
                         width: 200,
                         alignment: 'center'
                     });
                 } catch (error) {
                     console.error(`Error al procesar la imagen ${producto.url_imagen}: ${error.message}`);
                 }
             }
            productCard.stack.push({
                text: `Precio: ${producto.precio_producto}`,
                style: 'price'
            });
            productCard.stack.push({
                text: 'Ver producto',
                link: `http://localhost:5173/Vista_del_articulo/${producto.nombre_producto}/${producto.producto_id}`,
                style: 'productLink'
            });

            // Añadir un espacio después de cada producto
            productCard.stack.push({ text: ' ', margin: [0, 0, 0, 10] });

            docDefinition.content.push(productCard);
        }
        // Agregar un separador después de cada categoría
        docDefinition.content.push({
            canvas: [{ type: 'line', x1: 0, y1: 0, x2: 500, y2: 0, lineWidth: 1 }]
        });
    }

    const pdfDocGenerator = pdfMake.createPdf(docDefinition);

    const pdfBuffer = await new Promise((resolve, reject) => {
        pdfDocGenerator.getBuffer(resolve);
    });

    return pdfBuffer;
};


// Función para enviar un correo a un usuario
const enviarCorreo = async (usuario, categoriasId) => {
    // Comprobar si el usuario tiene una dirección de correo electrónico
    if (!usuario.correo) {
        throw new Error('El usuario no tiene una dirección de correo electrónico');
    }

    // Obtener los productos de la categoría a la que el usuario está suscrito
    const productos = await obtenerProductos(categoriasId);

    // Verificar si hay productos nuevos en la última semana
    // if (Object.values(productos).every(categoria => categoria.length === 0)) {
    //     console.log(`No hay productos nuevos en la última semana para el usuario ${usuario.correo}`);
    //     return;
    // }

    // Crear el PDF
    const pdfBuffer = await crearPDF(productos);

    const mailOptions = {
        from: 'HonduMarket <hondu.market22@gmail.com>',
        to: usuario.correo,
        subject: 'Actualización semanal',
        text: 'Aquí están tus actualizaciones semanales.',
        attachments: [{
            filename: 'productos.pdf',
            content: pdfBuffer.toString('base64'),
            encoding: 'base64'
        }],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`correo enviado: ${info.messageId}`);
    //console.log(`Ver correo en Ethereal: ${nodemailer.getTestMessageUrl(info)}`);
};

// Función para enviar correos a todos los usuarios suscritos
const enviarCorreos = async () => {
    const usuarios = await obtenerUsuariosSuscritos();
    const categoriasPorUsuario = usuarios.reduce((acc, usuario) => {
        if (!acc[usuario.correo]) {
            acc[usuario.correo] = [];
        }
        acc[usuario.correo].push(usuario.categoria_id);
        return acc;
    }, {});
    for (const correo in categoriasPorUsuario) {
        const usuario = usuarios.find(u => u.correo === correo);
        try {
            await enviarCorreo(usuario, categoriasPorUsuario[correo]);
        } catch (error) {
            console.error(`Error al enviar correo a ${usuario.correo}: ${error.message}`);
        }
    }
};

// Programar la función para que se ejecute una vez a la semana (cada domingo a las 00:00)
//cron.schedule('0 0 * * SUN', enviarCorreos);
//cron.schedule('*/5 * * * *', enviarCorreos);
export default enviarCorreos;