// @flow

import { threshold, zoneRadius, markerSize } from './constants';

const doPointsCollide = (pointA: Point<number>, pointB: Point<number>) => {
  const squareLength = type => markerSize(type) + zoneRadius(type);
  return !(
    pointA.x + zoneRadius(pointA.type) > pointB.x + squareLength(pointB.type) ||
    pointA.y + zoneRadius(pointA.type) > pointB.y + squareLength(pointB.type) ||
    pointB.x + zoneRadius(pointB.type) > pointA.x + squareLength(pointA.type) ||
    pointB.y + zoneRadius(pointB.type) > pointA.y + squareLength(pointA.type)
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
    const newPoint = { x: randomX, y: randomY, type: Math.random() > threshold ? 'good' : 'bad' };
    if (array.some((element: Point<number>) => doPointsCollide(element, newPoint))) continue;
    array.push(newPoint);
  }
  return array;
};
