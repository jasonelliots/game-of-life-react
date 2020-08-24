import React, { useState } from 'react';
import produce from 'immer';
import './App.css';


// setting dimensions for grid 

const numRows = 25;
const numCols = 25; 

function App() {

  // setting state to initialize empty grid 

  const [grid, setGrid] = useState(() => {
    const rows = [];
    for (let i = 0; i < numRows; i++){
      rows.push(Array.from(Array(numCols), () => 0))
    }
    return rows;
  });

  const [running, setRunning ] = useState(false)
  // what is rendering to screen 

  return (
    <>
    <button 
    onClick={() => {
      setRunning(!running)
    }}
    >
      {running? 'stop': 'start'}
    </button>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${numCols}, 16px)`
      }}
    >

      {grid.map((row, i) => 
      // mapping through individual cells 
        row.map((col, k) => (
        <div 
        key={`${i}-${k}`}
        onClick={() => {
          const newGrid = produce(grid, gridCopy => {
            gridCopy[i][k] = grid[i][k] ? 0: 1;
          });
          setGrid(newGrid); 
        }}
        style={{
          width: 16,
          height: 16,
          backgroundColor: grid[i][k] ? "green" : "brown",
          border: "solid 1px black"
          }}
          /> 
        ))
      )}

    </div>
    </>
  );
}

export default App;
