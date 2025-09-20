import React, { useState } from "react";

export default function App() {
  const [image, setImage] = useState(null);
  const [pieces, setPieces] = useState([]);
  const rows = 4;
  const cols = 4;
  const pieceSize = 80; // tamaño de cada pieza en px
  const boardSize = pieceSize * cols;
  const [draggedPiece, setDraggedPiece] = useState(null);

  // Subir imagen
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Generar piezas
  const generatePuzzle = () => {
    if (!image) return;
    
    const newPieces = [];
    let id = 0;
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        newPieces.push({
          id: id++,
          originalPosition: { row, col },
          currentPosition: id - 1, // posición actual en el array
          style: {
            backgroundImage: `url(${image})`,
            backgroundSize: `${boardSize}px ${boardSize}px`,
            backgroundPosition: `-${col * pieceSize}px -${row * pieceSize}px`,
          },
        });
      }
    }
    
    setPieces(shuffleArray(newPieces));
  };

  // Mezclar array
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Drag & drop handlers
  const handleDragStart = (e, piece) => {
    setDraggedPiece(piece);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetPiece) => {
    e.preventDefault();
    
    if (!draggedPiece || draggedPiece.id === targetPiece.id) {
      setDraggedPiece(null);
      return;
    }

    const newPieces = [...pieces];
    const draggedIndex = newPieces.findIndex((p) => p.id === draggedPiece.id);
    const targetIndex = newPieces.findIndex((p) => p.id === targetPiece.id);

    // Intercambiar las piezas
    [newPieces[draggedIndex], newPieces[targetIndex]] = [
      newPieces[targetIndex],
      newPieces[draggedIndex],
    ];

    setPieces(newPieces);
    setDraggedPiece(null);
  };

  const handleDragEnd = () => {
    setDraggedPiece(null);
  };

  // Verificar si el puzzle está resuelto
  const isPuzzleSolved = () => {
    return pieces.every((piece, index) => {
      const expectedRow = Math.floor(piece.id / cols);
      const expectedCol = piece.id % cols;
      const currentRow = Math.floor(index / cols);
      const currentCol = index % cols;
      return expectedRow === currentRow && expectedCol === currentCol;
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-3">
          🧩 Puzzle Interactivo
        </h1>
        <p className="text-gray-300">Sube una imagen y resuelve el puzzle arrastrando las piezas</p>
      </div>

      <div className="flex flex-col items-center gap-4 mb-8">
        <div className="flex flex-col items-center gap-2">
          <label className="block text-sm font-medium text-gray-300">
            Selecciona una imagen:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer"
          />
        </div>

        {image && (
          <button
            onClick={generatePuzzle}
            className="bg-green-600 hover:bg-green-700 transition-colors px-6 py-2 rounded-lg font-semibold shadow-lg"
          >
            Generar Puzzle ({rows}x{cols})
          </button>
        )}
      </div>

      {/* Vista previa de la imagen original */}
      {image && (
        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-2 text-center">Imagen original:</p>
          <img
            src={image}
            alt="Original"
            className="max-w-48 max-h-48 object-contain border-2 border-gray-600 rounded-lg"
          />
        </div>
      )}

      {/* Contenedor del puzzle */}
      {pieces.length > 0 && (
        <div className="flex flex-col items-center">
          {isPuzzleSolved() && (
            <div className="mb-4 p-3 bg-green-600 text-white rounded-lg font-semibold animate-pulse">
              🎉 ¡Felicidades! ¡Puzzle resuelto!
            </div>
          )}
          
          <div
            className="grid border-4 border-yellow-400 bg-gray-700 rounded-lg shadow-2xl gap-0.5 p-2"
            style={{
              width: `${boardSize + 16}px`,
              height: `${boardSize + 16}px`,
              gridTemplateColumns: `repeat(${cols}, ${pieceSize}px)`,
              gridTemplateRows: `repeat(${rows}, ${pieceSize}px)`,
            }}
          >
            {pieces.map((piece, index) => (
              <div
                key={piece.id}
                draggable
                onDragStart={(e) => handleDragStart(e, piece)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, piece)}
                onDragEnd={handleDragEnd}
                className={`
                  border border-gray-900 cursor-move transition-all duration-200 hover:scale-105 hover:shadow-lg
                  ${draggedPiece?.id === piece.id ? 'opacity-50 scale-95' : ''}
                `}
                style={{
                  width: `${pieceSize}px`,
                  height: `${pieceSize}px`,
                  backgroundImage: piece.style.backgroundImage,
                  backgroundSize: piece.style.backgroundSize,
                  backgroundPosition: piece.style.backgroundPosition,
                  backgroundRepeat: 'no-repeat',
                }}
              />
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-400">
              Arrastra las piezas para intercambiar posiciones
            </p>
          </div>
        </div>
      )}
    </div>
  );
}