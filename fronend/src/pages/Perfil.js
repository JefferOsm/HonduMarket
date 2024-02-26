import React from 'react';
import { FaStar } from 'react-icons/fa';
import './Per.css'; // Estilos opcionales

export const Perfil = () => {
  // Datos de ejemplo para el perfil
  const profile = {
    image: 'https://th.bing.com/th/id/OIP.UkejkxjgIY8S1Z9MpaYajwHaFT?w=241&h=180&c=7&r=0&o=5&pid=1.7', // URL de la imagen
    username: 'rosa melano',
    address: '123 Calle Principal, Ciudad, País',
    email: 'usuario@example.com',
    rating: 4
  };

  // Función para renderizar las estrellas de la calificación
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < rating) {
        stars.push(<FaStar key={i} className="star filled" />);
      } else {
        stars.push(<FaStar key={i} className="star" />);
      }
    }
    return stars;
  };

  return (
    <div className="profile">
      <img src={profile.image} alt="Profile" />
      <div className="profile-info">
        <h2>{profile.username}</h2>
        <p>{profile.email}</p>
        <p>{profile.address}</p>
        <div className="rating">{renderStars(profile.rating)}</div>
        <div className="button-container mt-3">
          <div className="row">
            <div className="col-6">
              <button type="submit" className="btn  btn-black">borrar</button> {/* Agregamos la clase btn-black */}
            </div>
            <div className="col-6">
              <button type="submit" className="btn  btn-black">editar</button> {/* Agregamos la clase btn-black */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
