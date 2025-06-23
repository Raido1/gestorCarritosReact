import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { signInWithGoogle, auth } from './Firebase';
import { useEffect } from 'react';
import Calendario from './Calendario';
import 'react-bootstrap';
import FechaActual from './components/FechaActual';

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        if (user.email.endsWith('@chabacier.es') || user.email === "diegotj602@gmail.com") {
          navigate('/calendario');
        } else {
          alert('No tienes acceso a esta aplicación. Solo se permite el acceso a correos del centro Chabacier');
          auth.signOut();
          navigate('/');
        }
      }
    });
  }, [navigate]);

  return (
    <div className="body">
      <h1>Gestión de Reservas de Carros - Acceso</h1>
      <button onClick={signInWithGoogle}>
        <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google Logo" />
        Iniciar sesión con Google
      </button>

      <FechaActual />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/calendario" element={<Calendario />} />
      </Routes>
    </Router>
  );
}

export default App;
