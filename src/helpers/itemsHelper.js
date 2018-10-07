// @flow

import { threshold, zoneRadius, markerSize } from './constants';

const doPointsCollide = (pointA: Point<number>, pointB: Point<number>) => {
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
    newPoint.type = Math.random() > threshold ? 'good' : 'bad';
    array.push(newPoint);
  }
  return array;
};
