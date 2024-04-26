
-- OBTENER PRODUCTOS DE UN USUARIO
DELIMITER //
create procedure sp_productosCategoria(
    IN p_categoria_id INT(11)
)
BEGIN
    SELECT producto_id as id, nombre_producto as nombre, descripcion_producto as descripcion, precio_producto as precio,
	tbl_estadoProducto.nombre_estado as estado, tbl_categorias.categoria_id as categoria,
	tbl_departamentos.nombre_departamento as departamento
	FROM tbl_productos INNER JOIN tbl_estadoProducto ON tbl_estadoProducto.id_estado = tbl_productos.estado_id
	INNER JOIN tbl_categorias ON tbl_categorias.categoria_id = tbl_productos.categoria_id
	INNER JOIN tbl_departamentos ON tbl_departamentos.id_departamento = tbl_productos.departamento_id
	WHERE tbl_productos.categoria_id= p_categoria_id AND (tbl_productos.fecha_programada IS NULL OR tbl_productos.fecha_programada <= NOW())
    AND tbl_productos.producto_inactivo <> 1
    ORDER BY tbl_productos.fecha_publicacion DESC;

END //
DELIMITER ;

-- Anular Suscripcion
DELIMITER //
CREATE PROCEDURE sp_AnularSuscripcion(
IN p_usuario_id INT,
IN p_categoria_id INT
)
BEGIN
    DELETE FROM tbl_suscipciones_categorias WHERE categoria = p_categoria_id AND usuario= p_usuario_id;
END //
DELIMITER ;

-- validacion de la suscripcion
DELIMITER //
create procedure sp_validarSuscripcion (
    IN p_usuario_id INT(11),
    IN p_categoria_id INT(11)
)
BEGIN
    SELECT categoria, usuario 
	FROM tbl_suscipciones_categorias 
	WHERE usuario= p_usuario_id AND categoria=p_categoria_id ;
END //
DELIMITER ;