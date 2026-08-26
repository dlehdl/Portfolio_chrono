import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NODES, EDGES } from '../constants';
import { FlowNode } from '../types';
import { NodeShape } from './NodeShape';
import { Info, ZoomIn, ZoomOut, Maximize } from 'lucide-react';

interface FlowDiagramProps {
  onNodeSelect: (node: FlowNode | null) => void;
  selectedNodeId: string | null;
}

const FlowDiagram: React.FC<FlowDiagramProps> = ({ onNodeSelect, selectedNodeId }) => {
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  // Node Dimensions
  const NODE_W = 180;
  const NODE_H = 60;

  const handleZoom = (delta: number) => {
    setScale(prev => Math.min(Math.max(prev + delta, 0.5), 2));
  };

  const handleReset = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-white cursor-move"
        onMouseDown={(e) => {
           // Simple drag implementation
           const startX = e.clientX - pan.x;
           const startY = e.clientY - pan.y;
           
           const handleMouseMove = (moveEvent: MouseEvent) => {
             setPan({
               x: moveEvent.clientX - startX,
               y: moveEvent.clientY - startY
             });
           };
           
           const handleMouseUp = () => {
             window.removeEventListener('mousemove', handleMouseMove);
             window.removeEventListener('mouseup', handleMouseUp);
           };
           
           window.addEventListener('mousemove', handleMouseMove);
           window.addEventListener('mouseup', handleMouseUp);
        }}
    >
      {/* Controls */}
      <div className="absolute bottom-6 left-6 z-10 flex flex-col gap-2 bg-white border border-black p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <button onClick={() => handleZoom(0.1)} className="p-2 hover:bg-gray-100"><ZoomIn size={20} /></button>
        <button onClick={() => handleZoom(-0.1)} className="p-2 hover:bg-gray-100"><ZoomOut size={20} /></button>
        <button onClick={handleReset} className="p-2 hover:bg-gray-100"><Maximize size={20} /></button>
      </div>

      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <h1 className="text-2xl font-bold uppercase tracking-widest border-b-2 border-black inline-block pb-1">로직 흐름도</h1>
        <p className="text-xs text-gray-500 mt-2 font-mono">드래그하여 이동 • 노드 클릭하여 상세 보기</p>
      </div>

      <svg 
        className="w-full h-full"
        viewBox={`0 0 ${window.innerWidth} ${window.innerHeight}`}
      >
        <motion.g
          animate={{ x: pan.x, y: pan.y, scale: scale }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
           {/* Render Edges */}
           {EDGES.map(edge => {
            const source = NODES.find(n => n.id === edge.source);
            const target = NODES.find(n => n.id === edge.target);

            if (!source || !target) return null;

            // Simple routing: Center to Center logic for now, tailored for vertical stack
            let startX = source.x;
            let startY = source.y + NODE_H / 2;
            let endX = target.x;
            let endY = target.y - NODE_H / 2;
            
            // Special handling for side branches
            if (target.x > source.x) {
                // Moving Right
                startX = source.x + NODE_W / 2 + 20; // Start from right side of diamond
                startY = source.y;
                endX = target.x - NODE_W / 2;
                endY = target.y;
            } else if (source.type === 'DECISION' && target.x === source.x) {
                // Moving Down from Decision
                 startX = source.x;
                 startY = source.y + NODE_H / 2;
                 endX = target.x;
                 endY = target.y - NODE_H / 2;
            }

            const isSelected = selectedNodeId === source.id || selectedNodeId === target.id;

            return (
              <g key={edge.id}>
                <motion.path
                  d={`M ${startX} ${startY} L ${endX} ${endY}`} // Simple straight line or refine for elbow
                  fill="none"
                  stroke={isSelected ? "#000" : "#666"}
                  strokeWidth={isSelected ? 2 : 1}
                  markerEnd="url(#arrowhead)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
                {edge.label && (
                  <text 
                    x={(startX + endX) / 2} 
                    y={(startY + endY) / 2 - 10} 
                    textAnchor="middle" 
                    fill="#000" 
                    fontSize="12"
                    fontWeight="bold"
                    className="bg-white"
                  >
                    {edge.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Arrowhead Marker */}
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#000" />
            </marker>
          </defs>

          {/* Render Nodes */}
          {NODES.map(node => (
            <motion.g
              key={node.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onNodeSelect(node);
              }}
              onHoverStart={() => {
                document.body.style.cursor = 'pointer';
              }}
              onHoverEnd={() => {
                document.body.style.cursor = 'default';
              }}
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            >
              <g transform={`translate(${node.x}, ${node.y})`}>
                <NodeShape 
                    type={node.type} 
                    width={NODE_W} 
                    height={NODE_H} 
                    selected={selectedNodeId === node.id} 
                />
                <text
                  x={0}
                  y={0}
                  dy={4}
                  textAnchor="middle"
                  className="font-medium text-xs tracking-tight pointer-events-none select-none uppercase"
                  fill="black"
                  style={{ fontSize: '11px', fontWeight: 600 }}
                >
                  {node.label}
                </text>
                
                {/* Info Icon hint */}
                 <g transform={`translate(${NODE_W/2 - 10}, ${-NODE_H/2 - 10})`}>
                     {selectedNodeId === node.id && (
                        <circle r="4" fill="black" />
                     )}
                 </g>
              </g>
            </motion.g>
          ))}
        </motion.g>
      </svg>
    </div>
  );
};

export default FlowDiagram;