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
-- NUEVO CAMBIADO EL 24/04/24

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
        p.fecha_publicacion
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
	WHERE d.usuario_id= p_usuario_id AND p.producto_inactivo<>1;
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

-- NUEVO CAMBIADO EL 24/04/24
-- Obtener calificaciones y comentarios de un producto
DELIMITER //
CREATE PROCEDURE sp_obtenerComentariosProducto(
    IN p_producto_id INT
)
BEGIN
    -- Seleccionar las calificaciones, comentarios, fechas e imágenes del producto especificado
    SELECT c.id, c.calificacion, c.comentario, c.autor, GROUP_CONCAT(i.imagen_url) AS imagenes, c.fecha_comentario
    FROM tbl_calificaciones_producto c
    LEFT JOIN tbl_imagenes_calificaciones i ON c.id = i.calificacion_id
    WHERE c.producto_id = p_producto_id
    GROUP BY c.id
    ORDER BY c.fecha_comentario DESC;
END//
DELIMITER ;

-- NUEVO CAMBIADO EL 24/04/24
-- Obtener calificaciones y comentarios de un usuario


DELIMITER //
CREATE PROCEDURE sp_obtenerComentarios(
    IN p_usuario_id INT
)
BEGIN
    -- Seleccionar las calificaciones y comentarios del usuario especificado
    SELECT c.calificacion, c.comentario, c.autor,c.fecha_comentario
    FROM tbl_calificaciones c
    WHERE c.usuario_id = p_usuario_id
    ORDER BY c.fecha_comentario DESC;
END//
DELIMITER ;


--                PROCEDIMIENTOS DEL APARTADO DE DENUNCIAS                       --

-- OBTENER tipos de denuncia
DELIMITER //
create procedure sp_tiposdenuncia (
)
BEGIN
    SELECT *from tbl_tipodenuncia;
END //
DELIMITER ;

-- OBTENER LOS USUARIOS DENUNCIADOS
DELIMITER //
create procedure sp_usuarios_denunciados (
)
BEGIN
    SELECT DISTINCT u.id, u.nombre, u.username, u.url_imagen, url_imagen, u.correo,u.inactivo,
    COUNT(DISTINCT reportador) AS cantidad_reportadores
	from tbl_denuncia_usuario INNER JOIN tbl_usuarios u 
    ON tbl_denuncia_usuario.usuario= u.id
    GROUP BY u.id, u.nombre, u.username, u.url_imagen, u.correo
    ORDER BY cantidad_reportadores DESC;
END //
DELIMITER ;

-- OBTENER LA CANTIDAD DE PERSONAS QUE REPORTARON A UN USUARIO
DELIMITER //
create procedure sp_cantidad_reportadores (
    IN p_usuario_id INT
)
BEGIN
	SELECT COUNT(DISTINCT reportador) AS cantidad_reportadores
	FROM tbl_denuncia_usuario
	WHERE usuario = p_usuario_id;

END //
DELIMITER ;

-- OBTENER LA CANTIDAD DE REPORTES QUE TIENE EL USUARIO
DELIMITER //
create procedure sp_detalle_reportes (
    IN p_usuario_id INT
)
BEGIN
	SELECT d.usuario, t.id, t.nombre, COUNT(*) AS cantidad_denuncias
	FROM tbl_denuncia_usuario d
	INNER JOIN tbl_tipodenuncia t ON
	t.id=d.tipoDenuncia WHERE d.usuario=p_usuario_id
	GROUP BY d.usuario, t.id;
END //
DELIMITER ;

-- OBTENER LAS DESCRIPCIONES DE LOS PROBLEMAS DADOS
DELIMITER //
create procedure sp_descripcion_problema (
    IN p_usuario_id INT,
    IN p_problema VARCHAR(100)
)
BEGIN
	SELECT d.detalle, r.username From tbl_denuncia_usuario d 
	INNER JOIN tbl_tipodenuncia t ON t.id=d.tipoDenuncia
    INNER JOIN tbl_usuarios r ON r.id=d.reportador
	WHERE t.nombre=p_problema AND d.usuario=p_usuario_id;
