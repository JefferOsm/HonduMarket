import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const SeleccionFechaHora = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <div className="container">
      <h6>Seleccione la fecha y hora</h6>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={20}
        timeCaption="Hora"
        dateFormat="dd/MM/yyyy h:mm aa"
        className="form-control"
        placeholderText={selectedDate ? selectedDate.toLocaleString() : "Haz click aquí"}
      />
    </div>
  );
};

export default SeleccionFechaHora;