
export type EdgeStyle = 'solid' | 'dashed' | 'dotted';
export type EdgeKind = 
  | 'prerequisite' | 'depends_on' | 'related' 
  | 'blocks' | 'reference' | 'next' | 'solid' | 'dashed' | 'faded';

export interface BaseEdge {
  id: string;
  from: string;
  to: string;
  kind: EdgeKind;
  style: EdgeStyle;
  weight: number;
  opacity: number;
  label?: string;
  color?: string;
}
