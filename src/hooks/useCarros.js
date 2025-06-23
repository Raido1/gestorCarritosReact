import { useEffect, useState } from "react";
import { obtenerCarros } from "../utils/firestoreUtils";

export function useCarros() {
  const [carros, setCarros] = useState([]);

  useEffect(() => {
    const fetchCarros = async () => {
      const data = await obtenerCarros();
      setCarros(data);
    };

    fetchCarros();
  }, []);

  return carros;
}
