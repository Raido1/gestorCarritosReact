import { collection, getDocs, doc, addDoc, deleteDoc } from "firebase/firestore";
import { db } from "../Firebase";

  // Función para obtener los carros de Firestore
  export const obtenerCarros = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "carros"));
      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          nombre: data.nombre
        };
      });
    } catch (error) {
      return [];
    }
  };

// Función para obtener las reservas desde Firestore
export const obtenerReservas = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "reservas"));
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        description: data.description,
        start: data.start,
        end: data.end,
        carro: data.carro,
        profesor: data.profesor,
      };
    });
  } catch (error) {
    return [];
  }
};

// Función para guardar una nueva reserva en Firestore
export const guardarReserva = async (nuevaReserva) => {
  try {
    const docRef = await addDoc(collection(db, "reservas"), nuevaReserva);
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

// Función para eliminar una reserva de Firestore
export const eliminarReserva = async (reservaId) => {
  try {
    const reservaRef = doc(db, "reservas", reservaId);
    await deleteDoc(reservaRef);
  } catch (error) {
    throw error;
  }
}

