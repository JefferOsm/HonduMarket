create database bd_marketplace;
use bd_marketplace;

CREATE TABLE tbl_usuarios (
    id INT(11) NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    username VARCHAR(20) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE KEY,
    telefono VARCHAR(8) NOT NULL UNIQUE KEY,
    direccion VARCHAR(100) NOT NULL,
    pass VARCHAR(100) NOT NULL,
    id_imagen TEXT NULL,
    url_imagen TEXT NULL,
    inactivo TINYINT(1) NOT NULL DEFAULT 0,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT Pk_usuarios PRIMARY KEY(id)
);



CREATE TABLE tbl_calificaciones (
    id INT(11) NOT NULL AUTO_INCREMENT,
    usuario_id INT(11) NOT NULL,
    calificacion INT NOT NULL,
    comentario text null,
    autor varchar(20) null,
    CONSTRAINT PKcalificaciones PRIMARY KEY (id),
    CONSTRAINT FKusuarioid FOREIGN KEY (usuario_id) REFERENCES tbl_usuarios(id)
);


CREATE TABLE tbl_categorias (
    categoria_id INT(11) NOT NULL AUTO_INCREMENT,
    nombre_categoria varchar(20) NOT NULL,
    CONSTRAINT Pk_categorias PRIMARY KEY (categoria_id)
);


-- TABLA PARA SABER SI EL PRODUCTO ES USADO, NUEVO, DAÑADO, REPARADO...
CREATE TABLE tbl_estadoProducto(
	id_estado INT(11) NOT NULL AUTO_INCREMENT,
    nombre_estado VARCHAR(50) NOT NULL,
    CONSTRAINT PKestadoProd PRIMARY KEY(id_estado)
);


CREATE TABLE tbl_departamentos(
	id_departamento INT(11) NOT NULL AUTO_INCREMENT,
    nombre_departamento VARCHAR(50) NOT NULL,
    CONSTRAINT PKdepartamento PRIMARY KEY(id_departamento)
);


CREATE TABLE tbl_productos(
	producto_id INT(11) NOT NULL AUTO_INCREMENT,
    nombre_producto VARCHAR(50) NOT NULL,
    descripcion_producto TEXT NOT NULL,
    precio_producto FLOAT NOT NULL,
	producto_inactivo TINYINT(1) DEFAULT 0,
    producto_calificacion FLOAT CHECK(producto_calificacion>=0 AND producto_calificacion<=5),
    id_video TEXT ,
    url_video TEXT ,
    estado_id INT(11) NOT NULL,
    categoria_id INT(11) NOT NULL,
    usuario_id INT(11) NOT NULL,
    departamento_id INT(11) NOT NULL,
    fecha_publicacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_programada DATETIME NULL,
	CONSTRAINT PKproducto PRIMARY KEY(producto_id),
    CONSTRAINT FKproductoEstado FOREIGN KEY(estado_id) REFERENCES tbl_estadoProducto(id_estado) ON DELETE CASCADE,
    CONSTRAINT FKproductoCategoria FOREIGN KEY(categoria_id) REFERENCES tbl_categorias(categoria_id) ON DELETE CASCADE,
    CONSTRAINT FKproductoUsuario FOREIGN KEY(usuario_id) REFERENCES tbl_usuarios(id) ON DELETE CASCADE,
    CONSTRAINT FKproductoDepartamento FOREIGN KEY(departamento_id) REFERENCES tbl_departamentos(id_departamento) ON DELETE CASCADE
);


CREATE TABLE tbl_imagenesProductos(
	id_imagenesProd INT(11) NOT NULL auto_increment,
    id_imagen TEXT NOT NULL,
    url_imagen TEXT NOT NULL,
    producto_id INT(11) NOT NULL,
    CONSTRAINT PKimagenProd PRIMARY KEY (id_imagenesProd),
    CONSTRAINT FKimagenProducto FOREIGN KEY(producto_id) REFERENCES tbl_productos(producto_id) ON DELETE CASCADE
);


CREATE TABLE tbl_listaDeseos(
	producto_id INT(11) NOT NULL,
    usuario_id INT(11) NOT NULL,
	CONSTRAINT FKdeseosProducto FOREIGN KEY(producto_id) REFERENCES tbl_productos(producto_id) ON DELETE CASCADE,
    CONSTRAINT FKdeseosUsuario FOREIGN KEY(usuario_id) REFERENCES tbl_usuarios(id) ON DELETE CASCADE,
    CONSTRAINT PK_ListaDeseos PRIMARY KEY (producto_id, usuario_id) 
);


