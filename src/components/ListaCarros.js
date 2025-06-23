import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase";
import './ListaCarros.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function ListaCarros({ reservas }) {
  const [carros, setCarros] = useState([]);

  useEffect(() => {
    const fetchCarros = async () => {
      const querySnapshot = await getDocs(collection(db, "carros"));
      const carrosData = querySnapshot.docs.map((doc) => {
        const carro = doc.data();

        const estaReservado = reservas.some((reserva) => {
          if (!reserva.start || !reserva.end || !reserva.carro) {
            return false;
          }

          const fechaInicio = new Date(reserva.start);
          const fechaFin = new Date(reserva.end);
          const ahora = new Date();

          return (
            carro.nombre === reserva.carro &&
            ahora >= fechaInicio &&
            ahora <= fechaFin
          );
        });

        return { ...carro, reservado: estaReservado };
      });

      setCarros(carrosData);
    };

    fetchCarros();
  }, [reservas]);

  const carrosDisponibles = carros.filter((carro) => !carro.reservado);

  return (
    <div className="lista-carros-container">
      <h2>Lista de Carros Disponibles</h2>
      {carrosDisponibles.length === 0 ? (
        <p>No hay carros disponibles en este momento.</p>
      ) : (
        <ul className="list-group">
          {carrosDisponibles.map((carro, index) => (
            <li
              key={index}
              className="list-group-item d-flex justify-content-between align-items-center"
              style={{
                backgroundColor: carro.color || "#CCCCCC",
                color: "#fff",
              }}
            >
              <span className="badge">{carro.nombre}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ListaCarros;