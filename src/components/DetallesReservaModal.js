import React from "react";
import { Modal, Button } from "react-bootstrap";

const DetallesReservaModal = ({ show, onClose, selectedEvent, onDelete, user }) => {
  const mailto = `mailto:${selectedEvent?.title}`;
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Detalles de la Reserva</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedEvent && (
          <div>
            <p>
              <strong>Carro reservado:</strong> {selectedEvent.extendedProps.carro}
            </p>
            <p>
              <strong>Profesor: </strong>
              <a href={mailto} style={{textDecoration:'none', color: 'black'}}>{selectedEvent.extendedProps.profesor}</a>
            </p>
            <p>
              <strong>Inicio:</strong> {selectedEvent.start.toLocaleString()}
            </p>
            <p>
              <strong>Fin:</strong> {selectedEvent.end.toLocaleString()}
            </p>
            {selectedEvent.extendedProps.description && (
              <p>
                <strong>Descripción:</strong> {selectedEvent.extendedProps.description}
              </p>
            )}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        {selectedEvent?.title === user.email && (
          <Button variant="danger" onClick={onDelete}>
            Eliminar Reserva
          </Button>
        )}
        <Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DetallesReservaModal;