import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, Crosshair, ShieldAlert, Footprints, MousePointerClick } from 'lucide-react';
import { FlowNode, NodeType } from '../types';

interface InfoSidebarProps {
  node: FlowNode | null;
  onClose: () => void;
}

const InfoSidebar: React.FC<InfoSidebarProps> = ({ node, onClose }) => {
  
  const getIcon = (type: NodeType) => {
      switch(type) {
          case NodeType.START: return <MousePointerClick size={24} />;
          case NodeType.PROCESS: return <Target size={24} />;
          case NodeType.DECISION: return <Crosshair size={24} />;
          case NodeType.TERMINATOR: return <Footprints size={24} />;
          default: return <Target size={24} />;
      }
  };

  return (
    <AnimatePresence>
      {node && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute top-0 right-0 h-full w-full sm:w-96 bg-white border-l-2 border-black shadow-[-10px_0px_20px_rgba(0,0,0,0.05)] z-20 flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b-2 border-black flex justify-between items-center bg-gray-50">
            <div className="flex items-center gap-3">
               <div className="p-2 border border-black bg-white">
                 {getIcon(node.type)}
               </div>
               <span className="font-mono text-xs text-gray-500 uppercase">{node.type}</span>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-black hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-8 flex-1 overflow-y-auto">
            <h2 className="text-3xl font-bold mb-4 uppercase tracking-tighter leading-none">
                {node.label}
            </h2>
            
            <div className="mb-8">
                <p className="text-lg leading-relaxed font-light text-gray-800">
                    {node.description}
                </p>
            </div>

            {node.details && node.details.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-2 mb-4">
                        시스템 로직 상세
                    </h3>
                    <ul className="space-y-3">
                        {node.details.map((detail, idx) => (
                            <li key={idx} className="flex gap-3 text-sm group">
                                <span className="w-1.5 h-1.5 mt-1.5 bg-black flex-shrink-0 group-hover:scale-150 transition-transform duration-300" />
                                <span className="text-gray-700">{detail}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            
            <div className="mt-12 p-4 border border-dashed border-gray-300 bg-gray-50 text-xs text-gray-500 font-mono">
                ID: {node.id.toUpperCase()}<br/>
                COORD: [{node.x}, {node.y}]
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InfoSidebar;