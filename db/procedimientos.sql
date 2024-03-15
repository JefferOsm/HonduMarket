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

-- OBTENER PRODUCTOS DE UN USUARIO
DELIMITER //
create procedure sp_productosUsuario (
    IN p_id INT(11)
)
BEGIN
    SELECT producto_id as id, nombre_producto as nombre, descripcion_producto as descripcion, precio_producto as precio,
	tbl_estadoProducto.nombre_estado as estado, tbl_categorias.nombre_categoria as categoria,
	tbl_departamentos.nombre_departamento as departamento,fecha_publicacion
	FROM tbl_productos INNER JOIN tbl_estadoProducto ON tbl_estadoProducto.id_estado = tbl_productos.estado_id
	INNER JOIN tbl_categorias ON tbl_categorias.categoria_id = tbl_productos.categoria_id
	INNER JOIN tbl_departamentos ON tbl_departamentos.id_departamento = tbl_productos.departamento_id
	WHERE usuario_id= p_id;

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

-- Procedimiento para Subir Video
DELIMITER //
create procedure sp_subirVideoPublicacion (
	IN p_id_video TEXT,
    IN p_url_video TEXT,
	IN p_id INT
)
BEGIN
    UPDATE tbl_productos SET id_video= p_id_video, url_video= p_url_video WHERE producto_id = p_id;
END //
DELIMITER ;

-- OBTENER Detalle de un producto
DELIMITER //
create procedure sp_detalleProductos (
    IN p_id INT(11)
)
BEGIN
    SELECT producto_id as id, nombre_producto as nombre, descripcion_producto as descripcion, precio_producto as precio,
	tbl_estadoProducto.nombre_estado as estado, tbl_categorias.nombre_categoria as categoria,
	tbl_departamentos.nombre_departamento as departamento,fecha_publicacion,tbl_usuarios.nombre as usuario,
    tbl_usuarios.url_imagen as fotoPerfil, tbl_usuarios.id as idUsuario
	FROM tbl_productos INNER JOIN tbl_estadoProducto ON tbl_estadoProducto.id_estado = tbl_productos.estado_id
	INNER JOIN tbl_categorias ON tbl_categorias.categoria_id = tbl_productos.categoria_id
	INNER JOIN tbl_departamentos ON tbl_departamentos.id_departamento = tbl_productos.departamento_id
    INNER JOIN tbl_usuarios ON tbl_usuarios.id = tbl_productos.usuario_id
	WHERE producto_id= p_id;

END //
-- obtener imagenes de un producto
DELIMITER //
create procedure sp_imagenesProductos (
    IN p_id INT(11)
)
BEGIN
    SELECT *FROM tbl_imagenesProductos WHERE producto_id= p_id ;
END //
DELIMITER ;

-- OBTENER TODOS LOS PRODUCTOS
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
