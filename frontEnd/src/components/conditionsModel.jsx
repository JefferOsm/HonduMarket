import React from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function ConditionsModel({show,handleClose}) {

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton  className='bc-degrate'>
        <Modal.Title className='fw-bold text-light'>Terminos y Condiciones</Modal.Title>
      </Modal.Header>
      <Modal.Body className='bc-primary text-light'>
         <p clasName='text-start '>
          Al usar este sitio web, usted acepta estar sujeto a estos Términos y
          Condiciones. Si no está de acuerdo con ellos, no lo use.
        </p> 

         <p clasName='text-start '>
          Nos reservamos el derecho de modificar estos Términos en cualquier
          momento. La versión más reciente estará disponible en este sitio web.
          Su uso continuo después de cualquier cambio implica su aceptación de
          esos cambios.
        </p>

         <p clasName='text-start '>
          Usted puede usar este sitio web solo para fines lícitos y de acuerdo
          con estos Términos. No puede usarlo para ningún propósito ilegal o que
          pueda infringir los derechos de otros.
        </p> 

         <p clasName='text-start '>
          Este sitio web se proporciona "tal cual" y sin ninguna garantía. No
          somos responsables de ningún fraudo hecho por los vendedores o
          publicidad falsa.
        </p> 

         <p clasName='text-start '>
          Usted acepta indemnizarnos y defendernos de cualquier reclamación,
          responsabilidad, daño, costo o gasto (incluidos los honorarios
          razonables de los abogados) que surja de su uso de este sitio web.
        </p>

         <p clasName='text-start '>
          Usted acepta el envió de publicidad de las categorías a las cuales
          esta inscripto médiate correos electrónicos.
        </p> 

         <p clasName='text-start '>
          Estos Términos se regirán e interpretarán de acuerdo con las leyes de
          Honduras
        </p> 

         <p clasName='text-start '>
          Cualquier disputa que surja de estos Términos se resolverá en los
          tribunales de Honduras.
        </p> 

         <p clasName='text-start '>
          Estos Términos constituyen el acuerdo completo entre usted y nosotros
          con respecto al uso de este sitio web. Si alguna disposición se
          considera inválida o inaplicable, se eliminará y las disposiciones
          restantes permanecerán en pleno vigor y efecto.
        </p>

      </Modal.Body>
      <Modal.Footer className='bc-degrate'>
        <Button className="btn btn-danger" onClick={handleClose}>
          Salir
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConditionsModel