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