END //
DELIMITER ;




-- INHABILITAR USUARIO
DELIMITER //
create procedure sp_inhabilitarCuenta (
    IN p_usuario_id INT
)
BEGIN
	UPDATE tbl_productos SET producto_inactivo=1 WHERE usuario_id=p_usuario_id;
	UPDATE tbl_usuarios SET inactivo=1 WHERE id=p_usuario_id;
END //
DELIMITER ;


-- HABILITAR USUARIO
DELIMITER //
create procedure sp_habilitarCuenta (
    IN p_usuario_id INT
)
BEGIN
	DELETE FROM tbl_denuncia_usuario WHERE usuario=p_usuario_id;
	UPDATE tbl_usuarios SET inactivo=0 WHERE id=p_usuario_id;
END //
DELIMITER ;


--  PROCEDIMIENTOS APARTADO DE GRAFICAS --
  
  -- Contar los productos creado en cada mes de un year a la fecha
DELIMITER //

CREATE PROCEDURE sp_ContarProductosCreados(IN id_categoria INT, IN id_departamento INT)
BEGIN

	-- Iniciamos las variables
    DECLARE mes_actual INT;
	DECLARE year_actual INT;
    DECLARE contador INT;
    DECLARE fecha_inicio DATE;
    DECLARE fecha_fin DATE;

	-- Iniciamos una tabla temporal
    DROP TEMPORARY TABLE IF EXISTS Temp_ConteoUltimos12Meses;
    CREATE TEMPORARY TABLE Temp_ConteoUltimos12Meses (
        Mes INT,
        Conteo INT
    );

	-- llenamos las variables 
    SET fecha_fin = CURDATE();
    SET fecha_inicio = DATE_SUB(fecha_fin, INTERVAL 1 YEAR);
    SET mes_actual = MONTH(fecha_inicio);
    SET year_actual = YEAR(fecha_inicio);
    
    -- Si se escogieron 2 filtros entonces se ejecuta
    IF id_categoria IS NOT NULL AND id_departamento IS NOT NULL THEN

		WHILE mes_actual <= MONTH(fecha_fin)  OR year_actual < YEAR(fecha_fin) DO
			SELECT COUNT(*)
			INTO contador
			FROM tbl_productos
			WHERE YEAR(fecha_publicacion) = year_actual AND MONTH(fecha_publicacion) = mes_actual AND categoria_id = id_categoria AND departamento_id = id_departamento;

			INSERT INTO Temp_ConteoUltimos12Meses (Mes, Conteo) VALUES (mes_actual, contador);
			
			IF mes_actual = 12 THEN
				SET mes_actual = 1;
				SET year_actual = year_actual + 1;
			ELSE
				SET mes_actual = mes_actual + 1;
			END IF;
		END WHILE;
        
	-- Si se escoge una categoria entonces se ejecuta
	ELSE IF id_categoria IS NOT NULL THEN
		WHILE mes_actual <= MONTH(fecha_fin)  OR year_actual < YEAR(fecha_fin) DO
			SELECT COUNT(*)
			INTO contador
			FROM tbl_productos
			WHERE YEAR(fecha_publicacion) = year_actual AND MONTH(fecha_publicacion) = mes_actual AND categoria_id = id_categoria;

			INSERT INTO Temp_ConteoUltimos12Meses (Mes, Conteo) VALUES (mes_actual, contador);
			
			IF mes_actual = 12 THEN
				SET mes_actual = 1;
				SET year_actual = year_actual + 1;
			ELSE
				SET mes_actual = mes_actual + 1;
			END IF;
		END WHILE;
	
    ELSE IF id_departamento IS NOT NULL THEN
		WHILE mes_actual <= MONTH(fecha_fin)  OR year_actual < YEAR(fecha_fin) DO
			SELECT COUNT(*)
			INTO contador
			FROM tbl_productos
			WHERE YEAR(fecha_publicacion) = year_actual AND MONTH(fecha_publicacion) = mes_actual AND departamento_id = id_departamento;

			INSERT INTO Temp_ConteoUltimos12Meses (Mes, Conteo) VALUES (mes_actual, contador);
			
			IF mes_actual = 12 THEN
				SET mes_actual = 1;
				SET year_actual = year_actual + 1;
			ELSE
				SET mes_actual = mes_actual + 1;
			END IF;
		END WHILE;

	ELSE
		WHILE mes_actual <= MONTH(fecha_fin)  OR year_actual < YEAR(fecha_fin) DO
			SELECT COUNT(*)
			INTO contador
			FROM tbl_productos
			WHERE YEAR(fecha_publicacion) = year_actual AND MONTH(fecha_publicacion) = mes_actual;

			INSERT INTO Temp_ConteoUltimos12Meses (Mes, Conteo) VALUES (mes_actual, contador);
			
			IF mes_actual = 12 THEN
				SET mes_actual = 1;
				SET year_actual = year_actual + 1;
			ELSE
				SET mes_actual = mes_actual + 1;
			END IF;
		END WHILE;
    
    END IF;
	END IF;
    END IF;
    SELECT * FROM Temp_ConteoUltimos12Meses;
