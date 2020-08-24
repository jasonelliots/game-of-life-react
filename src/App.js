import React, { useState, useCallback, useRef } from 'react';
import produce from 'immer';
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

function App() {

  // setting state to initialize empty grid 

  const [grid, setGrid] = useState(() => {
    const rows = [];
    for (let i = 0; i < numRows; i++){
      rows.push(Array.from(Array(numCols), () => 0))
    }
    return rows;
  });

  const [running, setRunning] = useState(false)
  // what is rendering to screen 

  // gets current 'running' value for useCallback function below which only runs once 
  const runningRef = useRef(running);
  runningRef.current = running 

// useCallback - so function isn't recreated every rerender
  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      //basecase to stop simulating when not running 
      return;
    }
    
    setGrid(g => {
      return produce(g, gridCopy=> {
        for (let i=0; i < numRows; i++){
          for (let j = 0; j < numCols; j++){
            let neighbors = 0; 

            neighborLocations.forEach(([x, y]) => {
              const newI = i + x;
              const newJ = j + y; 
              if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
                neighbors += g[newI][newJ]
              }
            })
       
            // if (gridCopy[i][j+1] === 1 ){
            //   neighbors += 1
            // }
            // if (gridCopy[i][j-1] === 1 ){
            //   neighbors += 1
            // }
            // if (gridCopy[i-1][j+1] === 1){
            //   neighbors += 1
            // }
            // if (gridCopy[i-1][j] === 1){
            //   neighbors += 1
            // }
            // if (gridCopy[i-1][i-1] === 1){
            //   neighbors += 1
            // }
            // if (gridCopy[i+1][j+1] === 1){
            //   neighbors += 1
            // }
            // if (gridCopy[i+1][j] === 1){
            //   neighbors += 1
            // }
            // if (gridCopy[i+1][i-1] === 1){
            //   neighbors += 1
            // }

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

    setTimeout(runSimulation, 1000);

  }, [])

  return (
    <>
    <button onClick={() => {
      setRunning(!running);
      if(!running){
      runningRef.current = true; 
      runSimulation()
      }
      }}>
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
