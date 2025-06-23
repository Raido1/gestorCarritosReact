import './Calendario.css';
import { auth } from "./Firebase";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header';
import ListaCarros from './components/ListaCarros';
import CrearReservaModal from "./components/CrearReservaModal";
import DetallesReservaModal from "./components/DetallesReservaModal";
import CalendarioFull from "./components/CalendarioFull";
import { useReservas } from './hooks/useReservas';
import { useCarros } from './hooks/useCarros';

function Calendario() {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const calendarRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [reservaDescription, setReservaDescription] = useState("");
  const [reservaCarro, setReservaCarro] = useState("");
  const [reservaHoraInicio, setReservaHoraInicio] = useState("");
  const [reservaHoraFin, setReservaHoraFin] = useState("");
  
  const { reservas, crearReserva, borrarReserva } = useReservas(user);
  const carros = useCarros();

  const bloques = [
    { label: "08:30:00", segundos: 8 * 3600 + 30 * 60 },
    { label: "09:22:00", segundos: 9 * 3600 + 22 * 60 },
    { label: "10:12:00", segundos: 10 * 3600 + 12 * 60 },
    { label: "10:32:00", segundos: 10 * 3600 + 32 * 60 },
    { label: "11:24:00", segundos: 11 * 3600 + 24 * 60 },
    { label: "12:14:00", segundos: 12 * 3600 + 14 * 60 },
    { label: "12:34:00", segundos: 12 * 3600 + 34 * 60 },
    { label: "13:26:00", segundos: 13 * 3600 + 26 * 60 },
    { label: "14:16:00", segundos: 14 * 3600 + 16 * 60 },
  ];

  // Si el usuario no está logeado, lo redirige al inicio de sesión
  if (!user) {
    navigate("/");
    return null;
  }

  // Maneja el clic en una fecha
  const handleDateClick = (info) => {
    const selectedDate = info.dateStr.split("T")[0];
    setSelectedDate(selectedDate);
  
    const currentView = calendarRef.current.getApi().view.type;
  
    if (currentView === "timeGridDay" || currentView === "timeGridWeek") {
      const date = new Date(info.date);
      const totalSegundos = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
      
      for (let i = 0; i < bloques.length; i++) {
        if (totalSegundos >= bloques[i].segundos) {
          setReservaHoraInicio(bloques[i].label);
          setReservaHoraFin(bloques[i+1].label);
        } else {
          break;
        }
      }
  
      if (info.dateStr === selectedDate) {
        setReservaHoraFin("14:16:00");
      }
  
      
    } else if (currentView === "dayGridMonth") {
      setReservaHoraInicio("08:30:00");
      setReservaHoraFin("09:22:00");
    }
  
    setShowModal(true);
  };

  // Maneja el clic en un evento
  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
    setShowEventModal(true);
  };

  // Limpia el formulario y cierra el modal
  const handleClose = () => {
    setShowModal(false);
    setReservaDescription("");
    setReservaCarro("");
    setReservaHoraInicio("");
    setReservaHoraFin("");
  };

  // Cierra el modal del evento
  const handleEventModalClose = () => setShowEventModal(false);

  // Maneja la creación de una nueva reserva
  const handleSave = () => {
    if (!reservaCarro || !reservaHoraInicio || !reservaHoraFin) {
      alert("Debes completar todos los campos.");
      return;
    }
  
    if (reservaHoraFin <= reservaHoraInicio) {
      alert("La hora de fin debe ser mayor que la hora de inicio.");
      return;
    }
  
    crearReserva({
      reservaCarro,
      reservaDescription,
      reservaHoraInicio,
      reservaHoraFin,
      selectedDate
    });

    // Limpiar campos
    setReservaDescription("");
    setReservaCarro("");
    setReservaHoraInicio("");
    setReservaHoraFin("");
    setShowModal(false);
  };

  // Maneja el clic en el botón de borrar reserva
  const handleDelete = async () => {
    if (selectedEvent) {
      await borrarReserva(selectedEvent.id);
      setShowEventModal(false);
    }
  };

  // Maneja la selección de bloques de hora en las vistas de día y semana
  const handleSelect = (info) => {
    const currentView = calendarRef.current.getApi().view.type;
    if (currentView === "timeGridDay" || currentView === "timeGridWeek") {
    const selectedDate = info.startStr.split("T")[0];
    setSelectedDate(selectedDate);
  
    
  
    const horaInicioSegundos = new Date(info.start).getHours() * 3600 +
      new Date(info.start).getMinutes() * 60 +
      new Date(info.start).getSeconds();
  
    const horaFinSegundos = new Date(info.end).getHours() * 3600 +
      new Date(info.end).getMinutes() * 60 +
      new Date(info.end).getSeconds();
  
    let bloqueInicio = bloques[0].label;
    for (let i = 0; i < bloques.length; i++) {
      if (horaInicioSegundos >= bloques[i].segundos) {
        bloqueInicio = bloques[i].label;
      } else {
        break;
      }
    }
  
    let bloqueFin = bloques[bloques.length - 1].label;
    for (let i = 0; i < bloques.length; i++) {
      if (horaFinSegundos <= bloques[i].segundos) {
        bloqueFin = bloques[i].label;
        break;
      }
    }

    setReservaHoraInicio(bloqueInicio);
    setReservaHoraFin(bloqueFin);
  
    setShowModal(true);
  }
  };

  return (
    <div>
      <Header user={user}/>
      <ListaCarros reservas={reservas} />
      <br />

      <CalendarioFull
        calendarRef={calendarRef}
        reservas={reservas}
        onDateClick={handleDateClick}
        onEventClick={handleEventClick}
        onSelect={handleSelect}
      />

      <button className="logout-button" onClick={() => { auth.signOut(); navigate("/"); }}>
        Cerrar Sesión
      </button>

      {/* Modal para crear reserva */}
      <CrearReservaModal
        show={showModal}
        onClose={handleClose}
        onSave={handleSave}
        selectedDate={selectedDate}
        reservaDescription={reservaDescription}
        setReservaDescription={setReservaDescription}
        reservaCarro={reservaCarro}
        setReservaCarro={setReservaCarro}
        reservaHoraInicio={reservaHoraInicio}
        setReservaHoraInicio={setReservaHoraInicio}
        reservaHoraFin={reservaHoraFin}
        setReservaHoraFin={setReservaHoraFin}
        carros={carros}
      />
  
      {/* Modal para mostrar detalles de la reserva */}
      <DetallesReservaModal
        show={showEventModal}
        onClose={handleEventModalClose}
        selectedEvent={selectedEvent}
        onDelete={handleDelete}
        user={user}
      />
    </div>
  );
}

export default Calendario;
