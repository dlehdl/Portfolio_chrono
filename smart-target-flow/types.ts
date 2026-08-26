export enum NodeType {
  START = 'START',
  PROCESS = 'PROCESS',
  DECISION = 'DECISION',
  TERMINATOR = 'TERMINATOR',
  NOTE = 'NOTE'
}

export interface FlowNode {
  id: string;
  type: NodeType;
  label: string;
  description: string;
  details?: string[];
  x: number;
  y: number;
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  dashed?: boolean;
}
