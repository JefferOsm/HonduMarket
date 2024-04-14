 -- Obtener un usuario
DELIMITER //
create procedure sp_obtenerUsuario (
	IN p_id INT
)
BEGIN
    SELECT *FROM tbl_usuarios WHERE id= p_id;
END //
DELIMITER ;


-- Eliminar una cuenta
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
	tbl_departamentos.nombre_departamento as departamento, producto_inactivo
	FROM tbl_productos INNER JOIN tbl_estadoProducto ON tbl_estadoProducto.id_estado = tbl_productos.estado_id
	INNER JOIN tbl_categorias ON tbl_categorias.categoria_id = tbl_productos.categoria_id
	INNER JOIN tbl_departamentos ON tbl_departamentos.id_departamento = tbl_productos.departamento_id
	WHERE usuario_id= p_id AND (tbl_productos.fecha_programada IS NULL OR tbl_productos.fecha_programada <= NOW()) 
    ORDER BY tbl_productos.fecha_publicacion DESC;
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
    SELECT producto_id as id, nombre_producto as nombre, descripcion_producto as descripcion,
    precio_producto as precio, tbl_estadoProducto.nombre_estado as estado,tbl_estadoProducto.id_estado,
    tbl_categorias.nombre_categoria as categoria,tbl_categorias.categoria_id,
	tbl_departamentos.nombre_departamento as departamento,tbl_departamentos.id_departamento,
    fecha_publicacion,tbl_usuarios.nombre as usuario, tbl_productos.producto_inactivo,
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


-- OBTENER LAS PUBLICACIONES DEL CAROUSEL DEL INICIO
DELIMITER //
CREATE PROCEDURE sp_todasPublicaciones()
BEGIN
    SELECT 
        p.producto_id AS id,
        p.nombre_producto AS nombre,
        p.precio_producto AS precio,
        p.descripcion_producto AS descripcion,
        p.usuario_id AS usuario
    FROM 
        tbl_productos p
	WHERE
        p.fecha_programada IS NULL OR p.fecha_programada <= NOW()
        AND p.producto_inactivo != 1 
	ORDER BY RAND()
    LIMIT 10;
END //
DELIMITER ;


-- OBTENER LAS PUBLICACIONES DEL CAROUSEL DE INICIO DISTINTAS AL USUARIO LOGEADO
DELIMITER //
CREATE PROCEDURE sp_todasPublicacionesAuth(IN p_user_id INT)
BEGIN
    SELECT 
        p.producto_id AS id,
        p.nombre_producto AS nombre,
        p.precio_producto AS precio,
        p.descripcion_producto AS descripcion,
        p.usuario_id AS usuario
    FROM 
        tbl_productos p
	WHERE p.usuario_id <> p_user_id AND (p.fecha_programada IS NULL OR p.fecha_programada <= NOW())
    AND p.producto_inactivo != 1
	ORDER BY RAND()
    LIMIT 10;
END //
DELIMITER ;


-- OBTENER TODOS LOS NOMBRES DE PRODUCTOS PARA SUGERENCIA
DELIMITER //
CREATE PROCEDURE sp_nombrePublicaciones()
BEGIN
    SELECT 
        p.producto_id AS id,
        p.nombre_producto AS nombre
    FROM 
        tbl_productos p
	WHERE (p.fecha_programada IS NULL OR p.fecha_programada <= NOW())
           AND p.producto_inactivo != 1;
END //
DELIMITER ;


-- PUBLICACIONES OBTENIDAS DE LA BUSQUEDA
DELIMITER //
CREATE PROCEDURE sp_todasPublicacionesSearch(IN searchTerm VARCHAR(255))
BEGIN
    SELECT  
		p.producto_id AS id,
        p.nombre_producto AS nombre,
        p.precio_producto AS precio,
        p.descripcion_producto AS descripcion,
		p.categoria_id AS categoria,
        p.departamento_id AS departamento,
        p.fecha_publicacion AS fecha_publicacion
    FROM 
        tbl_productos p
    WHERE 
        p.nombre_producto LIKE CONCAT('%', searchTerm, '%')
       AND (p.fecha_programada IS NULL OR p.fecha_programada <= NOW())
       AND p.producto_inactivo != 1
       ORDER BY p.fecha_publicacion desc;
END //
DELIMITER ;


