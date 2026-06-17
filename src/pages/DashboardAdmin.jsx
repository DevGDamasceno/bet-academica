import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function DashboardAdmin() {
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate(); // <-- Inicializando o navigate

  // Estados de Listagem
  const [eventos, setEventos] = useState([]);
  const [apostas, setApostas] = useState([]);

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
    carregarApostas();
  }, []);

  const carregarEventos = async () => {
    const resposta = await fetch('http://localhost:3000/eventos');
    const dados = await resposta.json();
    setEventos(dados);
  };

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

    setTimeA(''); 
    setTimeB(''); 
    setDataEvento('');
    setOddA(''); 
    setOddEmpate(''); 
    setOddB('');
    carregarEventos();
    alert("Evento cadastrado com sucesso!");
  };

  // --- NOVA FUNÇÃO DE ENCERRAR EVENTO E PAGAR APOSTAS ---
  const encerrarEvento = async (eventoId, resultadoReal) => {
    try {
      // 1. Muda o status do evento para encerrado
      await fetch(`http://localhost:3000/eventos/${eventoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'encerrado', resultadoFinal: resultadoReal })
      });

      // 2. Busca todas as apostas ligadas a este evento
      const respostaApostas = await fetch(`http://localhost:3000/apostas?eventoId=${eventoId}`);
      const apostasDoEvento = await respostaApostas.json();

      // 3. Processa cada aposta e paga os vencedores
      for (const aposta of apostasDoEvento) {
        if (aposta.palpite === resultadoReal) {
          // Ganhou
          await fetch(`http://localhost:3000/apostas/${aposta.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'ganhou' })
          });

          // Pega o usuário e soma o prêmio
          const resUser = await fetch(`http://localhost:3000/usuarios/${aposta.usuarioId}`);
          const user = await resUser.json();
          const novoSaldo = user.saldo + (aposta.retornoPotencial || 0);

          await fetch(`http://localhost:3000/usuarios/${aposta.usuarioId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ saldo: novoSaldo })
          });

        } else {
          // Perdeu
          await fetch(`http://localhost:3000/apostas/${aposta.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'perdeu' })
          });
        }
      }

      alert('Partida encerrada! Os pagamentos dos vencedores foram processados.');
      
      // Atualiza as listas na tela do Admin para ele ver a mudança na hora
      carregarEventos();
      carregarApostas();

    } catch (error) {
      console.error("Erro ao encerrar o evento:", error);
      alert("Deu erro ao encerrar. Verifique o console.");
    }
  };

  return (
    <div className="container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Painel do Administrador</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span>Olá, {usuario?.nome}</span>
          
          {/* BOTÃO DO RANKING ADICIONADO AQUI */}
          <button 
            onClick={() => navigate('/ranking')} 
            style={{ background: '#f39c12', color: 'white', padding: '8px 15px', borderRadius: '4px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
            🏆 Ver Ranking
          </button>

          <button onClick={logout} style={{ width: 'auto', backgroundColor: '#e74c3c', border: 'none', padding: '8px 15px', borderRadius: '4px', color: 'white', cursor: 'pointer' }}>Sair</button>
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

          {/* Bloco 1: Partidas Cadastradas */}
          <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
            <h3>Partidas Cadastradas</h3>
            {eventos.length === 0 ? (
              <p style={{ marginTop: '15px', color: '#666' }}>Nenhuma partida cadastrada.</p>
            ) : (
              <ul style={{ listStyle: 'none', marginTop: '15px' }}>
                {eventos.slice().reverse().map((evento) => (
                  <li key={evento.id} style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '10px' }}>
                    <strong>{evento.timeA} x {evento.timeB}</strong> - {evento.data}
                    {evento.status === 'encerrado' && <span style={{ marginLeft: '10px', color: '#e74c3c', fontSize: '12px', fontWeight: 'bold' }}>(ENCERRADO)</span>}
                    <br/>
                    <small style={{ color: '#666' }}>
                      Odds: Casa ({evento.odds.vitoriaA}) | Empate ({evento.odds.empate}) | Fora ({evento.odds.vitoriaB})
                    </small>

                    {/* Botões de encerramento só aparecem se o evento estiver aberto */}
                    {evento.status === 'aberto' && (
                      <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                        <button onClick={() => encerrarEvento(evento.id, 'vitoriaA')} style={{ background: '#2ecc71', padding: '5px 10px', fontSize: '12px', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                          Vitória {evento.timeA}
                        </button>
                        <button onClick={() => encerrarEvento(evento.id, 'empate')} style={{ background: '#f1c40f', color: '#000', padding: '5px 10px', fontSize: '12px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                          Empate
                        </button>
                        <button onClick={() => encerrarEvento(evento.id, 'vitoriaB')} style={{ background: '#3498db', padding: '5px 10px', fontSize: '12px', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                          Vitória {evento.timeB}
                        </button>
                      </div>
                    )}
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
                {apostas.slice().reverse().map((aposta) => (
                  <li key={aposta.id} style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' }}>
                    Aposta ID: <strong>{aposta.id}</strong> (Feita pelo Usuário ID: {aposta.usuarioId})<br/>
                    <span style={{ color: '#2980b9' }}>
                      Palpite: <strong>{aposta.palpite}</strong> | Valor: R$ {(aposta.valor || 0).toFixed(2)} | Potencial: R$ {(aposta.retornoPotencial || 0).toFixed(2)}
                    </span>
                    <br/>
                    <small style={{ color: aposta.status === 'ganhou' ? '#27ae60' : aposta.status === 'perdeu' ? '#e74c3c' : '#e67e22', fontWeight: 'bold' }}>
                      Status: {aposta.status.toUpperCase()}
                    </small>
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