END //

DELIMITER ;


 -- Contar los usuarios registrados en cada mes de un año a la fecha
DELIMITER //

CREATE PROCEDURE sp_ContarUsuariosRegistrados()
BEGIN
    DECLARE mes_actual INT;
	DECLARE year_actual INT;
    DECLARE contador INT;
    DECLARE fecha_inicio DATE;
    DECLARE fecha_fin DATE;

    DROP TEMPORARY TABLE IF EXISTS Temp_ConteoUsuarios;
    CREATE TEMPORARY TABLE Temp_ConteoUsuarios (
        Mes INT,
        Conteo INT
    );

    SET fecha_fin = CURDATE();
    SET fecha_inicio = DATE_SUB(fecha_fin, INTERVAL 1 YEAR);
    SET mes_actual = MONTH(fecha_inicio);
    SET year_actual = YEAR(fecha_inicio);

    WHILE mes_actual <= MONTH(fecha_fin)  OR year_actual < YEAR(fecha_fin) DO
        SELECT COUNT(*)
        INTO contador
        FROM tbl_usuarios
        WHERE YEAR(fecha_registro) = year_actual AND MONTH(fecha_registro) = mes_actual;

        INSERT INTO Temp_ConteoUsuarios (Mes, Conteo) VALUES (mes_actual, contador);
        
        IF mes_actual = 12 THEN
			SET mes_actual = 1;
            SET year_actual = year_actual + 1;
		ELSE
			SET mes_actual = mes_actual + 1;
		END IF;
       
    END WHILE;

    SELECT * FROM Temp_ConteoUsuarios;
END //

DELIMITER ;


