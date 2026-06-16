import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export function DashboardAdmin() {
  const { usuario, logout } = useContext(AuthContext);
  
  // Estados de Listagem
  const [eventos, setEventos] = useState([]);
  const [apostas, setApostas] = useState([]); // <-- Novo estado para as apostas
  
  // Estados para o formulário de novo evento
  const [timeA, setTimeA] = useState('');
  const [timeB, setTimeB] = useState('');
  const [dataEvento, setDataEvento] = useState('');
  const [oddA, setOddA] = useState('');
  const [oddEmpate, setOddEmpate] = useState('');
  const [oddB, setOddB] = useState('');

  // Busca os eventos e as apostas quando a tela carrega
  useEffect(() => {
    carregarEventos();
    carregarApostas(); // <-- Chama a função ao abrir a tela
  }, []);

  const carregarEventos = async () => {
    const resposta = await fetch('http://localhost:3000/eventos');
    const dados = await resposta.json();
    setEventos(dados);
  };

  // <-- Nova função para buscar as apostas no banco de dados
  const carregarApostas = async () => {
    const resposta = await fetch('http://localhost:3000/apostas');
    const dados = await resposta.json();
    setApostas(dados);
  };

  const cadastrarEvento = async (e) => {
    e.preventDefault();

    const novoEvento = {
      id: String(Date.now()),
      timeA,
      timeB,
      esporte: "Futebol",
      data: dataEvento,
      status: "aberto",
      resultado: "",
      odds: {
        vitoriaA: Number(oddA),
        empate: Number(oddEmpate),
        vitoriaB: Number(oddB)
      }
    };

    await fetch('http://localhost:3000/eventos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoEvento)
    });

    setTimeA(''); setTimeB(''); setDataEvento('');
    setOddA(''); setOddEmpate(''); setOddB('');
    carregarEventos();
    alert("Evento cadastrado com sucesso!");
  };

  return (
    <div className="container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Painel do Administrador</h1>
        <div>
          <span style={{ marginRight: '15px' }}>Olá, {usuario?.nome}</span>
          <button onClick={logout} style={{ width: 'auto', backgroundColor: '#e74c3c' }}>Sair</button>
        </div>
      </header>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        
        {/* Lado Esquerdo: Formulário */}
        <div className="login-box" style={{ flex: '1', minWidth: '300px', margin: '0', height: 'fit-content' }}>
          <h3>Cadastrar Nova Partida</h3>
          <form onSubmit={cadastrarEvento} style={{ marginTop: '15px' }}>
            <input type="text" placeholder="Time da Casa (A)" value={timeA} onChange={(e) => setTimeA(e.target.value)} required />
            <input type="text" placeholder="Time Visitante (B)" value={timeB} onChange={(e) => setTimeB(e.target.value)} required />
            <input type="date" value={dataEvento} onChange={(e) => setDataEvento(e.target.value)} required />
            
            <h4 style={{ margin: '15px 0 5px' }}>Definir Odds</h4>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input type="number" step="0.01" placeholder="Vitória A" value={oddA} onChange={(e) => setOddA(e.target.value)} required />
              <input type="number" step="0.01" placeholder="Empate" value={oddEmpate} onChange={(e) => setOddEmpate(e.target.value)} required />
              <input type="number" step="0.01" placeholder="Vitória B" value={oddB} onChange={(e) => setOddB(e.target.value)} required />
            </div>
            
            <button type="submit" style={{ marginTop: '15px' }}>Publicar Evento</button>
          </form>
        </div>

        {/* Lado Direito: Listas */}
        <div style={{ flex: '2', display: 'flex', flexDirection: 'column', gap: '20px', minWidth: '300px' }}>
          
          {/* Bloco 1: Partidas Abertas */}
          <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
            <h3>Partidas Abertas</h3>
            {eventos.length === 0 ? (
              <p style={{ marginTop: '15px', color: '#666' }}>Nenhuma partida cadastrada.</p>
            ) : (
              <ul style={{ listStyle: 'none', marginTop: '15px' }}>
                {eventos.map((evento) => (
                  <li key={evento.id} style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' }}>
                    <strong>{evento.timeA} x {evento.timeB}</strong> - {evento.data} <br/>
                    <small style={{ color: '#666' }}>
                      Odds: Casa ({evento.odds.vitoriaA}) | Empate ({evento.odds.empate}) | Fora ({evento.odds.vitoriaB})
                    </small>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Bloco 2: Histórico de Apostas dos Jogadores */}
          <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
            <h3>Apostas Registradas no Sistema</h3>
            {apostas.length === 0 ? (
              <p style={{ marginTop: '15px', color: '#666' }}>Nenhuma aposta feita ainda.</p>
            ) : (
              <ul style={{ listStyle: 'none', marginTop: '15px' }}>
                {apostas.map((aposta) => (
                  <li key={aposta.id} style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' }}>
                    Aposta ID: <strong>{aposta.id}</strong> (Feita pelo Usuário ID: {aposta.usuarioId})<br/>
                    <span style={{ color: '#2980b9' }}>
                      Palpite: <strong>{aposta.palpite}</strong> | Valor: R$ {aposta.valor} | Potencial: R$ {aposta.retornoPotencial}
                    </span>
                    <br/>
                    <small style={{ color: '#e67e22', fontWeight: 'bold' }}>Status: {aposta.status.toUpperCase()}</small>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}