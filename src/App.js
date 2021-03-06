import React, { useState, useCallback, useRef } from "react";
import produce from "immer";
import "./App.css";
import { generateEmptyGrid, generateRandomGrid, genHourGlass, genRect, genTri, numRows, numCols } from './grids';


// map for neighbor locations - used to check if neighbors for a given cell are alive or dead 
const neighborLocations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

function App() {
  // setting state to initialize empty grid
  const [grid, setGrid] = useState(generateRandomGrid());
  const [running, setRunning] = useState(false);
  const [generationCount, setGenerationCount] = useState(0);
  const [speed, setSpeed] = useState(120);
  // gets current 'running' value for useCallback function below which only runs once
  const runningRef = useRef(running);
  runningRef.current = running;

  const speedRef = useRef(speed);
  speedRef.current = speed;

  // useCallback - so function isn't recreated every rerender
  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      //basecase to stop simulating when not running
      return;
    }

    setGenerationCount((c) => c + 1);

    setGrid((oldGrid) => {
      return produce(oldGrid, (gridCopy) => {
        // iterating through each cell in grid
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            let neighbors = 0;
            // checking how many neighbors are alive 
            neighborLocations.forEach(([x, y]) => {
              const neighborI = i + x;
              const neighborJ = j + y;
              if (
                neighborI >= 0 &&
                neighborI < numRows &&
                neighborJ >= 0 &&
                neighborJ < numCols
              ) {
                neighbors += oldGrid[neighborI][neighborJ];
              }
            });

            // logic for killing + enlivening each cell based on number of neighbors
            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][j] = 0;
            } else if (gridCopy[i][j] === 0 && neighbors === 3) {
              gridCopy[i][j] = 1;
            }
          }
        }
      });
    });

    setTimeout(runSimulation, speedRef.current);
  }, []);

  return (
    <div className="biggestContainer">
      <h1>
        Conway's Game of Life{" "}
        <span role="img" aria-label="sprout">
          🍄
        </span>
      </h1>
      <div className="bigContainer">
        <div className="leftContainer">
          <div className="topButtons">
            <button
              onClick={() => {
                setRunning(!running);
                if (!running) {
                  runningRef.current = true;
                  runSimulation();
                }
              }}
            >
              {running ? "Stop" : "Start"}
            </button>
            <button
              onClick={() => {
                setGrid(generateEmptyGrid());
                setGenerationCount(0);
              }}
            >
              Clear
            </button>
            <button> Generation: {generationCount}</button>
          </div>

          {/* end topButtons container */}
          <div className="grid">
            {grid.map((row, i) =>
              // mapping through individual cells
              row.map((col, k) => (
                <div
                  className="cells"
                  key={`${i}-${k}`}
                  onClick={() => {
                    if (!running) {
                      const newGrid = produce(grid, (gridCopy) => {
                        gridCopy[i][k] = grid[i][k] ? 0 : 1;
                      });
                      setGrid(newGrid);
                    }
                  }}
                  style={{
                    backgroundColor: grid[i][k] ? "green" : "black",
                  }}
                />
              ))
            )}
          </div>
          <div className="bottomButtons">
            <div> <br />Preset patterns:</div>
            <button
              onClick={() => {
                setGrid(generateRandomGrid());
              }}

              className="presetButton"
            >
              <img src="random.png" alt="maze" className="pattern" />
            </button>

            <button
              onClick={() => {
                setGrid(genRect());
              }}

              className="presetButton"
            >
              <img src="maze.png" alt="maze" className="pattern" />
            </button>
            <button
              onClick={() => {
                setGrid(genHourGlass());
              }}
              className="presetButton"
            >
              <img src="hourglass.png" alt="maze" className="pattern" />
            </button>
            <button
              onClick={() => {
                setGrid(genTri());
              }}

              className="presetButton"
            >
              <img src="tri.png" alt="maze" className="pattern" />
            </button>
          </div>
          {/* end bottomButtons container */}
          <div className="bottomButtons2">
            <div> Adjust speed:</div>
            <button
              onClick={() => {
                setSpeed(600);
              }}
            >
              {" "}
              Slow
            </button>
            <button
              onClick={() => {
                setSpeed(120);
              }}
            >
              {" "}
              Medium
            </button>
            <button
              onClick={() => {
                setSpeed(35);
              }}
            >
              {" "}
              Fast
            </button>
          </div>

          {/* end bottomButtons container2 */}
        </div>
        {/* end leftContainer */}
        <div className="rightContainer">
          <div className="description">
            <div className="play">
              <h3>Play</h3>
              Click the cells you would like to bring alive or select one of the
              preset patterns. Begin the simulation by clicking start.
            </div>
            <div className="rules">
              <h3> Algorithim rules </h3>
              <div className="rulesText">
                {" "}
                <span role="img" aria-label="mushroom">
                  🍄
                </span>{" "}
                Any live cell with fewer than two neighbors dies.
              </div>
              <div className="rulesText">
                <span role="img" aria-label="mushroom">
                  🍄
                </span>{" "}
                Any live cell with two or three live neighbors lives on.
              </div>
              <div className="rulesText">
                <span role="img" aria-label="mushroom">
                  🍄
                </span>{" "}
                Any live cell with more than three live neighbors dies.{" "}
              </div>
              <div className="rulesText">
                <span role="img" aria-label="mushroom">
                  🍄
                </span>{" "}
                Any dead cell with exactly three live neighbors is born.
              </div>
            </div>
          </div>
          {/* end description container */}
        </div>
        {/* end right container */}
      </div>
      {/* end bigContainer */}
      <div className="about">
        <h3>About</h3>
        Conway's Game of Life is a 'cellular automaton' invented by
        mathemetician{" "}
        <a href="https://www.youtube.com/watch?v=R9Plq-D1gEk">John Conway</a>.
        Using a few simple conditional rules (listed above), the Turing-complete
        program simulates a certain evolutionary process unfolding based upon
        its initial state. Just as in nature, the units in Conway's Game of Life
        respond and evolve with their surrounding environment. John Conway
        passed away in April 2020, but the Game of Life goes on.{" "}
        <p>
          "Why are numbers{" "}
          <a href="https://www.youtube.com/watch?v=Aq51GfPmD54">beautiful</a>?
          It’s like asking why is Beethoven’s Ninth Symphony beautiful. If you
          don’t see why, someone can’t tell you. I know numbers are beautiful.
          If they aren’t beautiful, nothing is." - Paul Erdos
        </p>
      </div>
      {/* end about container */}
    </div>
    // end biggestContainer
  );
}

export default App;
