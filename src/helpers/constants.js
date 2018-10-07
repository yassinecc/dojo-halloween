// @flow

export const itemsCount = 20;

export const threshold = 0.7;

export const zoneRadius = (type: string): number => (type === 'good' ? 100 : 150);

export const markerSize = (type: string): number => (type === 'good' ? 20 : 120);

export const mapFactor = 1 / 25;

export const mapBorderWidth = 2;

export const debugMode = true;
