// @flow

import countBy from 'lodash/countBy';
import {
  threshold,
  zoneRadius,
  markerSize,
  treasuresCount,
  slenderMenCount,
  itemsCount,
} from './constants';

export const doPointsCollide = (pointA: Point<number>, pointB: Point<number>) => {
  const squareLength = type => markerSize(type) + 2 * zoneRadius(type);
  return !(
    pointA.x - zoneRadius(pointA.type) >
      pointB.x + squareLength(pointB.type) - zoneRadius(pointB.type) ||
    pointA.y - zoneRadius(pointA.type) >
      pointB.y + squareLength(pointB.type) - zoneRadius(pointB.type) ||
    pointB.x - zoneRadius(pointB.type) >
      pointA.x + squareLength(pointA.type) - zoneRadius(pointA.type) ||
    pointB.y - zoneRadius(pointB.type) >
      pointA.y + squareLength(pointA.type) - zoneRadius(pointA.type)
  );
};

export const getSquareDistance = (pointA: Point<number>, pointB: Point<number>) =>
  (pointA.x - pointB.x) ** 2 + (pointA.y - pointB.y) ** 2;

export const generateRandomCoordinates = (maxDimensionX: number, maxDimensionY: number) => {
  if (maxDimensionX < itemsCount || maxDimensionY < itemsCount) {
    console.warn('Cannot generate random coordinates', {
      itemsCount,
      maxDimensionX,
      maxDimensionY,
    });
    return [];
  }
  let array = [];
  const randomX = Math.floor(Math.random() * maxDimensionX);
  const randomY = Math.floor(Math.random() * maxDimensionY);
  array.push({ key: 0, x: randomX, y: randomY, type: 'treasure' });
  while (array.length < itemsCount) {
    const randomX = Math.floor(Math.random() * maxDimensionX);
    const randomY = Math.floor(Math.random() * maxDimensionY);
    const newPoint = {
      key: array.length,
      x: randomX,
      y: randomY,
      type: Math.random() > threshold ? 'good' : 'bad',
    };
    // Check if treasures can be reached
    const currentTreasures = array.filter(element => element.type === 'good').length;
    const currentSlenders = array.filter(element => element.type === 'bad').length;
    if (
      array.some((element: Point<number>) => doPointsCollide(element, newPoint)) ||
      (newPoint.type === 'good' && treasuresCount === currentTreasures) ||
      (newPoint.type === 'bad' && slenderMenCount === currentSlenders)
    )
      continue;
    array.push(newPoint);
  }
  return array;
};
