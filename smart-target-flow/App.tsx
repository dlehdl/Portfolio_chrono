import React, { useState } from 'react';
import FlowDiagram from './components/FlowDiagram';
import InfoSidebar from './components/InfoSidebar';
import { FlowNode } from './types';

const App: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-white text-black font-sans selection:bg-black selection:text-white">
      {/* Main Canvas */}
      <main className="w-full h-full">
        <FlowDiagram 
            onNodeSelect={setSelectedNode} 
            selectedNodeId={selectedNode?.id || null} 
        />
      </main>

      {/* Detail Panel */}
      <InfoSidebar 
        node={selectedNode} 
        onClose={() => setSelectedNode(null)} 
      />
      
      {/* Branding / Footer */}
      <div className="absolute bottom-6 right-6 pointer-events-none text-right hidden sm:block">
        <h2 className="text-sm font-bold uppercase">스마트 타겟팅 시스템</h2>
        <p className="text-[10px] text-gray-400">개발 킥오프 명세서 • V1.0</p>
      </div>
    </div>
  );
};

export default App;