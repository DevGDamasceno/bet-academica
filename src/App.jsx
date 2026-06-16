import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { RotaProtegida } from './routes/RotaProtegida';
import { Login } from './pages/Login';
import { DashboardAdmin } from './pages/DashboardAdmin';
import { DashboardUsuario } from './pages/DashboardUsuario';


export default function App() {
  return (
    // O AuthProvider envolve tudo para distribuir os dados do usuário
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rota Pública */}
          <Route path="/" element={<Login />} />

          {/* Rotas Protegidas do Administrador */}
          <Route 
            path="/admin" 
            element={
              <RotaProtegida perfilRequerido="admin">
                <DashboardAdmin />
              </RotaProtegida>
            } 
          />

          {/* Rotas Protegidas do Usuário Comum */}
          <Route 
            path="/usuario" 
            element={
              <RotaProtegida perfilRequerido="usuario">
                <DashboardUsuario />
              </RotaProtegida>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}