import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export function RotaProtegida({ children, perfilRequerido }) {
  const { usuario, carregando } = useContext(AuthContext);

  if (carregando) return <div>Carregando sistema...</div>;

  if (!usuario) {
    return <Navigate to="/" />;
  }

  if (perfilRequerido && usuario.perfil !== perfilRequerido) {
    // Se um usuario comum tentar acessar rota de admin, joga ele pro dashboard dele
    return <Navigate to={usuario.perfil === 'admin' ? '/admin' : '/usuario'} />;
  }

  return children;
}