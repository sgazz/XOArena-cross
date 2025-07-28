import React, { useState, useEffect } from 'react';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonGrid, IonRow, IonCol, IonText } from '@ionic/react';
import './TicTacToe.css';

interface Square {
  value: string | null;
  isWinning: boolean;
  isHovered: boolean;
}

const TicTacToe: React.FC = () => {
  const [squares, setSquares] = useState<Square[]>(Array(9).fill({ value: null, isWinning: false, isHovered: false }));
  const [xIsNext, setXIsNext] = useState<boolean>(true);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [score, setScore] = useState({ X: 0, O: 0, draws: 0 });

  useEffect(() => {
    // Animate logo on mount
    const timer = setTimeout(() => setGameStarted(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const calculateWinner = (squares: Square[]): string | null => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // horizontal
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // vertical
      [0, 4, 8], [2, 4, 6] // diagonal
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a].value && squares[a].value === squares[b].value && squares[a].value === squares[c].value) {
        return squares[a].value;
      }
    }
    return null;
  };

  const handleClick = (i: number) => {
    if (squares[i].value || gameOver) return;

    const newSquares = squares.slice();
    newSquares[i] = { value: xIsNext ? 'X' : 'O', isWinning: false, isHovered: false };
    
    setSquares(newSquares);
    setXIsNext(!xIsNext);

    const winner = calculateWinner(newSquares);
    if (winner) {
      setGameOver(true);
      setScore(prev => ({ ...prev, [winner]: prev[winner as keyof typeof prev] + 1 }));
      
      // Highlight winning squares
      const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
      ];
      
      for (let j = 0; j < lines.length; j++) {
        const [a, b, c] = lines[j];
        if (newSquares[a].value && newSquares[a].value === newSquares[b].value && newSquares[a].value === newSquares[c].value) {
          newSquares[a] = { ...newSquares[a], isWinning: true };
          newSquares[b] = { ...newSquares[b], isWinning: true };
          newSquares[c] = { ...newSquares[c], isWinning: true };
          setSquares(newSquares);
          break;
        }
      }
    } else if (newSquares.every(square => square.value)) {
      setGameOver(true);
      setScore(prev => ({ ...prev, draws: prev.draws + 1 }));
    }
  };

  const handleSquareHover = (i: number, isHovered: boolean) => {
    if (!squares[i].value && !gameOver) {
      const newSquares = squares.slice();
      newSquares[i] = { ...newSquares[i], isHovered };
      setSquares(newSquares);
    }
  };

  const resetGame = () => {
    setSquares(Array(9).fill({ value: null, isWinning: false, isHovered: false }));
    setXIsNext(true);
    setGameOver(false);
  };

  const resetScore = () => {
    setScore({ X: 0, O: 0, draws: 0 });
  };

  const renderSquare = (i: number) => {
    return (
      <div
        key={i}
        className={`xoa-square-container ${squares[i].isWinning ? 'winning' : ''} ${squares[i].isHovered ? 'hovered' : ''}`}
        onMouseEnter={() => handleSquareHover(i, true)}
        onMouseLeave={() => handleSquareHover(i, false)}
        onClick={() => handleClick(i)}
      >
        <div className="xoa-square-inner">
          <span className="square-text">{squares[i].value}</span>
          {squares[i].isHovered && !squares[i].value && !gameOver && (
            <span className="hover-preview">{xIsNext ? 'X' : 'O'}</span>
          )}
        </div>
      </div>
    );
  };

  const winner = calculateWinner(squares);
  const isDraw = squares.every(square => square.value) && !winner;
  const status = winner 
    ? `🏆 ${winner} je pobednik!` 
    : isDraw 
    ? '🤝 Nerešeno!' 
    : `🎯 Sledeći: ${xIsNext ? 'X' : 'O'}`;

  return (
    <div className="xoa-container">
      {/* Animated Background */}
      <div className="xoa-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      {/* Header with Logo */}
      <div className="xoa-header">
        <div className={`xoa-logo ${gameStarted ? 'animate' : ''}`}>
          <div className="logo-circle">
            <div className="logo-xo">XO</div>
            <div className="logo-arena">ARENA</div>
            <div className="logo-glow"></div>
          </div>
        </div>
        
        {/* Score Board */}
        <div className="xoa-score-board">
          <div className="score-item">
            <span className="score-label">X</span>
            <span className="score-value">{score.X}</span>
          </div>
          <div className="score-item">
            <span className="score-label">O</span>
            <span className="score-value">{score.O}</span>
          </div>
          <div className="score-item">
            <span className="score-label">Draw</span>
            <span className="score-value">{score.draws}</span>
          </div>
        </div>
      </div>

      {/* Game Card */}
      <div className="xoa-game-card">
        <div className="card-header">
          <h1 className="game-title">TicTacToe</h1>
          <div className="status-indicator">
            <span className="status-text">{status}</span>
          </div>
        </div>
        
        <div className="game-board">
          <div className="board-grid">
            {Array(9).fill(null).map((_, i) => renderSquare(i))}
          </div>
        </div>

        <div className="game-actions">
          <button 
            className="action-btn primary-btn"
            onClick={resetGame}
          >
            <span className="btn-icon">🔄</span>
            <span className="btn-text">Nova Igra</span>
          </button>
          
          <button 
            className="action-btn secondary-btn"
            onClick={resetScore}
          >
            <span className="btn-icon">📊</span>
            <span className="btn-text">Reset Score</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicTacToe; 