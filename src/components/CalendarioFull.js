import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

function CalendarioFull({ calendarRef, reservas, onDateClick, onEventClick, onSelect }) {
  return (
    <FullCalendar
      ref={calendarRef}
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      locale="es"
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      }}
      events={reservas}
      dateClick={onDateClick}
      eventClick={onEventClick}
      slotMinTime="08:30:00"
      slotMaxTime="14:16:00"
      contentHeight="auto"
      selectable={true}
      select={onSelect}
    />
  );
}

export default CalendarioFull;
