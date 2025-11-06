import React, { useEffect, useRef } from 'react';
import { cellColors, CellType } from './mazeUtils'; // Re-using the same colors and types

interface MazeCanvasGridProps {
    state: any;
    config: any;
    width: number;
    height: number;
}

const MazeCanvasGrid: React.FC<MazeCanvasGridProps> = ({ state, config, width, height }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const { DIMENSIONS } = config;
        const cellWidth = Math.ceil(width / DIMENSIONS);
        const cellHeight = Math.ceil(height / DIMENSIONS);

        // Memoize solution sets for quick lookups
        const classicalSolutionSet = new Set<string>();
        if (state.classicalSolution) {
            for (const p of state.classicalSolution) {
                classicalSolutionSet.add(`${p.row}-${p.col}`);
            }
        }

        const quantumSolutionSet = new Set<string>();
        if (state.quantumSolution) {
            for (const p of state.quantumSolution) {
                quantumSolutionSet.add(`${p.row}-${p.col}`);
            }
        }

        // Fill the background to create grid lines
        ctx.fillStyle = '#2D3748'; // gray-700
        ctx.fillRect(0, 0, width, height);

        // Draw grid
        for (let r = 0; r < DIMENSIONS; r++) {
            for (let c = 0; c < DIMENSIONS; c++) {
                const id = `${r}-${c}`;
                let cellType: CellType;

                // Determine cell type with the same logic as before
                if (config.GRID[r][c] === 1) {
                    cellType = 'wall';
                } else if (classicalSolutionSet.has(id)) {
                    cellType = 'classical-solution';
                } else if (quantumSolutionSet.has(id)) {
                    cellType = 'quantum-solution';
                } else if (r === config.START.row && c === config.START.col) {
                    cellType = 'start';
                } else if (r === config.END.row && c === config.END.col) {
                    cellType = 'end';
                } else if (state.classicalPath.some((p: {row: number, col: number}) => p.row === r && p.col === c)) {
                    cellType = 'classical-path';
                } else if (state.classicalDeadEnds.has(id)) {
                    cellType = 'classical-deadend';
                } else if (state.quantumWave.has(id)) {
                    cellType = 'quantum-wave';
                } else {
                    cellType = 'path';
                }
                
                const colorMap: Record<CellType, string> = {
                    wall: '#4A5568', // gray-600
                    path: '#1A202C', // gray-800
                    start: '#48BB78', // green-500
                    end: '#48BB78', // green-500
                    'classical-path': '#4FD1C5', // cyan-400
                    'classical-deadend': '#E53E3E', // red-500
                    'quantum-wave': '#4FD1C5', // cyan-400
                    'classical-solution': '#3182CE', // blue-600
                    'quantum-solution': '#3182CE', // blue-600
                };

                ctx.fillStyle = colorMap[cellType];
                // Draw the cell slightly smaller to create the grid line effect
                ctx.fillRect(c * cellWidth, r * cellHeight, cellWidth - 1, cellHeight - 1);
            }
        }

    }, [state, config, width, height]); // Redraw whenever state or config changes

    return <canvas ref={canvasRef} width={width} height={height} className="aspect-square" />;
};

export { MazeCanvasGrid };
