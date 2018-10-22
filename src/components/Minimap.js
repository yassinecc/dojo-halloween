// @flow

import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components';
import { mapFactor, mapBorderWidth, debugMode } from 'dojo-halloween/src/helpers/constants';

type PropsType = {
  background: { x: number, y: number },
  screen: { x: number, y: number },
  itemsList: Array<Point<number>>,
  isFinalChestVisible: boolean,
  startDimension: { x: number, y: number },
  initialDimension: { x: number, y: number },
  deltaDimension: { x: number, y: number },
};

const getMinimapMargin = (
  startDimension: number,
  initialDimension: number,
  deltaDimension: number
) => (-startDimension - initialDimension - deltaDimension) * mapFactor - mapBorderWidth;

const minimapItemColor = (type: string) => {
  switch (type) {
    case 'good':
      return 'red';
    case 'treasure':
      return debugMode ? 'gold' : 'transparent';
    case 'bad':
      return debugMode ? 'blue' : 'transparent';
    default:
      return 'transparent';
  }
};

export const Minimap = (props: PropsType) => (
  <MinimapContainerView background={props.background} pointerEvents={'box-none'}>
    {props.itemsList.map(
      item =>
        (item.type !== 'treasure' || props.isFinalChestVisible) && (
          <View
            key={item.key}
            style={{
              position: 'absolute',
              top: item.y * mapFactor,
              left: item.x * mapFactor,
              height: 2,
              width: 2,
              backgroundColor: minimapItemColor(item.type),
            }}
          />
        )
    )}
    <MinimapView
      screen={props.screen}
      pointerEvents={'box-none'}
      left={getMinimapMargin(
        props.startDimension['x'],
        props.initialDimension['x'],
        props.deltaDimension['x']
      )}
      top={getMinimapMargin(
        props.startDimension['y'],
        props.initialDimension['y'],
        props.deltaDimension['y']
      )}
    />
  </MinimapContainerView>
);

const MinimapContainerView = styled.View`
  height: ${({ background }) => background.y * mapFactor};
  width: ${({ background }) => background.x * mapFactor};
  position: absolute;
  right: 0;
  bottom: 0;
  border-color: red;
  border-width: ${mapBorderWidth};
  background-color: rgba(255, 0, 0, 0.3);
`;

const MinimapView = styled.View`
  height: ${({ screen }) => screen.y * mapFactor};
  width: ${({ screen }) => screen.x * mapFactor};
  position: absolute;
  border-color: red;
  border-width: ${mapBorderWidth};
`;