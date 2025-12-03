import React, { useState, useEffect, useRef } from 'react';

// --- MAZE CONFIGURATIONS ---

const SMALL_MAZE = {
    GRID: [
        [0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
        [0, 1, 0, 1, 1, 1, 0, 1, 0, 1],
        [0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
        [1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 0, 1, 1, 0],
        [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
        [1, 0, 1, 1, 0, 1, 1, 1, 0, 0],
        [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 1, 0, 1, 1, 0],
    ],
    START: { row: 0, col: 0 },
    END: { row: 9, col: 9 },
    DIMENSIONS: 10,
};

const LARGE_MAZE = {
    GRID: [
        [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0],
        [1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0],
        [0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
        [0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0],
        [1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0],
        [0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0],
        [0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1],
        [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0],
        [0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0],
        [0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
        [1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0],
        [0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0],
        [0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0],
        [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0],
        [0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
        [1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
        [1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0],
        [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0],
        [0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    START: { row: 0, col: 0 },
    END: { row: 24, col: 24 },
    DIMENSIONS: 25,
};

import { MazeCanvasGrid } from './MazeCanvasGrid';
import { toId } from './mazeUtils';

const QuantumMaze: React.FC<{ showMegaMaze: () => void }> = ({ showMegaMaze }) => {
    const [mazeSize, setMazeSize] = useState<'small' | 'large'>('small');
    const [isSolving, setIsSolving] = useState(false);
    const [classicalPath, setClassicalPath] = useState<{ row: number, col: number }[]>([]);
    const [classicalDeadEnds, setClassicalDeadEnds] = useState(new Set<string>());
    const [classicalSolution, setClassicalSolution] = useState<{ row: number, col: number }[] | null>(null);
    const [quantumWave, setQuantumWave] = useState(new Set<string>());
    const [quantumSolution, setQuantumSolution] = useState<{ row: number, col: number }[] | null>(null);

    const [classicalStats, setClassicalStats] = useState({ time: 0, distance: 0 });
    const [quantumStats, setQuantumStats] = useState({ time: 0, distance: 0 });

    const animationFrameId = useRef<number | null>(null);
    const solveStartTime = useRef<number>(0);
    const classicalFound = useRef<boolean>(false);
    const quantumFound = useRef<boolean>(false);

    const [solvingMode, setSolvingMode] = useState<'both' | 'classical' | 'quantum'>('both');

    const config = mazeSize === 'small' ? SMALL_MAZE : LARGE_MAZE;

    const solveClassical = () => {
        const { GRID, START, END, DIMENSIONS } = config;
        const stack = [[START]];
        const visitedClassical = new Set([toId(START)]);
        let path: { row: number, col: number }[] = [];
        let deadEnds = new Set<string>();
        const classicalInterval = mazeSize === 'small' ? 50 : 20;
        let lastClassicalTime = 0;

        const animateClassical = (timestamp: number) => {
            if (timestamp - lastClassicalTime > classicalInterval && !classicalFound.current) {
                lastClassicalTime = timestamp;
                if (stack.length > 0) {
                    path = stack[stack.length - 1];
                    const current = path[path.length - 1];

                    if (current.row === END.row && current.col === END.col) {
                        classicalFound.current = true;
                        const endTime = performance.now();
                        setClassicalStats({ time: Math.round(endTime - solveStartTime.current), distance: path.length });
                        setClassicalSolution(path);
                    } else {
                        const shuffle = (array: any[]) => {
                            for (let i = array.length - 1; i > 0; i--) {
                                const j = Math.floor(Math.random() * (i + 1));
                                [array[i], array[j]] = [array[j], array[i]];
                            }
                            return array;
                        };

                        const neighbors = shuffle([
                            { row: current.row - 1, col: current.col }, { row: current.row + 1, col: current.col },
                            { row: current.row, col: current.col - 1 }, { row: current.row, col: current.col + 1 },
                        ].filter(n =>
                            n.row >= 0 && n.row < DIMENSIONS && n.col >= 0 && n.col < DIMENSIONS &&
                            GRID[n.row][n.col] === 0 && !visitedClassical.has(toId(n))
                        ));

                        if (neighbors.length > 0) {
                            const next = neighbors[0];
                            visitedClassical.add(toId(next));
                            stack.push([...path, next]);
                        } else {
                            path.forEach(p => deadEnds.add(toId(p)));
                            stack.pop();
                        }
                    }
                    setClassicalPath([...path]);
                    setClassicalDeadEnds(new Set(deadEnds));
                }
            }

            if (!classicalFound.current) {
                animationFrameId.current = requestAnimationFrame(animateClassical);
            } else {
                setIsSolving(false);
            }
        };

        animationFrameId.current = requestAnimationFrame(animateClassical);
    };

    const solveQuantum = () => {
        const { GRID, START, END, DIMENSIONS } = config;
        const queue = [[START]];
        const visitedQuantum = new Set([toId(START)]);
        const quantumInterval = mazeSize === 'small' ? 50 : 15;
        let lastQuantumTime = 0;

        const animateQuantum = (timestamp: number) => {
            if (timestamp - lastQuantumTime > quantumInterval && !quantumFound.current) {
                lastQuantumTime = timestamp;
                if (queue.length > 0) {
                    const currentLevelSize = queue.length;
                    const newWaveNodes = new Set<string>();
                    for (let i = 0; i < currentLevelSize; i++) {
                        const currentPath = queue.shift()!;
                        const current = currentPath[currentPath.length - 1];
                        if (current.row === END.row && current.col === END.col && !quantumFound.current) {
                            quantumFound.current = true;
                            const endTime = performance.now();
                            setQuantumStats({ time: Math.round(endTime - solveStartTime.current), distance: currentPath.length });
                            setQuantumSolution(currentPath);
                        }
                        [
                            { row: current.row - 1, col: current.col }, { row: current.row + 1, col: current.col },
                            { row: current.row, col: current.col - 1 }, { row: current.row, col: current.col + 1 },
                        ].forEach(n => {
                            if (n.row >= 0 && n.row < DIMENSIONS && n.col >= 0 && n.col < DIMENSIONS &&
                                GRID[n.row][n.col] === 0 && !visitedQuantum.has(toId(n))) {
                                visitedQuantum.add(toId(n));
                                newWaveNodes.add(toId(n));
                                queue.push([...currentPath, n]);
                            }
                        });
                    }
                    setQuantumWave(prevWave => new Set([...prevWave, ...newWaveNodes]));
                }
            }

            if (!quantumFound.current) {
                animationFrameId.current = requestAnimationFrame(animateQuantum);
            } else {
                setIsSolving(false);
            }
        };

        animationFrameId.current = requestAnimationFrame(animateQuantum);
    };

    const solveBoth = () => {
        const { GRID, START, END, DIMENSIONS } = config;
        const stack = [[START]];
        const visitedClassical = new Set([toId(START)]);
        let path: { row: number, col: number }[] = [];
        let deadEnds = new Set<string>();
        const queue = [[START]];
        const visitedQuantum = new Set([toId(START)]);
        let lastClassicalTime = 0;
        let lastQuantumTime = 0;
        const classicalInterval = mazeSize === 'small' ? 50 : 20;
        const quantumInterval = mazeSize === 'small' ? 50 : 15;

        const animate = (timestamp: number) => {
            if (timestamp - lastClassicalTime > classicalInterval && !classicalFound.current) {
                lastClassicalTime = timestamp;
                if (stack.length > 0) {
                    path = stack[stack.length - 1];
                    const current = path[path.length - 1];

                    if (current.row === END.row && current.col === END.col) {
                        classicalFound.current = true;
                        const endTime = performance.now();
                        setClassicalStats({ time: Math.round(endTime - solveStartTime.current), distance: path.length });
                        setClassicalSolution(path);
                    } else {
                        const shuffle = (array: any[]) => {
                            for (let i = array.length - 1; i > 0; i--) {
                                const j = Math.floor(Math.random() * (i + 1));
                                [array[i], array[j]] = [array[j], array[i]];
                            }
                            return array;
                        };

                        const neighbors = shuffle([
                            { row: current.row - 1, col: current.col }, { row: current.row + 1, col: current.col },
                            { row: current.row, col: current.col - 1 }, { row: current.row, col: current.col + 1 },
                        ].filter(n =>
                            n.row >= 0 && n.row < DIMENSIONS && n.col >= 0 && n.col < DIMENSIONS &&
                            GRID[n.row][n.col] === 0 && !visitedClassical.has(toId(n))
                        ));

                        if (neighbors.length > 0) {
                            const next = neighbors[0];
                            visitedClassical.add(toId(next));
                            stack.push([...path, next]);
                        } else {
                            path.forEach(p => deadEnds.add(toId(p)));
                            stack.pop();
                        }
                    }
                    setClassicalPath([...path]);
                    setClassicalDeadEnds(new Set(deadEnds));
                }
            }

            if (timestamp - lastQuantumTime > quantumInterval && !quantumFound.current) {
                lastQuantumTime = timestamp;
                if (queue.length > 0) {
                    const currentLevelSize = queue.length;
                    const newWaveNodes = new Set<string>();
                    for (let i = 0; i < currentLevelSize; i++) {
                        const currentPath = queue.shift()!;
                        const current = currentPath[currentPath.length - 1];
                        if (current.row === END.row && current.col === END.col && !quantumFound.current) {
                            quantumFound.current = true;
                            const endTime = performance.now();
                            setQuantumStats({ time: Math.round(endTime - solveStartTime.current), distance: currentPath.length });
                            setQuantumSolution(currentPath);
                        }
                        [
                            { row: current.row - 1, col: current.col }, { row: current.row + 1, col: current.col },
                            { row: current.row, col: current.col - 1 }, { row: current.row, col: current.col + 1 },
                        ].forEach(n => {
                            if (n.row >= 0 && n.row < DIMENSIONS && n.col >= 0 && n.col < DIMENSIONS &&
                                GRID[n.row][n.col] === 0 && !visitedQuantum.has(toId(n))) {
                                visitedQuantum.add(toId(n));
                                newWaveNodes.add(toId(n));
                                queue.push([...currentPath, n]);
                            }
                        });
                    }
                    setQuantumWave(prevWave => new Set([...prevWave, ...newWaveNodes]));
                }
            }

            if (!classicalFound.current || !quantumFound.current) {
                animationFrameId.current = requestAnimationFrame(animate);
            } else {
                setIsSolving(false);
            }
        };
        animationFrameId.current = requestAnimationFrame(animate);
    };

    const reset = () => {
        setIsSolving(false);
        if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        setClassicalPath([]);
        setClassicalDeadEnds(new Set());
        setClassicalSolution(null);
        setQuantumWave(new Set());
        setQuantumSolution(null);
        setClassicalStats({ time: 0, distance: 0 });
        setQuantumStats({ time: 0, distance: 0 });
        setSolvingMode('both');
    };

    const startSolving = (mode: 'both' | 'classical' | 'quantum' = 'both') => {
        if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);

        if (mode === 'both') {
            reset();
        }

        classicalFound.current = false;
        quantumFound.current = false;
        setIsSolving(true);
        solveStartTime.current = performance.now();
        setSolvingMode(mode);

        setTimeout(() => {
            switch (mode) {
                case 'classical':
                    solveClassical();
                    break;
                case 'quantum':
                    solveQuantum();
                    break;
                case 'both':
                default:
                    solveBoth();
                    break;
            }
        }, 100);
    };

    const increaseMaze = () => {
        if (mazeSize === 'small') {
            reset();
            setMazeSize('large');
        } else {
            showMegaMaze();
        }
    };

    const decreaseMaze = () => {
        reset();
        setMazeSize('small');
    }

    useEffect(() => {
        return () => {
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        };
    }, []);

    const classicalState = {
        classicalPath: (solvingMode === 'quantum') ? [] : classicalPath,
        classicalDeadEnds: classicalDeadEnds,
        classicalSolution: classicalSolution,
        quantumSolution: null,
        quantumWave: new Set<string>()
    };

    const quantumState = {
        quantumWave: quantumWave,
        quantumSolution: quantumSolution,
        classicalSolution: null,
        classicalPath: [],
        classicalDeadEnds: new Set<string>()
    };

    return (
        <div className="flex flex-col items-center w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 w-full max-w-6xl">
                <div className="text-center w-full">
                    <h3 className="text-lg font-bold mb-2 text-quantum-primary">Computador Clássico</h3>
                    <p className="text-xs text-gray-400 mb-4 h-10">Explora um caminho de cada vez, testando e voltando em becos sem saída.</p>
                    <div className="w-full flex justify-center">
                        <MazeCanvasGrid state={classicalState} config={config} width={500} height={500} />
                    </div>
                    {classicalSolution && (
                        <div className="mt-4 text-sm text-gray-300 bg-gray-900/50 p-2 rounded-lg">
                            <p>Tempo: <span className="font-bold text-white">{(classicalStats.time / 1000).toFixed(2)} s</span></p>
                            <p>Distância: <span className="font-bold text-white">{classicalStats.distance} quadrados</span></p>
                        </div>
                    )}
                </div>
                <div className="text-center w-full">
                    <h3 className="text-lg font-bold mb-2 text-quantum-accent">Computador Quântico</h3>
                    <p className="text-xs text-gray-400 mb-4 h-10">Graças à superposição, explora todos os caminhos simultaneamente para encontrar a solução.</p>
                    <div className="w-full flex justify-center">
                        <MazeCanvasGrid state={quantumState} config={config} width={500} height={500} />
                    </div>
                    {quantumSolution && (
                        <div className="mt-4 text-sm text-gray-300 bg-gray-900/50 p-2 rounded-lg">
                            <p>Tempo: <span className="font-bold text-white">{(quantumStats.time / 1000).toFixed(2)} s</span></p>
                            <p>Distância: <span className="font-bold text-white">{quantumStats.distance} quadrados</span></p>
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-2 md:gap-4 px-4">
                <div className="flex flex-wrap justify-center gap-2">
                    <button
                        onClick={() => startSolving('classical')}
                        disabled={isSolving}
                        className="bg-quantum-primary hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-full transition-all disabled:bg-gray-500 text-sm"
                    >
                        Clássico
                    </button>
                    <button
                        onClick={() => startSolving('both')}
                        disabled={isSolving}
                        className="bg-quantum-accent hover:bg-cyan-500 text-white font-bold py-2 px-6 rounded-full transition-all disabled:bg-gray-500 text-sm"
                    >
                        Ambos
                    </button>
                    <button
                        onClick={() => startSolving('quantum')}
                        disabled={isSolving}
                        className="bg-quantum-accent hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-full transition-all disabled:bg-gray-500 text-sm"
                    >
                        Quântico
                    </button>
                </div>
                <button onClick={reset} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-full transition-all">
                    Resetar
                </button>
                {mazeSize === 'large' && (
                    <button onClick={decreaseMaze} className="bg-quantum-secondary hover:bg-indigo-400 text-white font-bold py-2 px-6 rounded-full transition-all">
                        Diminuir Labirinto
                    </button>
                )}
                <button onClick={increaseMaze} className="bg-quantum-secondary hover:bg-indigo-400 text-white font-bold py-2 px-6 rounded-full transition-all">
                    Aumentar Labirinto
                </button>
            </div>
        </div>
    );
};

export default QuantumMaze;
