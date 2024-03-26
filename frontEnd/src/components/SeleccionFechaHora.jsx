import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const SeleccionFechaHora = ({ onDateSelected}) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const fechaActual= new Date();

  const filtrarHora=(time)=>{
    const horaSeleccionada= new Date(time);

    return fechaActual.getTime() < horaSeleccionada.getTime();
  }



  useEffect(()=>{
    onDateSelected(selectedDate)
  },[selectedDate,onDateSelected])

  return (
    <div className="container">
      <h6>Seleccione la fecha y hora</h6>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={30}
        timeCaption="Hora"
        dateFormat="dd/MM/yyyy h:mm aa"
        className="form-control"
        placeholderText={selectedDate ? selectedDate.toLocaleString() : "Haz click aquí"}
        minDate={fechaActual}
        isClearable
        filterTime={filtrarHora}
      />
    </div>
  );
};

export default SeleccionFechaHora;