
import { BaseNode, BaseEdge } from '../types';

/**
 * TOON (Tree Object Notation)
 * A lightweight, line-based format optimized for:
 * 1. AI Context Windows (Token efficiency)
 * 2. Human Readability
 * 3. Storage Size (~40% smaller than verbose JSON)
 */

export const serializeToTOON = (nodes: BaseNode[], edges: BaseEdge[]): string => {
  const lines = ['# TOON v1.0'];
  
  lines.push('');
  lines.push('[NODES]');
  nodes.forEach(n => {
    // Minify metadata to essentials
    const meta = {
      desc: n.description,
      stat: n.status,
      vis: n.visual,
      tags: n.tags,
      wf: n.workflow,
      vid: n.video,
      psn: n.person,
      tsk: n.task,
      res: n.resources
    };
    
    // Clean undefined/empty values to save space
    Object.keys(meta).forEach(key => {
      const val = (meta as any)[key];
      if (val === undefined || val === null || (Array.isArray(val) && val.length === 0)) {
        delete (meta as any)[key];
      }
    });
    
    const metaStr = JSON.stringify(meta);
    // Format: ID | TYPE | X,Y | TITLE | METADATA_JSON
    lines.push(`${n.id}|${n.type}|${Math.round(n.position.x)},${Math.round(n.position.y)}|${n.title}|${metaStr}`);
  });

  lines.push('');
  lines.push('[EDGES]');
  edges.forEach(e => {
    // Format: FROM -> TO : KIND
    lines.push(`${e.from}->${e.to}:${e.kind || 'solid'}`);
  });

  return lines.join('\n');
};

export const parseFromTOON = (toon: string): { nodes: BaseNode[], edges: BaseEdge[] } => {
  const lines = toon.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));
  const nodes: BaseNode[] = [];
  const edges: BaseEdge[] = [];
  
  let section = '';
  
  lines.forEach(line => {
    if (line === '[NODES]') { section = 'NODES'; return; }
    if (line === '[EDGES]') { section = 'EDGES'; return; }
    
    if (section === 'NODES') {
      const parts = line.split('|');
      // Ensure we have at least ID, TYPE, POS, TITLE
      if (parts.length >= 4) {
        const [id, type, pos, title, metaStr] = parts;
        const [x, y] = pos.split(',').map(Number);
        
        let meta: any = {};
        try { 
            if (metaStr) meta = JSON.parse(metaStr); 
        } catch(e) {
            console.warn('Failed to parse node meta:', metaStr);
        }
        
        nodes.push({
          id,
          type: type as any,
          title,
          position: { x: isNaN(x) ? 0 : x, y: isNaN(y) ? 0 : y },
          description: meta.desc,
          status: meta.stat || 'todo',
          visual: meta.vis || { shape: 'rounded-rect', sizeMultiplier: 1 },
          tags: meta.tags || [],
          workflow: meta.wf,
          video: meta.vid,
          person: meta.psn,
          task: meta.tsk,
          resources: meta.res,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
    }
    
    if (section === 'EDGES') {
      // Syntax: id1->id2:kind
      const [connection, kind] = line.split(':');
      const [from, to] = connection.split('->');
      
      if (from && to) {
        const finalKind = (kind || 'solid').trim();
        edges.push({
          id: `e-${Math.random().toString(36).substr(2, 9)}`,
          from: from.trim(),
          to: to.trim(),
          kind: finalKind as any,
          style: finalKind === 'related' ? 'dashed' : 'solid',
          weight: 2,
          opacity: 1
        });
      }
    }
  });
  
  return { nodes, edges };
};
