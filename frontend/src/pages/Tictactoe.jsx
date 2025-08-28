import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { io } from "socket.io-client";
import Loading from "../components/Loading";

const Tictactoe = () => {
  const { user, token, API } = useAuth();
  const [socket, setSocket] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [status, setStatus] = useState("active");
  const [winner, setWinner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || !token) return;

    const newSocket = io(API, {
      auth: { token: `Bearer ${token}` },
    });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to Socket.IO");
      newSocket.emit("joinGame", {
        userId: user._id,
        partnerEmail: user.partnerEmail
      });
    });

    newSocket.on("gameState", (gameData) => {
      setGameId(gameData.gameId);
      setBoard(gameData.board);
      setCurrentPlayer(gameData.currentPlayer);
      setStatus(gameData.status);
      setWinner(gameData.winner);
      setLoading(false);
    });

    newSocket.on("moveMade", (gameData) => {
      setBoard(gameData.board);
      setCurrentPlayer(gameData.currentPlayer);
      setStatus(gameData.status);
      setWinner(gameData.winner);
      setError("");
    });

    newSocket.on("gameReset", (gameData) => {
      setBoard(gameData.board);
      setCurrentPlayer(gameData.currentPlayer);
      setStatus(gameData.status);
      setWinner(gameData.winner);
      setError("");
    });

    newSocket.on("gameError", ({ message }) => {
      setError(message);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [API, token, user]);

  const handleMove = (index) => {
    if (!socket || !gameId || status !== "active" || board[index]) return;
    
    socket.emit("makeMove", {
      gameId,
      index,
      userId: user._id
    });
  };

  const handleReset = () => {
    if (!socket || !gameId) return;
    socket.emit("resetGame", { gameId });
  };

  if (loading) return <Loading />;

  if (!user?.partnerEmail) {
    return (
      <div className="p-6 max-w-lg mx-auto bg-white rounded-2xl shadow-md mt-10">
        <p className="text-center text-red-500">Please link a partner to play the game</p>
      </div>
    );
  }

  // Determine if it's current user's turn
  const isUserTurn = () => {
    if (!user || !gameId) return false;
    // The backend handles turn validation
    return status === "active";
  };

  const getStatusMessage = () => {
    if (status === "active") {
      return `Current Player: ${currentPlayer}`;
    } else if (status === "completed") {
      return `Winner: ${winner}`;
    } else {
      return "It's a draw!";
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-2xl shadow-md mt-10">
      <h2 className="text-2xl font-bold text-center mb-4">Tic-Tac-Toe</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 mb-4">
        {board.map((cell, index) => (
          <button
            key={index}
            className="w-16 h-16 border-2 border-gray-300 text-2xl font-bold flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
            onClick={() => handleMove(index)}
            disabled={!isUserTurn() || cell !== null || status !== "active"}
          >
            {cell}
          </button>
        ))}
      </div>

      <div className="text-center mb-4">
        <p className="text-lg font-semibold">{getStatusMessage()}</p>
      </div>

      <div className="text-center">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          onClick={handleReset}
          disabled={status === "active" && board.every(cell => cell === null)}
        >
          Reset Game
        </button>
      </div>
    </div>
  );
};

export default Tictactoe;