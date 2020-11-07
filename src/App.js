import React, { useState, useCallback, useRef } from "react";
import produce from "immer";
import "./App.css";

// setting dimensions for grid

const numRows = 60;
const numCols = 60;

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

const generateEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }
  return rows;
};

const generateRandomGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => (Math.random() > 0.65 ? 1 : 0)));
  }
  return rows;
};

const generateGlider = () => {
  const gliderGrid = generateEmptyGrid();

  gliderGrid[1][0] = 1;
  gliderGrid[2][1] = 1;
  gliderGrid[0][2] = 1;
  gliderGrid[1][2] = 1;
  gliderGrid[2][2] = 1;

  return gliderGrid;
};

const generateBlinker = () => {
  const blinkerGrid = generateEmptyGrid();

  blinkerGrid[2][1] = 1;
  blinkerGrid[2][2] = 1;
  blinkerGrid[2][3] = 1;

  return blinkerGrid;
};

const generatePulsar = () => {
  const pulsarGrid = generateEmptyGrid();

  pulsarGrid[4][2] = 1;
  pulsarGrid[5][2] = 1;
  pulsarGrid[6][2] = 1;
  pulsarGrid[10][2] = 1;
  pulsarGrid[11][2] = 1;
  pulsarGrid[12][2] = 1;

  pulsarGrid[4][7] = 1;
  pulsarGrid[5][7] = 1;
  pulsarGrid[6][7] = 1;
  pulsarGrid[10][7] = 1;
  pulsarGrid[11][7] = 1;
  pulsarGrid[12][7] = 1;

  pulsarGrid[4][9] = 1;
  pulsarGrid[5][9] = 1;
  pulsarGrid[6][9] = 1;
  pulsarGrid[10][9] = 1;
  pulsarGrid[11][9] = 1;
  pulsarGrid[12][9] = 1;

  pulsarGrid[4][14] = 1;
  pulsarGrid[5][14] = 1;
  pulsarGrid[6][14] = 1;
  pulsarGrid[10][14] = 1;
  pulsarGrid[11][14] = 1;
  pulsarGrid[12][14] = 1;

  pulsarGrid[2][4] = 1;
  pulsarGrid[7][4] = 1;
  pulsarGrid[9][4] = 1;
  pulsarGrid[14][4] = 1;

  pulsarGrid[2][5] = 1;
  pulsarGrid[7][5] = 1;
  pulsarGrid[9][5] = 1;
  pulsarGrid[14][5] = 1;

  pulsarGrid[2][6] = 1;
  pulsarGrid[7][6] = 1;
  pulsarGrid[9][6] = 1;
  pulsarGrid[14][6] = 1;

  pulsarGrid[2][10] = 1;
  pulsarGrid[7][10] = 1;
  pulsarGrid[9][10] = 1;
  pulsarGrid[14][10] = 1;

  pulsarGrid[2][11] = 1;
  pulsarGrid[7][11] = 1;
  pulsarGrid[9][11] = 1;
  pulsarGrid[14][11] = 1;

  pulsarGrid[2][12] = 1;
  pulsarGrid[7][12] = 1;
  pulsarGrid[9][12] = 1;
  pulsarGrid[14][12] = 1;

  return pulsarGrid;
};

const genTri = (numRows = 60, numCols = 60) => {
  let newGrid = [];
  for (let i = 0; i < numRows; i++) {
    newGrid.push(Array.from(Array(numCols), () => 0));
    for (let j = 0; j < numCols; j++) {
      if (i % 2 !== 0) {
        if (j >= i || j <= numCols - 1 - i) {
          newGrid[i][j] = 1;
        }
      }
    }
  }
  return newGrid;
};

const genHourGlass = (numRows = 60, numCols = 60) => {
  let newGrid = [];
  for (let i = 0; i < numRows; i++) {
    newGrid.push(Array.from(Array(numCols), () => 0));
    for (let j = 0; j < numCols; j++) {
      if (i % 2 !== 0 && i < numRows / 2) {
        if (j >= i && j <= numCols - 1 - i) {
          newGrid[i][j] = 1;
        }
      } else if (i % 2 !== 0 && i > numRows / 2) {
        if (j <= i && j >= numCols - 1 - i) {
          newGrid[i][j] = 1;
        }
      }
    }
  }
  return newGrid;
};

const genRect = (numRows = 60, numCols = 60) => {
  let newGrid = [];
  for (let i = 0; i < numRows; i++) {
    newGrid.push(Array.from(Array(numCols), () => 0));
    for (let j = 0; j < numCols; j++) {
      if (i % 2 !== 0 && i < numRows / 2) {
        if (j >= i && j <= numCols - 1 - i) {
          newGrid[i][j] = 1;
        }
      } else if (i % 2 !== 0 && i > numRows / 2) {
        if (j <= i && j >= numCols - 1 - i) {
          newGrid[i][j] = 1;
        }
      }

      if (j % 2 !== 0 && j < numCols / 2) {
        if (i >= j && i < numRows - 1 - j) {
          newGrid[i][j] = 1;
        }
      } else if (j % 2 !== 0 && j > numCols / 2) {
        if (i <= j && i > numRows - 1 - j) {
          newGrid[i][j] = 1;
        }
      }
    }
  }
  return newGrid;
};

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
                setSpeed(20);
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
