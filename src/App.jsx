import React, { useState } from "react";

export default function App() {
  const [image, setImage] = useState(null);
  const [pieces, setPieces] = useState([]);
  const rows = 4;
  const cols = 4;
  const pieceSize = 100; // tamaño aumentado para mejor visibilidad
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
          style: {
            backgroundImage: `url(${image})`,
            backgroundSize: `${boardSize}px ${boardSize}px`,
            backgroundPosition: `-${col * pieceSize}px -${row * pieceSize}px`,
            backgroundRepeat: 'no-repeat',
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

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
    color: 'white',
    padding: '24px',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  };

  const puzzleBoardStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, ${pieceSize}px)`,
    gridTemplateRows: `repeat(${rows}, ${pieceSize}px)`,
    gap: '2px',
    border: '4px solid #fbbf24',
    borderRadius: '12px',
    backgroundColor: '#374151',
    padding: '8px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    width: `${boardSize + 20}px`,
    height: `${boardSize + 20}px`
  };

  const pieceStyle = (piece) => ({
    width: `${pieceSize}px`,
    height: `${pieceSize}px`,
    border: '1px solid #111827',
    cursor: 'move',
    transition: 'all 0.2s ease',
    opacity: draggedPiece?.id === piece.id ? 0.5 : 1,
    transform: draggedPiece?.id === piece.id ? 'scale(0.95)' : 'scale(1)',
    ...piece.style
  });

  return (
    <div style={containerStyle}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ 
          fontSize: '2.25rem', 
          fontWeight: 'bold', 
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px'
        }}>
          🧩 Puzzle Interactivo
        </h1>
        <p style={{ color: '#d1d5db' }}>Sube una imagen y resuelve el puzzle arrastrando las piezas</p>
      </div>

      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '16px', 
        marginBottom: '32px' 
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontSize: '14px', fontWeight: '500', color: '#d1d5db' }}>
            Selecciona una imagen:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{
              display: 'block',
              width: '100%',
              fontSize: '14px',
              color: '#d1d5db',
              backgroundColor: 'transparent',
              border: '2px solid #374151',
              borderRadius: '8px',
              padding: '8px'
            }}
          />
        </div>

        {image && (
          <button
            onClick={generatePuzzle}
            style={{
              backgroundColor: '#059669',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#047857'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#059669'}
          >
            Generar Puzzle ({rows}x{cols})
          </button>
        )}
      </div>

      {/* Vista previa de la imagen original */}
      {image && (
        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '8px' }}>Imagen original:</p>
          <img
            src={image}
            alt="Original"
            style={{
              maxWidth: '200px',
              maxHeight: '200px',
              objectFit: 'contain',
              border: '2px solid #4b5563',
              borderRadius: '8px'
            }}
          />
        </div>
      )}

      {/* Contenedor del puzzle */}
      {pieces.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {isPuzzleSolved() && (
            <div style={{
              marginBottom: '16px',
              padding: '12px',
              backgroundColor: '#059669',
              color: 'white',
              borderRadius: '8px',
              fontWeight: '600',
              animation: 'pulse 2s infinite'
            }}>
              🎉 ¡Felicidades! ¡Puzzle resuelto!
            </div>
          )}
          
          <div style={puzzleBoardStyle}>
            {pieces.map((piece, index) => (
              <div
                key={piece.id}
                draggable
                onDragStart={(e) => handleDragStart(e, piece)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, piece)}
                onDragEnd={handleDragEnd}
                style={pieceStyle(piece)}
                onMouseOver={(e) => {
                  if (draggedPiece?.id !== piece.id) {
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
                  }
                }}
                onMouseOut={(e) => {
                  if (draggedPiece?.id !== piece.id) {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              />
            ))}
          </div>
          
          <div style={{ marginTop: '16px', textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: '#9ca3af' }}>
              Arrastra las piezas para intercambiar posiciones
            </p>
            <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
              Total de piezas: {pieces.length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}