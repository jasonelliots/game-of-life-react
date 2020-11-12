export const numRows = 60;
export const numCols = 60;

export const generateEmptyGrid = () => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0));
    }
    return rows;
  };
  
export const generateRandomGrid = () => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => (Math.random() > 0.65 ? 1 : 0)));
    }
    return rows;
  };
  
export const generateGlider = () => {
    const gliderGrid = generateEmptyGrid();
  
    gliderGrid[1][0] = 1;
    gliderGrid[2][1] = 1;
    gliderGrid[0][2] = 1;
    gliderGrid[1][2] = 1;
    gliderGrid[2][2] = 1;
  
    return gliderGrid;
  };
  
export const generateBlinker = () => {
    const blinkerGrid = generateEmptyGrid();
  
    blinkerGrid[2][1] = 1;
    blinkerGrid[2][2] = 1;
    blinkerGrid[2][3] = 1;
  
    return blinkerGrid;
  };
  
export const generatePulsar = () => {
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
  
export const genTri = (numRows = 60, numCols = 60) => {
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
  
export const genHourGlass = (numRows = 60, numCols = 60) => {
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
  
export const genRect = (numRows = 60, numCols = 60) => {
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