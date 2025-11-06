import React, { useState, useCallback, useEffect, useRef } from 'react';
import { generateMaze, MazeConfig, toId } from './mazeUtils';
import { MazeCanvasGrid } from './MazeCanvasGrid';

const MEGA_MAZE_DIMENSIONS = 50;

const MegaMaze: React.FC<{ showQuantumMaze: () => void }> = ({ showQuantumMaze }) => {
    // Maze configurations
    const [classicalMaze, setClassicalMaze] = useState<MazeConfig>(() => generateMaze(MEGA_MAZE_DIMENSIONS, MEGA_MAZE_DIMENSIONS));
    const [quantumMaze, setQuantumMaze] = useState<MazeConfig>(() => generateMaze(MEGA_MAZE_DIMENSIONS, MEGA_MAZE_DIMENSIONS));

    // Scoreboard stats
    const [classicalStats, setClassicalStats] = useState({ solvedCount: 0, totalTime: 0 });
    const [quantumStats, setQuantumStats] = useState({ solvedCount: 0, totalTime: 0 });

    // Solver states
    const [isContinuous, setIsContinuous] = useState(false);
    const [isSolving, setIsSolving] = useState(false);

    // --- Classical Solver State ---
    const [classicalPath, setClassicalPath] = useState<{ row: number, col: number }[]>([]);
    const [classicalDeadEnds, setClassicalDeadEnds] = useState(new Set<string>());
    const [classicalSolution, setClassicalSolution] = useState<{ row: number, col: number }[] | null>(null);
    const classicalAnimFrame = useRef<number | null>(null);
    const classicalSolveStartTime = useRef<number>(0);
    const shouldContinueClassical = useRef(false);
    const lastClassicalStepTime = useRef<number>(0);
    const CLASSICAL_SOLVER_STEP_DELAY = 20; // ms, to match the speed of the 'large' maze in QuantumMaze

    // --- Quantum Solver State ---
    const [quantumWave, setQuantumWave] = useState(new Set<string>());
    const [quantumSolution, setQuantumSolution] = useState<{ row: number, col: number }[] | null>(null);
    const quantumWorker = useRef<Worker | null>(null);
    const shouldContinueQuantum = useRef(false);
    const pendingWaveNodes = useRef<string[]>([]);
    const visualizerFrame = useRef<number | null>(null);

    // Initialize Web Worker
    useEffect(() => {
        if (typeof Worker !== 'undefined') {
            quantumWorker.current = new Worker(new URL('./quantumSolver.worker.ts', import.meta.url));
        } else {
            console.warn('Web Workers are not supported in this browser');
        }
        
        // Cleanup function
        return () => {
            if (quantumWorker.current) {
                quantumWorker.current.terminate();
                quantumWorker.current = null;
            }
        };
    }, []);

    // Handle messages from the worker
    useEffect(() => {
        if (quantumWorker.current) {
            quantumWorker.current.onmessage = (event) => {
                const message = event.data;
                
                switch (message.type) {
                    case 'wave-update':
                        pendingWaveNodes.current.push(...message.payload.newWaveNodes);
                        break;
                        
                    case 'solution-found':
                        if (visualizerFrame.current) {
                            cancelAnimationFrame(visualizerFrame.current);
                        }
                        if (pendingWaveNodes.current.length > 0) {
                            const nodesToRender = pendingWaveNodes.current;
                            pendingWaveNodes.current = [];
                            setQuantumWave(prevWave => {
                                const newWave = new Set(prevWave);
                                for (const node of nodesToRender) {
                                    newWave.add(node);
                                }
                                return newWave;
                            });
                        }

                        setQuantumSolution(message.payload.solution);
                        
                        setQuantumStats(prev => ({ 
                            solvedCount: prev.solvedCount + 1, 
                            totalTime: prev.totalTime + message.payload.elapsedTime
                        }));
                        
                        setTimeout(() => {
                            const newMaze = generateMaze(MEGA_MAZE_DIMENSIONS, MEGA_MAZE_DIMENSIONS);
                            setQuantumMaze(newMaze);
                            setQuantumWave(new Set());
                            setQuantumSolution(null);
                            
                            setTimeout(() => {
                                if (shouldContinueQuantum.current && isSolving) {
                                    if (quantumWorker.current) {
                                        quantumWorker.current.postMessage({
                                            type: 'start',
                                            payload: { mazeConfig: newMaze }
                                        });
                                        visualizeWave(); // Restart visualizer
                                    }
                                }
                            }, 100);
                        }, 1000);
                        break;
                }
            };
        }
    }, [isSolving]);

    const visualizeWave = () => {
        if (pendingWaveNodes.current.length > 0) {
            const nodesToRender = pendingWaveNodes.current;
            pendingWaveNodes.current = []; // Clear buffer immediately

            setQuantumWave(prevWave => {
                const newWave = new Set(prevWave);
                for (const node of nodesToRender) {
                    newWave.add(node);
                }
                return newWave;
            });
        }
        visualizerFrame.current = requestAnimationFrame(visualizeWave);
    };

    // Function to start quantum solver via Web Worker
    const startQuantumWorker = useCallback(() => {
        if (quantumWorker.current) {
            // Send maze config to worker to start solving
            quantumWorker.current.postMessage({
                type: 'start',
                payload: {
                    mazeConfig: quantumMaze
                }
            });
        }
    }, [quantumMaze]);

    // Function to reset the quantum solver
    const resetQuantumWorker = useCallback(() => {
        if (quantumWorker.current) {
            quantumWorker.current.postMessage({
                type: 'reset'
            });
        }
    }, []);

    // --- Classical Solver State & Functions ---
    const runClassicalSolver = (maze: MazeConfig) => {
        const { GRID, START, END, DIMENSIONS } = maze;
        const MAX_DIM = DIMENSIONS;
        const stack = [[START]];
        
        const visitedArray = Array.from({ length: MAX_DIM }, () => new Array(MAX_DIM).fill(false));
        visitedArray[START.row][START.col] = true;
        
        let path: { row: number, col: number }[] = [];
        let deadEnds = new Set<string>();
        let found = false;

        classicalSolveStartTime.current = performance.now();

        const animate = (timestamp: number) => {
            if (found) return;

            if (timestamp - lastClassicalStepTime.current >= CLASSICAL_SOLVER_STEP_DELAY) {
                lastClassicalStepTime.current = timestamp;

                if (stack.length > 0) {
                    path = stack[stack.length - 1];
                    const current = path[path.length - 1];

                    if (current.row === END.row && current.col === END.col) {
                        found = true;
                        const endTime = performance.now();
                        
                        setClassicalStats(prev => ({ 
                            solvedCount: prev.solvedCount + 1, 
                            totalTime: prev.totalTime + (endTime - classicalSolveStartTime.current)
                        }));
                        setClassicalSolution(path);

                        setTimeout(() => {
                            const newMaze = generateMaze(MEGA_MAZE_DIMENSIONS, MEGA_MAZE_DIMENSIONS);
                            setClassicalMaze(newMaze);
                            setClassicalPath([]);
                            setClassicalDeadEnds(new Set());
                            setClassicalSolution(null);
                            
                            setTimeout(() => {
                                if (shouldContinueClassical.current && isSolving) {
                                    runClassicalSolver(newMaze); // Use the new maze
                                }
                            }, 100);
                        }, 1000);
                        return;
                    }

                    const neighbors = [];
                    const { row, col } = current;
                    
                    if (row > 0 && row < MAX_DIM - 1 && col > 0 && col < MAX_DIM - 1) {
                        if (GRID[row - 1][col] === 0 && !visitedArray[row - 1][col]) neighbors.push({ row: row - 1, col });
                        if (GRID[row + 1][col] === 0 && !visitedArray[row + 1][col]) neighbors.push({ row: row + 1, col });
                        if (GRID[row][col - 1] === 0 && !visitedArray[row][col - 1]) neighbors.push({ row, col: col - 1 });
                        if (GRID[row][col + 1] === 0 && !visitedArray[row][col + 1]) neighbors.push({ row, col: col + 1 });
                    } else {
                        if (row > 0 && GRID[row - 1][col] === 0 && !visitedArray[row - 1][col]) neighbors.push({ row: row - 1, col });
                        if (row < MAX_DIM - 1 && GRID[row + 1][col] === 0 && !visitedArray[row + 1][col]) neighbors.push({ row: row + 1, col });
                        if (col > 0 && GRID[row][col - 1] === 0 && !visitedArray[row][col - 1]) neighbors.push({ row, col: col - 1 });
                        if (col < MAX_DIM - 1 && GRID[row][col + 1] === 0 && !visitedArray[row][col + 1]) neighbors.push({ row, col: col + 1 });
                    }

                    if (neighbors.length > 0) {
                        const next = neighbors[0];
                        visitedArray[next.row][next.col] = true;
                        stack.push([...path, next]);
                    } else {
                        path.forEach(p => deadEnds.add(toId(p)));
                        stack.pop();
                    }
                    
                    setClassicalPath([...path]);
                    setClassicalDeadEnds(new Set(deadEnds));
                }
            }
            classicalAnimFrame.current = requestAnimationFrame(animate);
        };
        classicalAnimFrame.current = requestAnimationFrame(animate);
    };

    const solveClassical = useCallback(() => {
        runClassicalSolver(classicalMaze);
    }, [classicalMaze, isContinuous]);


    const startSolvers = (continuous: boolean) => {
        shouldContinueClassical.current = continuous;
        shouldContinueQuantum.current = continuous;
        
        setClassicalPath([]);
        setClassicalDeadEnds(new Set());
        setClassicalSolution(null);
        setQuantumWave(new Set());
        setQuantumSolution(null);
        pendingWaveNodes.current = [];

        if (visualizerFrame.current) cancelAnimationFrame(visualizerFrame.current);
        visualizeWave();

        solveClassical();
        if (quantumWorker.current) {
            quantumWorker.current.postMessage({ type: 'reset' });
            startQuantumWorker();
        }
    };

    useEffect(() => {
        if (isSolving) {
            startSolvers(isContinuous);
        }
    }, [isSolving]);

    const resetAll = () => {
        setIsSolving(false);
        setIsContinuous(false);
        shouldContinueClassical.current = false;
        shouldContinueQuantum.current = false;
        if (classicalAnimFrame.current) cancelAnimationFrame(classicalAnimFrame.current);
        if (visualizerFrame.current) cancelAnimationFrame(visualizerFrame.current);
        pendingWaveNodes.current = [];

        if (quantumWorker.current) {
            quantumWorker.current.postMessage({ type: 'reset' });
        }
        setClassicalStats({ solvedCount: 0, totalTime: 0 });
        setQuantumStats({ solvedCount: 0, totalTime: 0 });
        setClassicalMaze(generateMaze(MEGA_MAZE_DIMENSIONS, MEGA_MAZE_DIMENSIONS));
        setQuantumMaze(generateMaze(MEGA_MAZE_DIMENSIONS, MEGA_MAZE_DIMENSIONS));
        setClassicalPath([]);
        setClassicalDeadEnds(new Set());
        setClassicalSolution(null);
        setQuantumWave(new Set());
        setQuantumSolution(null);
    };

    useEffect(() => {
        return () => {
            if (classicalAnimFrame.current) cancelAnimationFrame(classicalAnimFrame.current);
            if (visualizerFrame.current) cancelAnimationFrame(visualizerFrame.current);
        };
    }, []);

    const classicalAvgTime = classicalStats.solvedCount > 0 ? classicalStats.totalTime / classicalStats.solvedCount : 0;
    const quantumAvgTime = quantumStats.solvedCount > 0 ? quantumStats.totalTime / quantumStats.solvedCount : 0;
    const speedDifference = classicalAvgTime > 0 && quantumAvgTime > 0 ? (classicalAvgTime / quantumAvgTime).toFixed(2) + 'x' : '-';

    const classicalState = { classicalPath, classicalDeadEnds, classicalSolution, quantumWave: new Set(), quantumSolution: null };
    const quantumState = { quantumWave, quantumSolution, classicalPath: [], classicalDeadEnds: new Set(), classicalSolution: null };

    return (
        <div className="flex flex-col items-center">
            {/* Scoreboard */}
            <div className="w-full max-w-6xl mb-4 p-4 bg-gray-900/50 rounded-lg">
                <h2 className="text-xl font-bold text-center text-white mb-4">Placar em Tempo Real</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div>
                        <h3 className="text-lg font-bold text-quantum-primary">Computador Clássico</h3>
                        <p>Labirintos Resolvidos: <span className="font-bold text-white">{classicalStats.solvedCount}</span></p>
                        <p>Tempo Médio: <span className="font-bold text-white">{(classicalAvgTime / 1000).toFixed(2)} s</span></p>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                         <h3 className="text-lg font-bold">Comparativo</h3>
                        <p>Diferença de Velocidade: <span className="font-bold text-white">{speedDifference}</span></p>
                        <p>Diferença de Resoluções: <span className="font-bold text-white">{Math.abs(classicalStats.solvedCount - quantumStats.solvedCount)}</span></p>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-quantum-accent">Computador Quântico</h3>
                        <p>Labirintos Resolvidos: <span className="font-bold text-white">{quantumStats.solvedCount}</span></p>
                        <p>Tempo Médio: <span className="font-bold text-white">{(quantumAvgTime / 1000).toFixed(2)} s</span></p>
                    </div>
                </div>
            </div>

            {/* Mazes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
                <div className="text-center">
                    <h3 className="text-lg font-bold mb-2 text-quantum-primary">Clássico (50x50)</h3>
                    <MazeCanvasGrid state={classicalState} config={classicalMaze} width={500} height={500} />
                </div>
                <div className="text-center">
                    <h3 className="text-lg font-bold mb-2 text-quantum-accent">Quântico (50x50)</h3>
                    <MazeCanvasGrid state={quantumState} config={quantumMaze} width={500} height={500} />
                </div>
            </div>

            {/* Buttons */}
            <div className="mt-8 flex flex-wrap justify-center gap-4">
                <button onClick={() => {
                    const newContinuous = !isContinuous;
                    setIsContinuous(newContinuous);

                    if (newContinuous) {
                        // Start continuous mode if not already solving
                        if (!isSolving) {
                            setIsSolving(true);
                        }
                    } else {
                        // Stop continuous mode
                        shouldContinueClassical.current = false;
                        shouldContinueQuantum.current = false;
                    }
                }} className={`font-bold py-2 px-6 rounded-full transition-colors ${isContinuous ? 'bg-red-500 hover:bg-red-400' : 'bg-green-500 hover:bg-green-400'} text-white`}>
                    {isContinuous ? 'Parar Contínuo' : 'Iniciar Contínuo'}
                </button>
                <button onClick={() => {
                    setIsContinuous(false);
                    if (!isSolving) {
                        setIsSolving(true);
                    }
                }} disabled={isSolving} className="bg-quantum-primary hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-full disabled:bg-gray-500">
                    Começar (1x)
                </button>
                <button onClick={resetAll} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-full">
                    Resetar
                </button>
                <button onClick={showQuantumMaze} className="bg-quantum-secondary hover:bg-indigo-400 text-white font-bold py-2 px-6 rounded-full">
                    Diminuir Labirinto
                </button>
            </div>
        </div>
    );
};

export default MegaMaze;
