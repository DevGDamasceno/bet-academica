import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export function DashboardUsuario() {
  const { usuario, logout, atualizarSaldoGlobal } = useContext(AuthContext);
  const [eventos, setEventos] = useState([]);
  
  // Estados para o Boletim de Aposta
  const [eventoSelecionado, setEventoSelecionado] = useState(null);
  const [palpite, setPalpite] = useState(''); // 'vitoriaA', 'empate' ou 'vitoriaB'
  const [valorAposta, setValorAposta] = useState('');

  useEffect(() => {
    carregarEventos();
  }, []);

  const carregarEventos = async () => {
    // Busca apenas os eventos que estão abertos
    const resposta = await fetch('http://localhost:3000/eventos?status=aberto');
    const dados = await resposta.json();
    setEventos(dados);
  };

  const selecionarAposta = (evento, tipoPalpite) => {
    setEventoSelecionado(evento);
    setPalpite(tipoPalpite);
    setValorAposta(''); // Limpa o valor se trocar de aposta
  };

  const confirmarAposta = async (e) => {
    e.preventDefault();
    const valor = Number(valorAposta);

    if (valor <= 0) return alert("Digite um valor válido maior que zero!");
    if (valor > usuario.saldo) return alert("Saldo insuficiente para esta aposta!");

    // 1. Calcula o novo saldo e atualiza no banco de dados (JSON Server)
    const novoSaldo = usuario.saldo - valor;
    await fetch(`http://localhost:3000/usuarios/${usuario.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ saldo: novoSaldo })
    });

    // 2. Registra a aposta no banco de dados
    const oddDoMomento = eventoSelecionado.odds[palpite];
    const novaAposta = {
      id: String(Date.now()),
      usuarioId: usuario.id,
      eventoId: eventoSelecionado.id,
      palpite: palpite,
      odd: oddDoMomento,
      valor: valor,
      status: "pendente",
      retornoPotencial: valor * oddDoMomento
    };

    await fetch('http://localhost:3000/apostas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novaAposta)
    });

    // 3. Atualiza a tela e o contexto
    atualizarSaldoGlobal(novoSaldo);
    setEventoSelecionado(null);
    setPalpite('');
    alert("Aposta registrada com sucesso! Boa sorte!");
  };

  // Funções para deixar os textos mais amigáveis na tela
  const traduzirPalpite = (tipo, evento) => {
    if (tipo === 'vitoriaA') return `Vitória do ${evento.timeA}`;
    if (tipo === 'vitoriaB') return `Vitória do ${evento.timeB}`;
    return 'Empate';
  };

  return (
    <div className="container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Área do Jogador</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span>Olá, <strong>{usuario?.nome}</strong></span>
          <span style={{ background: '#27ae60', color: 'white', padding: '8px 15px', borderRadius: '4px', fontWeight: 'bold' }}>
            Saldo: R$ {usuario?.saldo?.toFixed(2)}
          </span>
          <button onClick={logout} style={{ width: 'auto', backgroundColor: '#e74c3c' }}>Sair</button>
        </div>
      </header>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        
        {/* Lado Esquerdo: Lista de Eventos */}
        <div style={{ flex: '2', minWidth: '350px' }}>
          <h3 style={{ marginBottom: '15px' }}>Partidas Disponíveis</h3>
          
          {eventos.length === 0 ? (
            <p>Nenhuma partida aberta no momento.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {eventos.map((evento) => (
                <div key={evento.id} style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                  <h4 style={{ textAlign: 'center', marginBottom: '15px' }}>{evento.timeA} x {evento.timeB}</h4>
                  
                  {/* Botões das Odds */}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={() => selecionarAposta(evento, 'vitoriaA')}
                      style={{ background: palpite === 'vitoriaA' && eventoSelecionado?.id === evento.id ? '#3498db' : '#2c3e50' }}>
                      {evento.timeA} <br/> ({evento.odds.vitoriaA})
                    </button>
                    
                    <button 
                      onClick={() => selecionarAposta(evento, 'empate')}
                      style={{ background: palpite === 'empate' && eventoSelecionado?.id === evento.id ? '#3498db' : '#2c3e50' }}>
                      Empate <br/> ({evento.odds.empate})
                    </button>
                    
                    <button 
                      onClick={() => selecionarAposta(evento, 'vitoriaB')}
                      style={{ background: palpite === 'vitoriaB' && eventoSelecionado?.id === evento.id ? '#3498db' : '#2c3e50' }}>
                      {evento.timeB} <br/> ({evento.odds.vitoriaB})
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lado Direito: Boletim de Aposta */}
        <div className="login-box" style={{ flex: '1', minWidth: '300px', margin: '0', height: 'fit-content' }}>
          <h3>Boletim de Aposta</h3>
          
          {!eventoSelecionado ? (
            <p style={{ color: '#666', marginTop: '20px' }}>Clique em uma das cotações (odds) ao lado para iniciar sua aposta.</p>
          ) : (
            <form onSubmit={confirmarAposta} style={{ marginTop: '20px', textAlign: 'left' }}>
              <p><strong>Jogo:</strong> {eventoSelecionado.timeA} x {eventoSelecionado.timeB}</p>
              <p style={{ margin: '10px 0' }}><strong>Seu Palpite:</strong> {traduzirPalpite(palpite, eventoSelecionado)}</p>
              <p><strong>Odd:</strong> {eventoSelecionado.odds[palpite]}</p>
              
              <div style={{ marginTop: '20px' }}>
                <label>Valor da Aposta (R$)</label>
                <input 
                  type="number" 
                  step="0.01"
                  min="0.01"
                  placeholder="Ex: 50.00" 
                  value={valorAposta} 
                  onChange={(e) => setValorAposta(e.target.value)} 
                  required 
                />
              </div>

              {valorAposta > 0 && (
                <div style={{ background: '#f1c40f', padding: '10px', borderRadius: '4px', textAlign: 'center', marginTop: '10px' }}>
                  Retorno Potencial: <strong>R$ {(valorAposta * eventoSelecionado.odds[palpite]).toFixed(2)}</strong>
                </div>
              )}
              
              <button type="submit" style={{ marginTop: '20px', background: '#27ae60' }}>
                Confirmar Aposta
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}