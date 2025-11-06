// quantumSolver.worker.ts
// Web Worker for quantum maze solving algorithm

// Define message types for communication with main thread
interface WorkerMessage {
  type: string;
  payload?: any;
}

// Define maze configuration type
interface MazeConfig {
  GRID: number[][];
  START: { row: number; col: number };
  END: { row: number; col: number };
  DIMENSIONS: number;
}

// Define the quantum solver state
interface QuantumState {
  wave: Set<string>;
  solution: { row: number; col: number }[] | null;
  found: boolean;
}

// Global variables for the worker
let animationId: number | null = null;
let mazeConfig: MazeConfig | null = null;
let visitedArray: boolean[][] | null = null;
let queue: { row: number, col: number }[][] = [];
let startTime: number = 0;

// Function to convert position to string ID
const toId = (pos: { row: number, col: number }) => `${pos.row}-${pos.col}`;

// Function to create the solver state from internal data
const getQuantumState = (): QuantumState => {
  const wave = new Set<string>();
  if (queue.length > 0) {
    // Get all current paths and add their last positions to the wave
    for (const path of queue) {
      const lastPos = path[path.length - 1];
      wave.add(toId(lastPos));
    }
  }
  return {
    wave,
    solution: null, // Will be set when found
    found: false // Will be set when found
  };
};

// The quantum solving algorithm
const solveQuantumStep = (): boolean => {
  if (!mazeConfig || !visitedArray || queue.length === 0) {
    return false;
  }

  const { GRID, END, DIMENSIONS } = mazeConfig;
  const MAX_DIM = DIMENSIONS;
  const found = false;

  // Process multiple nodes per step to increase speed
  const nodesToProcess = Math.min(queue.length, 8);
  const newWaveNodes: string[] = [];

  for (let i = 0; i < nodesToProcess; i++) {
    if (queue.length === 0) break;
    
    const currentPath = queue.shift()!;
    const current = currentPath[currentPath.length - 1];

    if (current.row === END.row && current.col === END.col) {
      // Solution found!
      const endTime = performance.now();
      const elapsedTime = endTime - startTime;

      // Send solution back to main thread
      const solutionMessage: WorkerMessage = {
        type: 'solution-found',
        payload: {
          solution: currentPath,
          elapsedTime
        }
      };
      (self as any).postMessage(solutionMessage);
      return true; // Found solution
    }

    // Optimized neighbor checking with direct coordinate checks
    const { row, col } = current;
    
    // Check all four directions efficiently
    if (row > 0 && row < MAX_DIM - 1 && col > 0 && col < MAX_DIM - 1) {
      // Interior cell - all directions are potentially valid
      if (GRID[row - 1][col] === 0 && !visitedArray[row - 1][col]) {
        const posId = toId({ row: row - 1, col });
        visitedArray[row - 1][col] = true;
        newWaveNodes.push(posId);
        queue.push([...currentPath, { row: row - 1, col }]);
      }
      if (GRID[row + 1][col] === 0 && !visitedArray[row + 1][col]) {
        const posId = toId({ row: row + 1, col });
        visitedArray[row + 1][col] = true;
        newWaveNodes.push(posId);
        queue.push([...currentPath, { row: row + 1, col }]);
      }
      if (GRID[row][col - 1] === 0 && !visitedArray[row][col - 1]) {
        const posId = toId({ row, col: col - 1 });
        visitedArray[row][col - 1] = true;
        newWaveNodes.push(posId);
        queue.push([...currentPath, { row, col: col - 1 }]);
      }
      if (GRID[row][col + 1] === 0 && !visitedArray[row][col + 1]) {
        const posId = toId({ row, col: col + 1 });
        visitedArray[row][col + 1] = true;
        newWaveNodes.push(posId);
        queue.push([...currentPath, { row, col: col + 1 }]);
      }
    } else {
      // Boundary cell - check bounds explicitly
      if (row > 0 && GRID[row - 1][col] === 0 && !visitedArray[row - 1][col]) {
        const posId = toId({ row: row - 1, col });
        visitedArray[row - 1][col] = true;
        newWaveNodes.push(posId);
        queue.push([...currentPath, { row: row - 1, col }]);
      }
      if (row < MAX_DIM - 1 && GRID[row + 1][col] === 0 && !visitedArray[row + 1][col]) {
        const posId = toId({ row: row + 1, col });
        visitedArray[row + 1][col] = true;
        newWaveNodes.push(posId);
        queue.push([...currentPath, { row: row + 1, col }]);
      }
      if (col > 0 && GRID[row][col - 1] === 0 && !visitedArray[row][col - 1]) {
        const posId = toId({ row, col: col - 1 });
        visitedArray[row][col - 1] = true;
        newWaveNodes.push(posId);
        queue.push([...currentPath, { row, col: col - 1 }]);
      }
      if (col < MAX_DIM - 1 && GRID[row][col + 1] === 0 && !visitedArray[row][col + 1]) {
        const posId = toId({ row, col: col + 1 });
        visitedArray[row][col + 1] = true;
        newWaveNodes.push(posId);
        queue.push([...currentPath, { row, col: col + 1 }]);
      }
    }
  }

  // Send updated wave state to main thread
  if (newWaveNodes.length > 0) {
    const waveMessage: WorkerMessage = {
      type: 'wave-update',
      payload: {
        newWaveNodes
      }
    };
    (self as any).postMessage(waveMessage);
  }

  return false; // Not found yet
};

// The animation loop
const animate = () => {
  const found = solveQuantumStep();
  
  if (!found && queue.length > 0) {
    animationId = requestAnimationFrame(animate);
  }
};

// Message handler for the worker
(self as any).onmessage = (event: MessageEvent<WorkerMessage>) => {
  const message: WorkerMessage = event.data;

  switch (message.type) {
    case 'start':
      // Initialize the maze solving
      mazeConfig = message.payload.mazeConfig as MazeConfig;
      const { START, DIMENSIONS } = mazeConfig;
      
      // Initialize visited array
      visitedArray = Array.from({ length: DIMENSIONS }, () => 
        new Array(DIMENSIONS).fill(false)
      );
      visitedArray[START.row][START.col] = true;
      
      // Initialize queue with start position
      queue = [[START]];
      
      // Record start time
      startTime = performance.now();
      
      // Begin solving
      animationId = requestAnimationFrame(animate);
      break;

    case 'stop':
      // Stop solving and clear animation
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
      queue = [];
      break;

    case 'reset':
      // Stop and reset the solver
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
      queue = [];
      visitedArray = null;
      mazeConfig = null;
      break;

    default:
      console.warn('Unknown message type received by worker:', message.type);
  }
};