CREATE TABLE tbl_mensajes(
	mensaje_id INT(11) NOT NULL AUTO_INCREMENT,
    emisor_id INT(11) NOT NULL,
    receptor_id INT(11) NOT NULL,
    producto_id INT(11) NULL,
    mensaje TEXT ,
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT PkMensajes PRIMARY KEY(mensaje_id),
    CONSTRAINT FKemisor FOREIGN KEY(emisor_id) REFERENCES tbl_usuarios(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT FKreceptor FOREIGN KEY(receptor_id) REFERENCES tbl_usuarios(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT FKmsjProducto FOREIGN KEY(producto_id) REFERENCES tbl_productos(producto_id) ON DELETE CASCADE ON UPDATE CASCADE
);


INSERT INTO tbl_categorias(nombre_categoria) 
VALUES('Inmuebles'),
('Vehiculos'),
('Hogar'),
('Moda'),
('Bebes'),
('Mascotas'),
('Electronica'),
('Servicios'),
('Negocios'),
('Empleos');

INSERT INTO tbl_estadoProducto(nombre_estado)
VALUES
('Nuevo'),
('Usado'),
('Dañado'),
('Reparado');

INSERT INTO tbl_departamentos(nombre_departamento)
VALUES
('Atlántida'),
('Choluteca'),
('Colón'),
('Comayagua'),
('Copán'),
('El Paraíso'),
('Intibucá'),
('Islas de la Bahiá'),
('La Paz'),
('Ocotepeque'),
('Olancho'),
('Santa Bárbara'),
('Valle'),
('Yoro'),
('Francisco Morazán'),
('Cortes'),
('Lempira'),
('Gracias a Dios');

CREATE TABLE tbl_calificaciones_producto (
    id INT(11) NOT NULL AUTO_INCREMENT,
    producto_id INT(11) NOT NULL,
    calificacion INT NOT NULL,
    comentario TEXT NULL,
    autor VARCHAR(20) NULL,
    CONSTRAINT PKcalificacionesProducto PRIMARY KEY (id),
    CONSTRAINT FKproductoId FOREIGN KEY (producto_id) REFERENCES tbl_productos(producto_id)
);

CREATE TABLE tbl_imagenes_calificaciones (
    id INT(11) NOT NULL AUTO_INCREMENT,
    calificacion_id INT(11) NOT NULL,
    imagen_url TEXT,
    id_imagen TEXT,
    CONSTRAINT PKimagenesCalificaciones PRIMARY KEY (id),
    CONSTRAINT FKcalificacionId FOREIGN KEY (calificacion_id) REFERENCES tbl_calificaciones_producto(id)
);

CREATE TABLE tbl_tipodenuncia(
	id INT(11) NOT NULL AUTO_INCREMENT,
    nombre text null,
    CONSTRAINT PKtipodenuncia PRIMARY KEY (id)
);

CREATE TABLE tbl_denuncia_usuario(
    tipoDenuncia INT(11) NOT NULL,
    usuario INT(11) NOT NULL,
    detalle VARCHAR(100) NULL,
    reportador INT(11) NULL,
    CONSTRAINT FKdenuncia_tipo FOREIGN KEY(tipoDenuncia) REFERENCES tbl_tipodenuncia(id) 
    ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT FKdenuncia_usuario FOREIGN KEY(usuario) REFERENCES tbl_usuarios(id) 
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- AGREGAR CAMPO INACTIVO PARA NO BORRAR TBL_USUARIOS
ALTER TABLE tbl_usuarios
ADD COLUMN inactivo TINYINT(1) NOT NULL DEFAULT 0;


INSERT INTO tbl_tipodenuncia(nombre)
VALUES
('Lenguaje que incita al odio'),
('Acoso'),
('Dejo de Responder'),
('No recibí el artículo'),
('No se presentó'),
('Ventas no autorizadas'),
('Fraude o estafa'),
('Se hace pasar por alguien mas'),
('Cuenta falsa'),
('Otro problema');


-- AGREGAR CAMPO FECHA COMENTARIO A LA TABLA tbl_calificaciones_producto
ALTER TABLE tbl_calificaciones_producto
ADD COLUMN fecha_comentario TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- AGREGAR CAMPO FECHA COMENTARIO A LA TABLA tbl_calificaciones
alter table tbl_calificaciones
ADD COLUMN fecha_comentario TIMESTAMP DEFAULT CURRENT_TIMESTAMP;


-- Suscripciones a categorias
CREATE TABLE tbl_suscipciones_categorias(
	categoria INT(11) NOT NULL,
    usuario INT(11) NOT NULL,
	CONSTRAINT FKsuscribeCat FOREIGN KEY(categoria) REFERENCES tbl_categorias(categoria_id) 
    ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT FKsuscribeUser FOREIGN KEY(usuario) REFERENCES tbl_usuarios(id) 
    ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT PK_SuscribeCat PRIMARY KEY (categoria, usuario) 
);
