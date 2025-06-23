import { useEffect, useState } from 'react';

function FechaActual() {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentDate(now.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <small>Fecha actual: {currentDate}</small>;
}

export default FechaActual;