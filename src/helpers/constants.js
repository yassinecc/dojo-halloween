// @flow

export const itemsCount = 20;

export const threshold = 0.7;

export const zoneRadius = (type: string): number => {
  switch (type) {
    case 'good':
      return 100;
    case 'bad':
      return 150;
    case 'character':
      return 0;
    default:
      console.log(`Unknown type ${type}`);
      return 100;
  }
};

export const markerSize = (type: string): number => {
  switch (type) {
    case 'good':
      return 20;
    case 'bad':
      return 120;
    case 'character':
      return 60;
    default:
      console.log(`Unknown type ${type}`);
      return 100;
  }
};

export const mapFactor = 1 / 25;

export const mapBorderWidth = 2;

export const debugMode = true;
