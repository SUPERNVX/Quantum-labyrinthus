export const toId = (pos: { row: number, col: number }) => `${pos.row}-${pos.col}`;

export type MazeConfig = {
    GRID: number[][];
    START: { row: number; col: number };
    END: { row: number; col: number };
    DIMENSIONS: number;
};

export const generateMaze = (width: number, height: number): MazeConfig => {
    // Initialize grid with walls
    const grid = Array.from({ length: height }, () => Array(width).fill(1));

    const isInside = (r: number, c: number) => r >= 0 && r < height && c >= 0 && c < width;

    const carve = (r: number, c: number) => {
        grid[r][c] = 0; // Carve path

        const directions: [number, number][] = [[0, 2], [2, 0], [0, -2], [-2, 0]];
        // Shuffle directions
        for (let i = directions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [directions[i], directions[j]] = [directions[j], directions[i]];
        }

        for (const [dr, dc] of directions) {
            const nr = r + dr;
            const nc = c + dc;
            const wallR = r + dr / 2;
            const wallC = c + dc / 2;

            if (isInside(nr, nc) && grid[nr][nc] === 1) {
                grid[wallR][wallC] = 0; // Carve wall
                carve(nr, nc);
            }
        }
    };

    // Start carving from a random position
    carve(1, 1);

    const START = { row: 0, col: 0 };
    const END = { row: height - 1, col: width - 1 };

    // Ensure start and end are open
    grid[START.row][START.col] = 0;
    grid[END.row][END.col] = 0;

    // Ensure a path from start and to end
    if (grid[1][0] === 1 && grid[0][1] === 1) {
        grid[1][0] = 0;
    }
    if (grid[height - 2][width - 1] === 1 && grid[height - 1][width - 2] === 1) {
        grid[height - 1][width - 2] = 0;
    }

    // Add additional connections to create more branching paths for quantum advantage
    // This creates more opportunities for the quantum solver to explore multiple paths simultaneously
    const totalCells = width * height;
    const connectionCount = Math.floor(totalCells * 0.07); // 7% of cells as additional connections
    
    for (let i = 0; i < connectionCount; i++) {
        const r = Math.floor(Math.random() * (height - 2)) + 1;
        const c = Math.floor(Math.random() * (width - 2)) + 1;
        
        // Only make a connection if this is currently a wall (value = 1)
        if (grid[r][c] === 1) {
            // Check if this potential connection joins two separate path sections
            const neighbors = [
                grid[r-1][c], // top
                grid[r+1][c], // bottom
                grid[r][c-1], // left
                grid[r][c+1]  // right
            ].filter(val => val !== undefined);
            
            // Count how many neighbors are paths (value = 0)
            const pathNeighbors = neighbors.filter(neighbor => neighbor === 0).length;
            
            // Create the connection if it joins at least 2 path sections (creating a crossroads)
            if (pathNeighbors >= 2) {
                grid[r][c] = 0;
            }
        }
    }

    return {
        GRID: grid,
        START,
        END,
        DIMENSIONS: width,
    };
};

export type CellType = 'wall' | 'path' | 'start' | 'end' | 'classical-path' | 'classical-deadend' | 'quantum-wave' | 'classical-solution' | 'quantum-solution';

export const cellColors: Record<CellType, string> = {
    wall: 'bg-gray-600',
    path: 'bg-gray-800',
    start: 'bg-green-500',
    end: 'bg-green-500',
    'classical-path': 'bg-cyan-400',      // Same as quantum-wave (cyan) for classical exploration
    'classical-deadend': 'bg-red-500/80',
    'quantum-wave': 'bg-cyan-400',
    'classical-solution': 'bg-blue-600',   // Same as quantum solution (blue) for classical final path
    'quantum-solution': 'bg-blue-600',     // Same blue for quantum solution
};