-- Eliminar de la lista de deseos
DELIMITER //
CREATE PROCEDURE sp_borrarDeseo(
IN p_usuario_id INT,
IN p_producto_id INT
)
BEGIN
    DELETE FROM tbl_listaDeseos WHERE producto_id = p_producto_id AND usuario_id= p_usuario_id;
END //
DELIMITER ;


-- OBTENER LISTA DE DESEOS
DELIMITER //
create procedure sp_listaDeseosUsuario (
    IN p_usuario_id INT(11)
)
BEGIN
    SELECT p.producto_id as id, p.nombre_producto as nombre, p.descripcion_producto as descripcion, p.precio_producto as precio,
	p.fecha_publicacion
	FROM tbl_listaDeseos d
    INNER JOIN tbl_productos p ON p.producto_id = d.producto_id
	WHERE d.usuario_id= p_usuario_id;
END //
DELIMITER ;


-- Procedimiento para ayudar a colorear boton de lista de deseo
DELIMITER //
create procedure sp_listaValidacion (
    IN p_usuario_id INT(11),
    IN p_producto_id INT(11)
)
BEGIN
    SELECT usuario_id, producto_id 
	FROM tbl_listaDeseos 
	WHERE usuario_id= p_usuario_id AND producto_id=p_producto_id ;
END //
DELIMITER ;


-- Procedimiento para Eliminar una Publicacion
DELIMITER //
create procedure sp_borrarPublicacion (
    IN p_producto_id INT(11)
)
BEGIN
    DELETE FROM tbl_productos 
	WHERE producto_id= p_producto_id ;
END //
DELIMITER ;


-- Procedimiento para Eliminar una Publicacion
DELIMITER //
create procedure sp_comprobarPublicacion (
    IN p_producto_id INT(11),
    IN p_usuario_id INT(11)
)
BEGIN
	SELECT producto_id
	FROM tbl_productos
	WHERE usuario_id = p_usuario_id AND p_producto_id;
END //
DELIMITER ;


-- PROMEDIO DE CALIFICACIONES
DELIMITER //
CREATE PROCEDURE sp_obtenerCalificaciones(
    IN p_usuario_id INT
)
BEGIN
    -- Declarar variable para almacenar el promedio
    DECLARE promedio DECIMAL(2,1);
    
    -- Obtener el promedio de las calificaciones del usuario
    SELECT COALESCE(AVG(calificacion), 0)
    INTO promedio
    FROM tbl_calificaciones
    WHERE usuario_id = p_usuario_id;
    
    -- Devolver el resultado
    SELECT promedio AS promedio_calificaciones;
END//
DELIMITER ;


-- Obtener calificaciones y comentarios de un usuario
DELIMITER //
CREATE PROCEDURE sp_obtenerComentarios(
    IN p_usuario_id INT
)
BEGIN
    -- Seleccionar las calificaciones y comentarios del usuario especificado
    SELECT c.calificacion, c.comentario, c.autor
    FROM tbl_calificaciones c
    WHERE c.usuario_id = p_usuario_id;
END//
DELIMITER ;


-- procedimiento para obtener  mensajes de una conversacion de productos
DELIMITER //
create procedure sp_obtenerConversacion_producto (
    IN p_emisor INT(11),
    IN p_receptor INT(11),
    IN p_producto INT(11)
)
BEGIN
	SELECT mensaje_id as mensajeID,emisor_id as emisor,receptor_id as receptor,mensaje
	FROM tbl_mensajes
	WHERE (emisor_id=p_emisor OR emisor_id=p_receptor) AND (receptor_id=p_receptor OR receptor_id=p_emisor)
    AND producto_id=p_producto
    ORDER BY fecha_envio ASC;
END //
DELIMITER ;


-- procedimiento para obtener mensajes de una conversacion general
DELIMITER //
create procedure sp_obtenerConversacion_general(
    IN p_emisor INT(11),
    IN p_receptor INT(11)
)
BEGIN
	SELECT mensaje_id as mensajeID,emisor_id as emisor,receptor_id as receptor,mensaje
	FROM tbl_mensajes
	WHERE (emisor_id=p_emisor OR emisor_id=p_receptor) AND (receptor_id=p_receptor OR receptor_id=p_emisor)
    AND producto_id IS NULL
    ORDER BY fecha_envio ASC;
END //
DELIMITER ;


-- procedimiento para obtener usuarios para escrbirle por chat
DELIMITER //
create procedure sp_usuariosChat (
    IN p_usuario INT(11)
)
BEGIN
	SELECT id, nombre,username,url_imagen as foto
	FROM tbl_usuarios
	WHERE id <> p_usuario;    
