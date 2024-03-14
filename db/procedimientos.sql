-- Procedimiento para Eliminar Usuario 
DELIMITER //
create procedure sp_eliminarCuenta (
	IN p_id INT
)
BEGIN
    DELETE FROM tbl_usuarios WHERE id= p_id;
END //
DELIMITER ;

-- Procedimiento para Actualizar Foto de Perfil
DELIMITER //
create procedure sp_actualizarFotoPerfil (
	IN p_id_imagen TEXT,
    IN p_url_imagen TEXT,
	IN p_id INT
)
BEGIN
    UPDATE tbl_usuarios SET id_imagen= p_id_imagen, url_imagen= p_url_imagen WHERE id = p_id;
END //
DELIMITER ;

-- AGREGAR PRODUCTOS
DELIMITER //
create procedure sp_publicarProducto (
    IN p_nombre_producto VARCHAR(50),
    IN p_descripcion_producto TEXT ,
    IN p_precio_producto FLOAT ,
    IN p_estado_id INT(11),
    IN p_categoria_id INT(11),
    IN p_usuario_id INT(11) ,
    IN p_departamento_id INT(11)
)
BEGIN
    INSERT INTO tbl_productos(nombre_producto,descripcion_producto,precio_producto,estado_id,categoria_id,usuario_id,departamento_id)
    VALUES (p_nombre_producto,p_descripcion_producto,p_precio_producto,p_estado_id,p_categoria_id,p_usuario_id,p_departamento_id);
END //
DELIMITER ;

-- OBTENER PRODUCTOS DEL USUARIO
DELIMITER //

CREATE PROCEDURE sp_productosUsuario (
    IN p_id INT(11)
)
BEGIN
    SELECT 
        p.producto_id AS id, 
        p.nombre_producto AS nombre, 
        p.descripcion_producto AS descripcion, 
        p.precio_producto AS precio,
        ep.nombre_estado AS estado, 
        c.nombre_categoria AS categoria,
        d.nombre_departamento AS departamento,
        p.fecha_publicacion,
        i.url_imagen AS url_imagen
    FROM 
        tbl_productos p
    INNER JOIN 
        tbl_estadoProducto ep ON ep.id_estado = p.estado_id
    INNER JOIN 
        tbl_categorias c ON c.categoria_id = p.categoria_id
    INNER JOIN 
        tbl_departamentos d ON d.id_departamento = p.departamento_id
    LEFT JOIN 
        tbl_imagenesProductos i ON p.producto_id = i.producto_id
    WHERE 
        p.usuario_id = p_id;

END //

DELIMITER ;

-- TODAS LA PUBLICACIONES PARA EL HOME
DELIMITER //

CREATE PROCEDURE sp_todasPublicaciones()
BEGIN
    SELECT 
        p.producto_id AS id,
        p.nombre_producto AS nombre,
        p.precio_producto AS precio,
        p.descripcion_producto AS descripcion,
        i.url_imagen AS url_imagen
    FROM 
        tbl_productos p
    INNER JOIN 
        tbl_imagenesProductos i ON p.producto_id = i.producto_id;
END //

DELIMITER ;


-- OBTENER CATEGORIAS
DELIMITER //
create procedure sp_categorias (
)
BEGIN
    SELECT *from tbl_categorias;
END //
DELIMITER ;

-- OBTENER DEPARTAMENTOS
DELIMITER //
create procedure sp_departamentos (
)
BEGIN
    SELECT *from tbl_departamentos;
END //
DELIMITER ;

-- OBTENER ESTADOS
DELIMITER //
create procedure sp_estados (
)
BEGIN
    SELECT *from tbl_estadoProducto;
END //
DELIMITER ;

-- Inhabilitar Productos
CREATE EVENT inhabilitar_producto
ON SCHEDULE EVERY 60 DAY
DO
  UPDATE tbl_productos SET producto_inactivo = 1 WHERE fecha_publicacion < DATE_SUB(NOW(), INTERVAL 1 DAY) AND producto_inactivo = 0;