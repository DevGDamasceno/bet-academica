import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('usuario_bet');
    if (usuarioSalvo) {
      setUsuario(JSON.parse(usuarioSalvo));
    }
    setCarregando(false);
  }, []);

  const login = async (email, senha) => {
    try {
      console.log("1. Tentando logar com E-mail:", `"${email}"`, "Senha:", `"${senha}"`); 

      const resposta = await fetch('http://localhost:3000/usuarios');
      const dados = await resposta.json();

      console.log("2. Dados recebidos do JSON Server:", dados);

      const listaUsuarios = Array.isArray(dados) ? dados : (dados.data || []);

      const emailLimpo = email.trim();
      const senhaLimpa = senha.trim();

      const usuarioEncontrado = listaUsuarios.find(
        (u) => u.email === emailLimpo && String(u.senha) === senhaLimpa
      );

      console.log("3. Usuário encontrado após o filtro:", usuarioEncontrado);

      if (usuarioEncontrado) {
        setUsuario(usuarioEncontrado);
        localStorage.setItem('usuario_bet', JSON.stringify(usuarioEncontrado));
        return { sucesso: true, perfil: usuarioEncontrado.perfil };
      } else {
        return { sucesso: false, mensagem: "E-mail ou senha inválidos!" };
      }
    } catch (error) {
      console.error("Erro no fetch:", error);
      return { sucesso: false, mensagem: "Erro ao conectar com o banco de dados." };
    }
  };
const atualizarSaldoGlobal = (novoSaldo) => {
    setUsuario((usuarioAntigo) => {
      const usuarioAtualizado = { ...usuarioAntigo, saldo: novoSaldo };
      localStorage.setItem('usuario_bet', JSON.stringify(usuarioAtualizado));
      return usuarioAtualizado;
    });
  };
  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('usuario_bet');
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout, carregando, atualizarSaldoGlobal }}>
    {children}
    </AuthContext.Provider>
  );
}