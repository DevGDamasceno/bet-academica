import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function Ranking() {
  const [jogadores, setJogadores] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    carregarRanking();
  }, []);

  const carregarRanking = async () => {
    try {
      const resposta = await fetch('http://localhost:3000/usuarios');
      const dados = await resposta.json();

      // Filtra apenas os usuários comuns (tira os admins) e ordena pelo maior saldo
      const rankingOrdenado = dados
        .filter((user) => user.perfil === 'usuario')
        .sort((a, b) => b.saldo - a.saldo);

      setJogadores(rankingOrdenado);
    } catch (error) {
      console.error("Erro ao carregar o ranking:", error);
    }
  };

  const renderizarPosicao = (index) => {
    if (index === 0) return '🥇 1º';
    if (index === 1) return '🥈 2º';
    if (index === 2) return '🥉 3º';
    return `${index + 1}º`;
  };

  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>🏆 Ranking Global (Leaderboard)</h1>
        <button 
          onClick={() => navigate('/usuario')} 
          style={{ background: '#34495e', color: 'white', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}
        >
          Voltar ao Dashboard
        </button>
      </header>

      <div style={{ background: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
        <p style={{ color: '#7f8c8d', marginBottom: '20px' }}>
          Confira quem são os jogadores mais lucrativos da BetAcademia!
        </p>

        <table style={{ wdivth: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '15px' }}>Posição</th>
              <th style={{ padding: '15px' }}>Jogador</th>
              <th style={{ padding: '15px' }}>Saldo Acumulado</th>
            </tr>
          </thead>
          <tbody>
            {jogadores.length === 0 ? (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>Nenhum jogador encontrado.</td>
              </tr>
            ) : (
              jogadores.map((jogador, index) => (
                <tr 
                  key={jogador.id} 
                  style={{ 
                    borderBottom: '1px solid #eee',
                    background: index === 0 ? '#fffbf0' : index === 1 ? '#f8f9fa' : index === 2 ? '#fdf6f2' : 'transparent',
                    fontWeight: index < 3 ? 'bold' : 'normal'
                  }}
                >
                  <td style={{ padding: '15px', fontSize: index < 3 ? '1.2rem' : '1rem' }}>
                    {renderizarPosicao(index)}
                  </td>
                  <td style={{ padding: '15px' }}>{jogador.nome}</td>
                  <td style={{ padding: '15px', color: '#27ae60', fontWeight: 'bold' }}>
                    R$ {jogador.saldo.toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}