-- Contar la cantidad de calificaciones que hay de los productos en los ultimos 3 meses
DELIMITER //
CREATE PROCEDURE sp_ContarCalificacionProductos()
BEGIN
    DECLARE i INT;
    DECLARE condicion INT;
    DECLARE contador INT;
    DECLARE contador_filas INT;
    DECLARE elemento INT;
	DECLARE mes_actual INT;
	DECLARE year_actual INT;
    DECLARE fecha_inicio DATE;
    DECLARE fecha_fin DATE;

    DROP TEMPORARY TABLE IF EXISTS Temp_ConteoCalificacionProducto;
    CREATE TEMPORARY TABLE Temp_ConteoCalificacionProducto (
        Meses INT,
        uno INT,
        dos INT,
        tres INT,
        cuatro INT,
        cinco INT
    );
  
    SET i = 0;
    SET condicion = 5;
    SET fecha_fin = CURDATE();
    SET fecha_inicio = DATE_SUB(fecha_fin, INTERVAL 3 MONTH);
    SET mes_actual = MONTH(fecha_inicio);
    SET year_actual = YEAR(fecha_inicio);
    
    WHILE mes_actual <= MONTH(fecha_fin)  OR year_actual < YEAR(fecha_fin) DO
    
		SELECT COUNT(*) INTO contador_filas
			FROM Temp_ConteoCalificacionProducto
			WHERE Meses = mes_actual;
            
            IF contador_filas = 0 THEN
				INSERT INTO Temp_ConteoCalificacionProducto (Meses, uno, dos, tres, cuatro, cinco)
				VALUES (mes_actual, NULL, NULL, NULL, NULL, NULL);
			END IF;
    
		WHILE i < condicion DO
			SET elemento = i + 1;
			SELECT COUNT(*)
			INTO contador
			FROM tbl_calificaciones_producto
			WHERE calificacion = elemento AND YEAR(fecha_comentario) = year_actual AND MONTH(fecha_comentario) = mes_actual;
            
            UPDATE Temp_ConteoCalificacionProducto
			SET
				uno   = CASE WHEN elemento = 1 THEN contador ELSE uno END,
				dos   = CASE WHEN elemento = 2 THEN contador ELSE dos END,
				tres  = CASE WHEN elemento = 3 THEN contador ELSE tres END,
				cuatro = CASE WHEN elemento = 4 THEN contador ELSE cuatro END,
				cinco = CASE WHEN elemento = 5 THEN contador ELSE cinco END
			WHERE Meses = mes_actual;
            
			SET i = i + 1;
		END WHILE;
        
        IF mes_actual = 12 THEN
			SET mes_actual = 1;
            SET year_actual = year_actual + 1;
            SET i = 0;
		ELSE
			SET mes_actual = mes_actual + 1;
            SET i = 0;
		END IF;
        
	END WHILE;
    
    SELECT * FROM Temp_ConteoCalificacionProducto;
END //
DELIMITER ;


-- Contar la cantidad de calificaciones que hay de los usuarios en los ultimos 3 meses
DELIMITER //
CREATE PROCEDURE sp_ContarCalificacionUsuarios()
BEGIN
    DECLARE i INT;
    DECLARE condicion INT;
    DECLARE contador INT;
    DECLARE contador_filas INT;
    DECLARE elemento INT;
	DECLARE mes_actual INT;
	DECLARE year_actual INT;
    DECLARE fecha_inicio DATE;
    DECLARE fecha_fin DATE;

    DROP TEMPORARY TABLE IF EXISTS Temp_ContarCalificacionUsuarios;
    CREATE TEMPORARY TABLE Temp_ContarCalificacionUsuarios (
        Meses INT,
        uno INT,
        dos INT,
        tres INT,
        cuatro INT,
        cinco INT
    );
  
    SET i = 0;
    SET condicion = 5;
    SET fecha_fin = CURDATE();
    SET fecha_inicio = DATE_SUB(fecha_fin, INTERVAL 3 MONTH);
    SET mes_actual = MONTH(fecha_inicio);
    SET year_actual = YEAR(fecha_inicio);
    
    WHILE mes_actual <= MONTH(fecha_fin)  OR year_actual < YEAR(fecha_fin) DO
    
		SELECT COUNT(*) INTO contador_filas
			FROM Temp_ContarCalificacionUsuarios
			WHERE Meses = mes_actual;
            
            IF contador_filas = 0 THEN
				INSERT INTO Temp_ContarCalificacionUsuarios (Meses, uno, dos, tres, cuatro, cinco)
				VALUES (mes_actual, NULL, NULL, NULL, NULL, NULL);
			END IF;
    
		WHILE i < condicion DO
			SET elemento = i + 1;
			SELECT COUNT(*)
			INTO contador
			FROM tbl_calificaciones
			WHERE calificacion = elemento AND YEAR(fecha_comentario) = year_actual AND MONTH(fecha_comentario) = mes_actual;
            
            UPDATE Temp_ContarCalificacionUsuarios
			SET
				uno   = CASE WHEN elemento = 1 THEN contador ELSE uno END,
				dos   = CASE WHEN elemento = 2 THEN contador ELSE dos END,
				tres  = CASE WHEN elemento = 3 THEN contador ELSE tres END,
				cuatro = CASE WHEN elemento = 4 THEN contador ELSE cuatro END,
				cinco = CASE WHEN elemento = 5 THEN contador ELSE cinco END
			WHERE Meses = mes_actual;
            
			SET i = i + 1;
		END WHILE;
        
        IF mes_actual = 12 THEN
			SET mes_actual = 1;
            SET year_actual = year_actual + 1;
            SET i = 0;
		ELSE
			SET mes_actual = mes_actual + 1;
            SET i = 0;
		END IF;
        
	END WHILE;
    
    SELECT * FROM Temp_ContarCalificacionUsuarios;
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
        p.fecha_publicacion
    FROM 
        tbl_productos p
    WHERE 
        p.nombre_producto LIKE CONCAT('%', searchTerm, '%')
       AND (p.fecha_programada IS NULL OR p.fecha_programada <= NOW())
       AND p.producto_inactivo != 1
       ORDER BY p.fecha_publicacion desc;
