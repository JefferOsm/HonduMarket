create database bd_marketplace
use bd_marketplace

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
    id INT(11) NOT NULL AUTO_INCREMENT,
    nombre varchar(20) NOT NULL,
    icono varchar(300) NOT NULL,
    CONSTRAINT Pk_categorias PRIMARY KEY (id)
);

INSERT INTO tbl_categorias(nombre,icono) 
VALUES('Inmuebles','<FontAwesomeIcon icon="fa-solid fa-house-chimney" />'),
VALUES('Vehiculos','<FontAwesomeIcon icon="fa-solid fa-car" style={{color: "#0c0668",}} />'),
VALUES('Hogar','<FontAwesomeIcon icon="fa-solid fa-couch" style={{color: "#c46200",}} />'),
VALUES('Bebes','<FontAwesomeIcon icon="fa-solid fa-person-breastfeeding" style={{color: "#00dbdb",}} />'),
VALUES('Hogar','<FontAwesomeIcon icon="fa-solid fa-couch" style={{color: "#c46200",}} />'),
VALUES('Mascotas','<FontAwesomeIcon icon="fa-solid fa-cat" style={{color: "#9b004e",}} />'),
VALUES('Electronica','<FontAwesomeIcon icon="fa-solid fa-computer" style={{color: "#2693ff",}} />'),
VALUES('Servicios','<FontAwesomeIcon icon="fa-solid fa-bell-concierge" style={{color: "#27521d",}} />'),
VALUES('Negocios','<FontAwesomeIcon icon="fa-solid fa-user-tie" style={{color: "#008080",}} />'),
VALUES('Empleos','<FontAwesomeIcon icon="fa-solid fa-briefcase" style={{color: "#6800d0",}} />');
