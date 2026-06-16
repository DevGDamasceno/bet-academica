import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Evita que a página recarregue
    setErro('');

    const resultado = await login(email, senha);

    if (resultado.sucesso) {
      // Direciona para a página correta com base no perfil
      if (resultado.perfil === 'admin') {
        navigate('/admin');
      } else {
        navigate('/usuario');
      }
    } else {
      setErro(resultado.mensagem);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Bet Acadêmica</h2>
        <p style={{ marginBottom: '20px', color: '#666' }}>Faça login para continuar</p>
        
        {erro && <p className="error-message">{erro}</p>}

        <form onSubmit={handleLogin}>
          <input 
            type="email" 
            placeholder="Digite seu e-mail" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          <input 
            type="password" 
            placeholder="Digite sua senha" 
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required 
          />
          <button type="submit">Entrar na Plataforma</button>
        </form>
      </div>
    </div>
  );
}