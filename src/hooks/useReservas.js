import { useEffect, useState } from "react";
import { obtenerReservas, eliminarReserva, guardarReserva } from "../utils/firestoreUtils";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase";

const aplicarColor = (reserva, carros) => {
  const carro = carros.find((c) => c.nombre === reserva.carro);
  const color = carro?.color || "#CCCCCC";
  reserva.backgroundColor = color;
  reserva.borderColor = color;
  reserva.display = 'block';
};

export function useReservas(user) {
  const [reservas, setReservas] = useState([]);
  const [carros, setCarros] = useState([]);

  useEffect(() => {
    const fetchCarros = async () => {
      const querySnapshot = await getDocs(collection(db, "carros"));
      const carrosData = querySnapshot.docs.map((doc) => doc.data());
      setCarros(carrosData);
    };

    const fetchReservas = async () => {
      const eventos = await obtenerReservas();
      const ahora = new Date();

      const reservasValidas = [];

      for (const reserva of eventos) {
        const fechaFin = new Date(reserva.end);
        if (fechaFin < ahora) {
          await eliminarReserva(reserva.id);
        } else {
          aplicarColor(reserva, carros);
          reservasValidas.push(reserva);
        }
      }

      setReservas(reservasValidas);
    };

    fetchCarros().then(fetchReservas);
  }, [carros]);

  const crearReserva = async ({ reservaCarro, reservaDescription, reservaHoraInicio, reservaHoraFin, selectedDate }) => {
    const nuevaReservaInicio = new Date(`${selectedDate}T${reservaHoraInicio}`);
    const nuevaReservaFin = new Date(`${selectedDate}T${reservaHoraFin}`);

    const reservasMismoDia = reservas.filter(
      (r) => r.carro === reservaCarro && selectedDate === r.start.split("T")[0]
    );

    const reservasOrdenadas = reservasMismoDia
      .map(r => ({ start: new Date(r.start), end: new Date(r.end) }))
      .sort((a, b) => a.start - b.start);

    let bloquesDisponibles = [];
    let bloqueInicio = new Date(nuevaReservaInicio);

    for (let i = 0; i <= reservasOrdenadas.length; i++) {
      const reservaActual = reservasOrdenadas[i];
      const siguienteInicio = reservaActual ? reservaActual.start : nuevaReservaFin;

      if (bloqueInicio < siguienteInicio) {
        const bloqueFin = new Date(Math.min(siguienteInicio.getTime(), nuevaReservaFin.getTime()));

        if (bloqueInicio < bloqueFin) {
          bloquesDisponibles.push({ start: new Date(bloqueInicio), end: new Date(bloqueFin) });
        }
      }

      if (reservaActual && reservaActual.end > bloqueInicio) {
        bloqueInicio = new Date(Math.max(bloqueInicio.getTime(), reservaActual.end.getTime()));
      }
    }

    if (bloquesDisponibles.length === 0) {
      alert("No hay bloques disponibles.");
      return;
    }

    const sinSolapamiento =
      bloquesDisponibles.length === 1 &&
      bloquesDisponibles[0].start.getTime() === nuevaReservaInicio.getTime() &&
      bloquesDisponibles[0].end.getTime() === nuevaReservaFin.getTime();

    if (!sinSolapamiento) {
      alert("Algunas franjas estaban ocupadas, se crearon reservas en los espacios libres.");
    }

    for (const bloque of bloquesDisponibles) {
      const nuevaReserva = {
        title: user.email,
        description: reservaDescription,
        start: bloque.start.toISOString(),
        end: bloque.end.toISOString(),
        carro: reservaCarro,
        profesor: user.displayName,
      };

      const reservaId = await guardarReserva(nuevaReserva);

      const reservaParaCalendario = {
        id: reservaId,
        ...nuevaReserva,
      };

      aplicarColor(reservaParaCalendario, carros);
      setReservas((prev) => [...prev, reservaParaCalendario]);
    }
  };

  const borrarReserva = async (reservaId) => {
    await eliminarReserva(reservaId);
    setReservas((prev) => prev.filter((r) => r.id !== reservaId));
  };

  return {
    reservas,
    setReservas,
    crearReserva,
    borrarReserva,
  };
}