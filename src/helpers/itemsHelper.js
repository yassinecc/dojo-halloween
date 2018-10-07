import { threshold, zoneRadius, markerSize } from './constants';

export const generateItemType = (size: number): Array<string> => {
  return Array(size)
    .fill(0)
    .map(n => (Math.random() > threshold ? 'good' : 'bad'));
};

doPointsCollide = (pointA: Point<number>, pointB: Point<number>) => {
  const squareLength = markerSize + zoneRadius;
  return !(
    pointA.x + zoneRadius > pointB.x + squareLength ||
    pointA.y + zoneRadius > pointB.y + squareLength ||
    pointB.x + zoneRadius > pointA.x + squareLength ||
    pointB.y + zoneRadius > pointA.y + squareLength
  );
};

export const generateRandomCoordinates = (
  size: number,
  maxDimensionX: number,
  maxDimensionY: number
) => {
  if (maxDimensionX < size || maxDimensionY < size) {
    console.warn('Cannot generate random coordinates', { size, maxDimensionX, maxDimensionY });
    return [];
  }
  let array = [];
  while (array.length < size) {
    const randomX = Math.floor(Math.random() * maxDimensionX);
    const randomY = Math.floor(Math.random() * maxDimensionY);
    const newPoint = { x: randomX, y: randomY };
    if (array.some((element: Point<number>) => doPointsCollide(element, newPoint))) continue;
    array.push(newPoint);
  }
  return array;
};
