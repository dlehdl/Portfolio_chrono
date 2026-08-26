import React from 'react';
import { motion } from 'framer-motion';
import { NodeType } from '../types';

interface NodeShapeProps {
  type: NodeType;
  width: number;
  height: number;
  selected: boolean;
}

export const NodeShape: React.FC<NodeShapeProps> = ({ type, width, height, selected }) => {
  const strokeColor = selected ? '#000000' : '#000000';
  const strokeWidth = selected ? 3 : 1.5;
  const fillColor = selected ? '#f0f0f0' : '#ffffff';

  const commonProps = {
    fill: fillColor,
    stroke: strokeColor,
    strokeWidth: strokeWidth,
    initial: { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity: 1 },
    transition: { duration: 0.5, ease: "easeInOut" }
  };

  switch (type) {
    case NodeType.START:
    case NodeType.TERMINATOR:
      // Rounded Rectangle / Pill
      return (
        <motion.rect
          x={-width / 2}
          y={-height / 2}
          width={width}
          height={height}
          rx={height / 2}
          {...commonProps}
        />
      );
    case NodeType.DECISION:
      // Diamond
      return (
        <motion.path
          d={`M 0 ${-height / 2} L ${width / 2 + 20} 0 L 0 ${height / 2} L ${-width / 2 - 20} 0 Z`}
          {...commonProps}
        />
      );
    case NodeType.PROCESS:
    default:
      // Rectangle
      return (
        <motion.rect
          x={-width / 2}
          y={-height / 2}
          width={width}
          height={height}
          {...commonProps}
        />
      );
  }
};
