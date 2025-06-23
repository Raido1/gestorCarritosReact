import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const CrearReservaModal = ({
  show,
  onClose,
  onSave,
  selectedDate,
  reservaDescription,
  setReservaDescription,
  reservaCarro,
  setReservaCarro,
  reservaHoraInicio,
  setReservaHoraInicio,
  reservaHoraFin,
  setReservaHoraFin,
  carros,
}) => {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          Crear Reserva para {format(new Date(selectedDate), "d 'de' MMMM 'de' yyyy", { locale: es })}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Seleccionar Carro</Form.Label>
            <Form.Control
              as="select"
              value={reservaCarro}
              onChange={(e) => setReservaCarro(e.target.value)}
              required
            >
              <option value="" disabled hidden>
                -- Selecciona un carro --
              </option>
              {carros.map((carro) => (
                <option key={carro.id} value={carro.nombre}>
                  {carro.nombre}
                </option>
              ))}
            </Form.Control>

            <Form.Label>Hora de Inicio</Form.Label>
            <Form.Control
              as="select"
              value={reservaHoraInicio}
              onChange={(e) => setReservaHoraInicio(e.target.value)}
              required
            >
              <option value="" disabled hidden>
                -- Selecciona una hora de Inicio --
              </option>
              <option value="08:30:00">Primera hora [08:30]</option>
              <option value="09:22:00">Segunda hora [09:22]</option>
              <option value="10:12:00">Primer recreo [10:12]</option>
              <option value="10:32:00">Tercera hora [10:32]</option>
              <option value="11:24:00">Cuarta hora [11:24]</option>
              <option value="12:14:00">Segundo recreo [12:14]</option>
              <option value="12:34:00">Quinta hora [12:34]</option>
              <option value="13:26:00">Sexta hora [13:26]</option>
            </Form.Control>

            <Form.Label>Hora de Fin</Form.Label>
            <Form.Control
              as="select"
              value={reservaHoraFin}
              onChange={(e) => setReservaHoraFin(e.target.value)}
              required
            >
              <option value="" disabled hidden>
                -- Selecciona una hora de Fin --
              </option>
              <option value="09:22:00">Segunda hora [09:22]</option>
              <option value="10:12:00">Primer recreo [10:12]</option>
              <option value="10:32:00">Tercera hora [10:32]</option>
              <option value="11:24:00">Cuarta hora [11:24]</option>
              <option value="12:14:00">Segundo recreo [12:14]</option>
              <option value="12:34:00">Quinta hora [12:34]</option>
              <option value="13:26:00">Sexta hora [13:26]</option>
              <option value="14:16:00">Fin lectivo [14:16]</option>
            </Form.Control>

            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              value={reservaDescription}
              onChange={(e) => setReservaDescription(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={onSave}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CrearReservaModal;