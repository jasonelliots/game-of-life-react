import React, { useState, useCallback, useRef } from 'react';
import produce, { setAutoFreeze } from 'immer';
import './App.css';


// setting dimensions for grid 

const numRows = 25;
const numCols = 25; 

const neighborLocations = [
  [0,1],
  [0,-1],
  [1,-1],
  [-1,1],
  [1, 1],
  [-1,-1],
  [1, 0],
  [-1, 0]
]

const generateEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++){
    rows.push(Array.from(Array(numCols), () => 0))
  }
  return rows;
}

const generateRandomGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++){
    rows.push(Array.from(Array(numCols), () => Math.random() > .5 ? 1: 0))
  }
  return rows;
} 

const generateGlider = () => {

  const gliderGrid = generateEmptyGrid()

  gliderGrid[1][0] = 1
  gliderGrid[2][1] = 1
  gliderGrid[0][2] = 1
  gliderGrid[1][2] = 1
  gliderGrid[2][2] = 1

  return gliderGrid;
} 


const generateBlinker = () => {

  const blinkerGrid = generateEmptyGrid()

  blinkerGrid[2][1] = 1
  blinkerGrid[2][2] = 1
  blinkerGrid[2][3] = 1

  return blinkerGrid;
} 

const generatePulsar = () => {

  const pulsarGrid = generateEmptyGrid()

  pulsarGrid[4][2] = 1
  pulsarGrid[5][2] = 1
  pulsarGrid[6][2] = 1
  pulsarGrid[10][2] = 1
  pulsarGrid[11][2] = 1
  pulsarGrid[12][2] = 1

  pulsarGrid[4][7] = 1
  pulsarGrid[5][7] = 1
  pulsarGrid[6][7] = 1
  pulsarGrid[10][7] = 1
  pulsarGrid[11][7] = 1
  pulsarGrid[12][7] = 1

  pulsarGrid[4][9] = 1
  pulsarGrid[5][9] = 1
  pulsarGrid[6][9] = 1
  pulsarGrid[10][9] = 1
  pulsarGrid[11][9] = 1
  pulsarGrid[12][9] = 1

  pulsarGrid[4][14] = 1
  pulsarGrid[5][14] = 1
  pulsarGrid[6][14] = 1
  pulsarGrid[10][14] = 1
  pulsarGrid[11][14] = 1
  pulsarGrid[12][14] = 1

  pulsarGrid[2][4] = 1
  pulsarGrid[7][4] = 1
  pulsarGrid[9][4] = 1
  pulsarGrid[14][4] = 1

  pulsarGrid[2][5] = 1
  pulsarGrid[7][5] = 1
  pulsarGrid[9][5] = 1
  pulsarGrid[14][5] = 1

  pulsarGrid[2][6] = 1
  pulsarGrid[7][6] = 1
  pulsarGrid[9][6] = 1
  pulsarGrid[14][6] = 1

  pulsarGrid[2][10] = 1
  pulsarGrid[7][10] = 1
  pulsarGrid[9][10] = 1
  pulsarGrid[14][10] = 1

  pulsarGrid[2][11] = 1
  pulsarGrid[7][11] = 1
  pulsarGrid[9][11] = 1
  pulsarGrid[14][11] = 1

  pulsarGrid[2][12] = 1
  pulsarGrid[7][12] = 1
  pulsarGrid[9][12] = 1
  pulsarGrid[14][12] = 1



  return pulsarGrid;
} 


function App() {

  // setting state to initialize empty grid 

  const [grid, setGrid] = useState(generateEmptyGrid());
  const [running, setRunning] = useState(false)
  const [generationCount, setGenerationCount] = useState(0)


  // gets current 'running' value for useCallback function below which only runs once 
  const runningRef = useRef(running);
  runningRef.current = running 

// useCallback - so function isn't recreated every rerender
  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      //basecase to stop simulating when not running 
      return;
    }
    
    setGenerationCount(c => c+1)

    setGrid(g => {
      return produce(g, gridCopy => {
        // iterating through each cell in grid 
        for (let i=0; i < numRows; i++){
          for (let j = 0; j < numCols; j++){
            let neighbors = 0; 

            neighborLocations.forEach(([x, y]) => {
              const neighborI = i + x;
              const neighborJ = j + y; 
              if (neighborI >= 0 && neighborI < numRows && neighborJ >= 0 && neighborJ < numCols) {
                neighbors += g[neighborI][neighborJ]
              }
            })

            // logic for killing + enlivening each cell based on number of neighbors
            if(neighbors < 2 || neighbors > 3){
              gridCopy[i][j] = 0
            } else if (gridCopy[i][j] === 0 && neighbors === 3){
              gridCopy[i][j] = 1
            }
          }
        } 
      });
    });

    setTimeout(runSimulation, 200);

  }, [])

  return (
    <div className="bigContainer">
    <h1>Conway's Game of Life</h1>
    <div className='grid'>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${numCols}, 16px)`,
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
          backgroundColor: grid[i][k] ? "green" : "white",
          border: "solid 1px black"
          }}
          /> 
        ))
      )}
    </div>
    </div>
    <button onClick={() => {
      setRunning(!running);
      if(!running){
      runningRef.current = true; 
      runSimulation()
      }
      }}>
      {running? 'stop': 'start'}
    </button>
    <button onClick={() => {
      setGrid(generateEmptyGrid());
      setGenerationCount(0);
    }}>
      Clear
    </button>
    <button onClick={() => {
      setGrid(generateRandomGrid()); 
    }}>
      Random
    </button>

    Preset Patterns:
    <button onClick={() => {
      setGrid(generateGlider()); 
    }}>
      Glider
    </button>
    <button onClick={() => {
      setGrid(generateBlinker()); 
    }}>
      Blinker
    </button>
    <button onClick={() => {
      setGrid(generatePulsar()); 
    }}>
      Pulsar
    </button>
    
    <div> Generation: {generationCount}</div>
    </div>
  );
}

export default App;

