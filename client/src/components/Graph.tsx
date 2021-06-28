import React, { useEffect, useRef } from 'react';
import styled from 'styled-components'
import {tree, hierarchy} from 'd3-hierarchy';

import {useDragging, useZoom} from '../utils/hooks';


const Path = styled.path`
  stroke-width: 2px;
  stroke: black;
  fill: none;
`;

const Box = styled.rect`
  fill: #ddd;
`;

const NODE_WIDTH = 200
const NODE_HEIGHT = 80
const NODE_PADDING = 50

const Graph = ({data}) => {

  const temp = hierarchy(data, d => d.parents);
  const root = tree().nodeSize([NODE_HEIGHT + NODE_PADDING, NODE_WIDTH + NODE_PADDING])(temp);

  const [dragProps, translate, dragging] = useDragging()
  const [zoomProps, zoom] = useZoom([0.2, 2.0])

  return (
    <div style={{backgroundColor: '#fff', minHeight: '400px'}}>
      <svg {...dragProps} {...zoomProps} width="100%" height="400px">
        <g transform={`translate(${translate[0]},${translate[1]}) scale(${zoom})`}>
          <g>
            {root.descendants().slice(1).map((node) => {
              const dy = node.parent.y - node.y;
              const dx = node.parent.x - node.x;
              return (
                <Path key={node.data.handle} d={`M${node.y},${node.x} h ${dy / 2} v ${dx} h ${dy / 2}`} />
              );
            })}
            </g>
            <g>
            {root.descendants().map((node) => {
              return (
                <g key={node.data.handle} transform={`translate(${node.y},${node.x})`}>
                  <Box width={NODE_WIDTH} height={NODE_HEIGHT} rx={2} x={-NODE_WIDTH / 2} y={-NODE_HEIGHT / 2}/>
                  <g transform={`translate(${-NODE_WIDTH / 2 + 10},${-NODE_HEIGHT / 2 + 20})`}>
                    <a href={`/person/${node.data.handle}`}>
                      <text dy=".35em">{node.data.name}</text>
                    </a>
                  </g>
                </g>
              )
            })}
          </g>
        </g>
      </svg>
    </div>
  )
}

export default Graph
