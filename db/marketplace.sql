create database bd_marketplace
use bd_marketplace

CREATE TABLE tbl_usuarios (
    id INT(11) NOT NULL AUTO_INCREMENT,
    nombre varchar(20) NOT NULL,
    correo varchar(100) NOT NULL,
    telefono varchar(14) NOT NULL,
    direccion varchar(100) NOT NULL,
    CONSTRAINT Pk_usuarios PRIMARY KEY (id)
);

CREATE TABLE tbl_categorias (
    id INT(11) NOT NULL AUTO_INCREMENT,
    nombre varchar(20) NOT NULL,
    icono varchar(300) NOT NULL,
    CONSTRAINT Pk_categorias PRIMARY KEY (id)
);

INSERT INTO tbl_categorias(nombre,icono) 
VALUES('Inmuebles','<FontAwesomeIcon icon="fa-solid fa-house-chimney" />'),
('Vehiculos','<FontAwesomeIcon icon="fa-solid fa-car" style={{color: "#0c0668",}} />'),
('Hogar','<FontAwesomeIcon icon="fa-solid fa-couch" style={{color: "#c46200",}} />'),
('Bebes','<FontAwesomeIcon icon="fa-solid fa-person-breastfeeding" style={{color: "#00dbdb",}} />'),
('Hogar','<FontAwesomeIcon icon="fa-solid fa-couch" style={{color: "#c46200",}} />'),
('Mascotas','<FontAwesomeIcon icon="fa-solid fa-cat" style={{color: "#9b004e",}} />'),
('Electronica','<FontAwesomeIcon icon="fa-solid fa-computer" style={{color: "#2693ff",}} />'),
('Servicios','<FontAwesomeIcon icon="fa-solid fa-bell-concierge" style={{color: "#27521d",}} />'),
('Negocios','<FontAwesomeIcon icon="fa-solid fa-user-tie" style={{color: "#008080",}} />'),
('Empleos','<FontAwesomeIcon icon="fa-solid fa-briefcase" style={{color: "#6800d0",}} />')
