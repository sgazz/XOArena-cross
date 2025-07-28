import React, { useState, useEffect } from 'react';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonGrid, IonRow, IonCol, IonText } from '@ionic/react';
import './TicTacToe.css';

interface Square {
  value: string | null;
  isWinning: boolean;
  isHovered: boolean;
}

interface GameBoard {
  id: number;
  squares: Square[];
  xIsNext: boolean;
  gameOver: boolean;
  winner: string | null;
}

const TicTacToe: React.FC = () => {
  const [gameBoards, setGameBoards] = useState<GameBoard[]>([]);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [score, setScore] = useState({ X: 0, O: 0, draws: 0 });

  useEffect(() => {
    // Initialize 8 game boards
    const initialBoards: GameBoard[] = Array.from({ length: 8 }, (_, index) => ({
      id: index,
      squares: Array(9).fill({ value: null, isWinning: false, isHovered: false }),
      xIsNext: true,
      gameOver: false,
      winner: null
    }));
    setGameBoards(initialBoards);

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

  const handleClick = (boardId: number, squareIndex: number) => {
    const board = gameBoards[boardId];
    if (board.squares[squareIndex].value || board.gameOver) return;

    const newSquares = board.squares.slice();
    newSquares[squareIndex] = { 
      value: board.xIsNext ? 'X' : 'O', 
      isWinning: false, 
      isHovered: false 
    };
    
    const winner = calculateWinner(newSquares);
    let isDraw = false;
    
    if (winner) {
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
          break;
        }
      }
      
      setScore(prev => ({ ...prev, [winner]: prev[winner as keyof typeof prev] + 1 }));
    } else if (newSquares.every(square => square.value)) {
      isDraw = true;
      setScore(prev => ({ ...prev, draws: prev.draws + 1 }));
    }

    const updatedBoard: GameBoard = {
      ...board,
      squares: newSquares,
      xIsNext: !board.xIsNext,
      gameOver: !!winner || isDraw,
      winner
    };

    setGameBoards(prev => prev.map(b => b.id === boardId ? updatedBoard : b));
  };

  const handleSquareHover = (boardId: number, squareIndex: number, isHovered: boolean) => {
    const board = gameBoards[boardId];
    if (!board.squares[squareIndex].value && !board.gameOver) {
      const newSquares = board.squares.slice();
      newSquares[squareIndex] = { ...newSquares[squareIndex], isHovered };
      
      setGameBoards(prev => prev.map(b => 
        b.id === boardId 
          ? { ...b, squares: newSquares }
          : b
      ));
    }
  };

  const resetGame = () => {
    const resetBoards: GameBoard[] = gameBoards.map(board => ({
      ...board,
      squares: Array(9).fill({ value: null, isWinning: false, isHovered: false }),
      xIsNext: true,
      gameOver: false,
      winner: null
    }));
    setGameBoards(resetBoards);
  };

  const resetScore = () => {
    setScore({ X: 0, O: 0, draws: 0 });
  };

  const renderSquare = (boardId: number, squareIndex: number) => {
    const board = gameBoards[boardId];
    const square = board.squares[squareIndex];
    
    return (
      <div
        key={squareIndex}
        className={`xoa-square-container ${square.isWinning ? 'winning' : ''} ${square.isHovered ? 'hovered' : ''}`}
        onMouseEnter={() => handleSquareHover(boardId, squareIndex, true)}
        onMouseLeave={() => handleSquareHover(boardId, squareIndex, false)}
        onClick={() => handleClick(boardId, squareIndex)}
      >
        <div className="xoa-square-inner">
          <span className="square-text">{square.value}</span>
          {square.isHovered && !square.value && !board.gameOver && (
            <span className="hover-preview">{board.xIsNext ? 'X' : 'O'}</span>
          )}
        </div>
      </div>
    );
  };

  const renderGameBoard = (board: GameBoard) => {
    const status = board.winner 
      ? `🏆 ${board.winner} pobedio!` 
      : board.gameOver 
      ? '🤝 Nerešeno!' 
      : `🎯 ${board.xIsNext ? 'X' : 'O'}`;

    return (
      <div key={board.id} className="game-board-container">
        <div className="board-header">
          <h3 className="board-title">Tabla {board.id + 1}</h3>
          <div className="board-status">{status}</div>
        </div>
        
        <div className="board-grid">
          {Array(9).fill(null).map((_, i) => renderSquare(board.id, i))}
        </div>
      </div>
    );
  };

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

      {/* Game Cards Container */}
      <div className="xoa-game-cards-container">
        <div className="cards-header">
          <h1 className="game-title">XOArena - 8 Tabli</h1>
          <div className="game-description">
            Igrajte na 8 tabli istovremeno! Svaka tabla je nezavisna igra.
          </div>
        </div>
        
        <div className="boards-grid">
          {gameBoards.map(board => renderGameBoard(board))}
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