END //
DELIMITER ;


-- procedimiento para obtener lasc conversaciones de productos
DELIMITER //
create procedure sp_conversacionesProductos (
    IN p_usuario INT(11)
)
BEGIN
	SELECT DISTINCT u.id, u.nombre,u.username, m.producto_id, p.nombre_producto,
       (SELECT MAX(fecha_envio) 
        FROM tbl_mensajes 
        WHERE (emisor_id = u.id OR receptor_id = u.id) 
          AND (emisor_id = p_usuario OR receptor_id = p_usuario) 
          AND producto_id = m.producto_id) AS fecha_ultimo_mensaje
	FROM tbl_mensajes m
	JOIN tbl_usuarios u ON (m.emisor_id = u.id OR m.receptor_id = u.id)
	JOIN tbl_productos p ON m.producto_id = p.producto_id
	WHERE (m.emisor_id = p_usuario OR m.receptor_id = p_usuario)
	AND u.id != p_usuario AND m.producto_id <> ''
	ORDER BY fecha_ultimo_mensaje DESC;
END //
DELIMITER ;


-- procedimiento para obtener las conversaciones de usuario a usuario sin productos o canales
DELIMITER //
create procedure sp_conversacionesUsers (
    IN p_usuario INT(11)
)
BEGIN
SELECT DISTINCT u.id, u.nombre,u.username, u.url_imagen as foto,
       (SELECT MAX(fecha_envio) 
        FROM tbl_mensajes 
        WHERE (emisor_id = u.id OR receptor_id = u.id) 
          AND (emisor_id = p_usuario OR receptor_id = p_usuario)
          AND producto_id IS NULL) AS fecha_ultimo_mensaje
FROM tbl_mensajes m
JOIN tbl_usuarios u ON (m.emisor_id = u.id OR m.receptor_id = u.id)
WHERE (m.emisor_id = p_usuario OR m.receptor_id = p_usuario)
AND u.id != p_usuario AND m.producto_id IS NULL
ORDER BY fecha_ultimo_mensaje DESC;
END //
DELIMITER ;


-- Inhabilitar Productos
CREATE EVENT inhabilitar_producto
ON SCHEDULE EVERY 1 MINUTE
DO
  UPDATE tbl_productos SET producto_inactivo = 1 WHERE fecha_publicacion < DATE_SUB(NOW(), INTERVAL 3 MINUTE) AND producto_inactivo = 1;


-- Cambiar estado del producto
DELIMITER //
CREATE PROCEDURE sp_cambiarEstado(IN p_producto_id INT, IN p_estado TINYINT)
BEGIN
    UPDATE tbl_productos
    SET 
        producto_inactivo = p_estado,
        fecha_publicacion = CURRENT_TIMESTAMP
    WHERE 
        producto_id = p_producto_id;
END //
DELIMITER ;




-- PROMEDIO DE CALIFICACIONES DE PRODUCTO
DELIMITER //
CREATE PROCEDURE sp_obtenerCalificacionesProducto(
    IN p_producto_id INT
)
BEGIN
    -- Declarar variable para almacenar el promedio
    DECLARE promedio DECIMAL(2,1);
    
    -- Obtener el promedio de las calificaciones del producto
    SELECT COALESCE(AVG(calificacion), 0)
    INTO promedio
    FROM tbl_calificaciones_producto
    WHERE producto_id = p_producto_id;
    
    -- Devolver el resultado
    SELECT promedio AS promedio_calificacionesProductos;
END//
DELIMITER ;


-- Obtener calificaciones y comentarios de un producto
CREATE PROCEDURE sp_obtenerComentariosProducto(
    IN p_producto_id INT
)
BEGIN
    -- Seleccionar las calificaciones, comentarios, autor, id e imágenes del producto especificado
    SELECT c.id, c.calificacion, c.comentario, c.autor, GROUP_CONCAT(i.imagen_url) AS imagenes
    FROM tbl_calificaciones_producto c
    LEFT JOIN tbl_imagenes_calificaciones i ON c.id = i.calificacion_id
    WHERE c.producto_id = p_producto_id
    GROUP BY c.id;
END//
DELIMITER ;


-- OBTENER tipos de denuncia
DELIMITER //
create procedure sp_tiposdenuncia (
)
BEGIN
    SELECT *from tbl_tipodenuncia;
END //
DELIMITER ;