END //
DELIMITER ;


-- Buscar los productos que fueron calificados ultimamente con 5 estrellas
DELIMITER //
CREATE PROCEDURE sp_ProductosDeCincoEstrella(IN id_usuario INT)
BEGIN
    DECLARE i INT;
    DECLARE elemento INT;
	DECLARE mes_actual INT;
	DECLARE year_actual INT;
    DECLARE fecha_actual DATE;
    DECLARE contador_filas INT;
     
    SET i = 0;
    SET elemento = 5;
    SET fecha_actual = CURDATE();
    SET mes_actual = MONTH(fecha_actual);
    SET year_actual = YEAR(fecha_actual);
    
    
    IF id_usuario IS NULL THEN
		WHILE i < 3 DO
			IF i = 0 THEN
				DROP TEMPORARY TABLE IF EXISTS Temp_ProductosConCincoEstrellas;
				CREATE TEMPORARY TABLE Temp_ProductosConCincoEstrellas AS
				SELECT DISTINCT ip.producto_id, p.nombre_producto, url_imagen
				FROM tbl_calificaciones_producto cp
				INNER JOIN tbl_productos p ON cp.producto_id = p.producto_id
				INNER JOIN tbl_imagenesproductos ip ON cp.producto_id = ip.producto_id
				WHERE cp.calificacion = elemento 
				AND YEAR(cp.fecha_comentario) = year_actual 
				AND MONTH(cp.fecha_comentario) = mes_actual 
                AND p.producto_inactivo = 0
				AND ip.id_imagenesProd = (
					SELECT MIN(id_imagenesProd)
					FROM tbl_imagenesproductos
					WHERE producto_id = cp.producto_id
				);
			ElSE 
				INSERT INTO Temp_ProductosConCincoEstrellas 
				SELECT DISTINCT ip.producto_id, p.nombre_producto, url_imagen
				FROM tbl_calificaciones_producto cp
				INNER JOIN tbl_productos p ON cp.producto_id = p.producto_id
				INNER JOIN tbl_imagenesproductos ip ON cp.producto_id = ip.producto_id
				WHERE cp.calificacion = elemento 
				AND YEAR(cp.fecha_comentario) = year_actual 
				AND MONTH(cp.fecha_comentario) = mes_actual 
                AND p.producto_inactivo = 0
				AND ip.id_imagenesProd = (
					SELECT MIN(id_imagenesProd)
					FROM tbl_imagenesproductos
					WHERE producto_id = cp.producto_id
				);
			END IF;
            
            SELECT COUNT(*) INTO contador_filas
			FROM Temp_ProductosConCincoEstrellas;
            
			IF mes_actual = 1 THEN
				SET mes_actual = 12;
				SET year_actual = year_actual - 1;
			ELSE
				SET mes_actual = mes_actual - 1;
			END IF;
			SET i = i + contador_filas;
            
		END WHILE;
        
        
	ElSE
		WHILE i < 3 DO
			IF i = 0 THEN
				DROP TEMPORARY TABLE IF EXISTS Temp_ProductosConCincoEstrellas;
				CREATE TEMPORARY TABLE Temp_ProductosConCincoEstrellas AS
				SELECT DISTINCT ip.producto_id, p.nombre_producto, url_imagen
				FROM tbl_calificaciones_producto cp
				INNER JOIN tbl_productos p ON cp.producto_id = p.producto_id
				INNER JOIN tbl_imagenesproductos ip ON cp.producto_id = ip.producto_id
				WHERE cp.calificacion = elemento 
				AND YEAR(cp.fecha_comentario) = year_actual 
				AND MONTH(cp.fecha_comentario) = mes_actual 
                AND p.producto_inactivo = 0
				AND p.usuario_id <> id_usuario
				AND ip.id_imagenesProd = (
					SELECT MIN(id_imagenesProd)
					FROM tbl_imagenesproductos
					WHERE producto_id = cp.producto_id
				);
			ElSE 
				INSERT INTO Temp_ProductosConCincoEstrellas 
				SELECT DISTINCT ip.producto_id, p.nombre_producto, url_imagen
				FROM tbl_calificaciones_producto cp
				INNER JOIN tbl_productos p ON cp.producto_id = p.producto_id
				INNER JOIN tbl_imagenesproductos ip ON cp.producto_id = ip.producto_id
				WHERE cp.calificacion = elemento 
				AND YEAR(cp.fecha_comentario) = year_actual 
				AND MONTH(cp.fecha_comentario) = mes_actual 
                AND p.producto_inactivo = 0
				AND p.usuario_id <> id_usuario
				AND ip.id_imagenesProd = (
					SELECT MIN(id_imagenesProd)
					FROM tbl_imagenesproductos
					WHERE producto_id = cp.producto_id
				);
			END IF;
            
            SELECT COUNT(*) INTO contador_filas
			FROM Temp_ProductosConCincoEstrellas;
            
			IF mes_actual = 1 THEN
				SET mes_actual = 12;
				SET year_actual = year_actual - 1;
			ELSE
				SET mes_actual = mes_actual - 1;
			END IF;
			SET i = i + contador_filas;
		END WHILE;
	END IF;
	SELECT * FROM Temp_ProductosConCincoEstrellas;
    
