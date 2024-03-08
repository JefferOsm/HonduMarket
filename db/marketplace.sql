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
    id_imagen TEXT null,
    url_imagen TEXT NULL ,
    CONSTRAINT Pk_usuarios PRIMARY KEY(id)
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
    producto_calificacion FLOAT NOT NULL CHECK(producto_calificacion>=0 AND producto_calificacion<=5),
    id_video TEXT NOT NULL,
    url_video TEXT NOT NULL,
    estado_id INT(11) NOT NULL,
    categoria_id INT(11) NOT NULL,
    usuario_id INT(11) NOT NULL,
    departamento_id INT(11) NOT NULL,
    fecha_publicacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT PKproducto PRIMARY KEY(producto_id),
    CONSTRAINT FKproductoEstado FOREIGN KEY(estado_id) REFERENCES tbl_estadoProducto(id_estado),
    CONSTRAINT FKproductoCategoria FOREIGN KEY(categoria_id) REFERENCES tbl_categorias(categoria_id),
    CONSTRAINT FKproductoUsuario FOREIGN KEY(usuario_id) REFERENCES tbl_usuarios(id),
    CONSTRAINT FKproductoDepartamento FOREIGN KEY(departamento_id) REFERENCES tbl_departamentos(id_departamento)
);

CREATE TABLE tbl_imagenesProductos(
	id_imagenesProd INT(11) NOT NULL auto_increment,
    id_imagen TEXT NOT NULL,
    url_imagen TEXT NOT NULL,
    producto_id INT(11) NOT NULL,
    CONSTRAINT PKimagenProd PRIMARY KEY (id_imagenesProd),
    CONSTRAINT FKimagenProducto FOREIGN KEY(producto_id) REFERENCES tbl_productos(producto_id)
);


INSERT INTO tbl_categorias(nombre_categoria) 
VALUES('Inmuebles'),
('Vehiculos'),
('Hogar'),
('Bebes'),
('Hogar'),
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