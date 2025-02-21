export const formulas = [
  'CO_2',
  'H_2O',
  'CH_4',
  'NO_x',
  'SO_2',
  'PM_{2.5}',
  'CO_2 + H_2O \\rightarrow H_2CO_3',
  'E = mc^2'
];

export const seededRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

export const generatePoints = (count: number, gridBased = false) => {
  if (gridBased) {
    const gridSize = Math.ceil(Math.sqrt(count));
    return Array.from({ length: count }, (_, i) => {
      const seed = i * 1000;
      return {
        x: (i % gridSize) * (100 / (gridSize - 1)),
        y: Math.floor(i / gridSize) * (100 / (gridSize - 1)),
        scale: 0.8 + seededRandom(seed) * 0.4,
        opacity: 0.4 + seededRandom(seed + 1) * 0.3,
        formula: formulas[i % formulas.length],
        animationDuration: 5 + seededRandom(seed + 2) * 5
      };
    });
  }
  
  return Array.from({ length: count }, (_, i) => {
    const seed = i * 1000;
    return {
      x: 15 + (i % 3) * 35,
      y: 20 + Math.floor(i / 3) * 40,
      scale: 0.8 + seededRandom(seed) * 0.4,
      opacity: 0.4 + seededRandom(seed + 1) * 0.3,
      formula: formulas[i % formulas.length],
      animationDuration: 5 + seededRandom(seed + 2) * 5
    };
  });
};

export const generateCurvedPath = (seed: number) => {
  const points = Array.from({ length: 5 }, (_, i) => {
    const t = i / 4;
    return {
      x: 10 + t * 80,
      y: 50 + Math.sin(t * Math.PI * 2) * (20 + seededRandom(seed + i) * 20)
    };
  });

  const path = points.reduce((acc, point, i) => {
    if (i === 0) return `M ${point.x},${point.y}`;
    const prev = points[i - 1];
    const cp1x = prev.x + (point.x - prev.x) / 3;
    const cp1y = prev.y;
    const cp2x = point.x - (point.x - prev.x) / 3;
    const cp2y = point.y;
    return `${acc} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${point.x},${point.y}`;
  }, '');

  return {
    path,
    opacity: 0.1 + seededRandom(seed + 100) * 0.2,
    duration: 5 + seededRandom(seed + 200) * 5
  };
};
