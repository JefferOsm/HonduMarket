
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

-- validar si el usuario ya le ha preguntado por cierto producto
DELIMITER //
create procedure sp_validarConversacionProducto (
    IN p_emisor_id INT(11),
    IN p_receptor_id INT(11),
    IN p_producto_id INT(11)
)
BEGIN
    SELECT *
	FROM tbl_mensajes 
	WHERE emisor_id= p_emisor_id AND receptor_id=p_receptor_id AND producto_id= p_producto_id;
END //
DELIMITER ;

-- CANALES
-- procedimiento para obtener mis canales y a los que sigo

DELIMITER //
CREATE PROCEDURE sp_obtenerCanales(
    IN p_usuario INT(11)
)
BEGIN
    SELECT DISTINCT c.*, 
           IFNULL((
               SELECT m.mensaje 
               FROM tbl_canales_mensaje m 
               WHERE m.canal = c.canal_id 
               ORDER BY m.fecha_envio DESC 
               LIMIT 1
           ), '') AS ultimo_mensaje,
           IFNULL((
               SELECT MAX(m.fecha_envio) 
               FROM tbl_canales_mensaje m 
               WHERE m.canal = c.canal_id
           ), '') AS fecha_ultimo_mensaje,
           1 AS sigue
    FROM tbl_canales c
    LEFT JOIN tbl_canales_seguidores s ON c.canal_id = s.canal
    WHERE c.administrador = p_usuario OR s.seguidor = p_usuario
    ORDER BY fecha_ultimo_mensaje DESC; -- Ordenar por la fecha del último mensaje, del más nuevo al más antiguo
END //
DELIMITER ;

-- Todos los canales
DELIMITER //
CREATE PROCEDURE sp_obtenerTodosCanales(
    IN p_usuario_id INT(11)
)
BEGIN
    SELECT c.*,
           CASE 
               WHEN EXISTS (SELECT 1 FROM tbl_canales_seguidores WHERE canal = c.canal_id AND seguidor = p_usuario_id) THEN 1
               ELSE 0
           END AS sigue,
           CASE 
               WHEN c.administrador = p_usuario_id THEN 1
               ELSE 0
           END AS es_administrador
    FROM tbl_canales c;
END //
DELIMITER ;


-- Dejar de Seguir
DELIMITER //
CREATE PROCEDURE sp_AnularSeguimiento(
IN p_usuario_id INT,
IN p_canal_id INT
)
BEGIN
    DELETE FROM tbl_canales_seguidores WHERE canal = p_canal_id AND seguidor= p_usuario_id;
END //
DELIMITER ;

-- Borrar el Canal
DELIMITER //
CREATE PROCEDURE sp_borrarCanal(
IN p_canal_id INT
)
BEGIN
    DELETE FROM tbl_canales WHERE canal_id = p_canal_id ;
END //
DELIMITER ;


-- SIGO o no el canal
DELIMITER //
create procedure sp_validarSeguimiento (
    IN p_usuario_id INT(11),
    IN p_canal_id INT(11)
)
BEGIN
    SELECT canal, seguidor 
	FROM tbl_canales_seguidores 
	WHERE seguidor= p_usuario_id AND canal=p_canal_id ;
END //


-- TRAER MENSAJES DE UN CANAL
DELIMITER //
CREATE PROCEDURE sp_obtenerMensajesCanal(
    IN canal_id_param INT
)
BEGIN
    SELECT mensaje_id as mensajeID, mensaje, fecha_envio, tbl_canales.administrador as emisor
    FROM tbl_canales_mensaje INNER JOIN tbl_canales
    ON tbl_canales_mensaje.canal=tbl_canales.canal_id
    WHERE tbl_canales_mensaje.canal = canal_id_param
    ORDER BY fecha_envio ASC;
END //
DELIMITER ;
 

