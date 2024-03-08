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