END //
DELIMITER ;


-- procedimiento para elegir dias para inhabilitar productos
DELIMITER //
CREATE PROCEDURE sp_cambioDiasInactivar (
    IN p_dias INT(11)
)
BEGIN
    UPDATE configuracion_inactividad SET dias_inactividad = p_dias WHERE id = 1;
END //
DELIMITER ;

-- procedimiento para traer el limite de dias de inactividad
DELIMITER //
CREATE PROCEDURE sp_obtenerDiasLimite (
)
BEGIN
    SELECT *FROM configuracion_inactividad WHERE id = 1;
END //
DELIMITER ;


-- EVENTO DE INACTIVIDAD
DELIMITER //
CREATE EVENT inhabilitar_producto
ON SCHEDULE EVERY 10 MINUTE
DO
BEGIN
    DECLARE v_dias INT;
    SELECT dias_inactividad INTO v_dias FROM configuracion_inactividad WHERE id = 1;
    
    UPDATE tbl_productos SET producto_inactivo = 1 WHERE fecha_publicacion < DATE_SUB(NOW(), INTERVAL v_dias DAY) AND producto_inactivo = 0;
END //
DELIMITER ;


-- Cambiar estado del producto
DELIMITER //
CREATE PROCEDURE sp_marcarVendido(IN p_producto_id INT)
BEGIN
    UPDATE tbl_productos
    SET 
        producto_inactivo = 1
    WHERE 
        producto_id = p_producto_id;
END //
DELIMITER ;