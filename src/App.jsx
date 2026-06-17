import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { RotaProtegida } from './routes/RotaProtegida';
import { Login } from './pages/Login';
import { DashboardAdmin } from './pages/DashboardAdmin';
import { DashboardUsuario } from './pages/DashboardUsuario';
import { Ranking } from './pages/Ranking'; // IMPORTAMOS O RANKING

export default function App() {
  return (
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

          {/* Rota Protegida da Funcionalidade Extra (Ranking) */}
          <Route 
            path="/ranking" 
            element={
              <RotaProtegida>
                <Ranking />
              </RotaProtegida>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}