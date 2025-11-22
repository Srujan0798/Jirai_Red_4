
import { toPng } from 'html-to-image';
import { BaseNode, BaseEdge } from '../types';
import { downloadFile } from './fileHelpers';

export const exportToJSON = (nodes: BaseNode[], edges: BaseEdge[], selectedIds: string[] = []) => {
  const nodesToExport = selectedIds.length > 0 ? nodes.filter(n => selectedIds.includes(n.id)) : nodes;
  const edgesToExport = selectedIds.length > 0 
    ? edges.filter(e => selectedIds.includes(e.from) && selectedIds.includes(e.to))
    : edges;

  const data = {
    version: '1.3',
    timestamp: new Date().toISOString(),
    nodes: nodesToExport,
    edges: edgesToExport,
  };

  const filename = `jirai-workspace-${new Date().toISOString().split('T')[0]}.json`;
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  downloadFile(blob, filename);
};

export const exportToPNG = async (element: HTMLElement | null, filename: string = `jirai-canvas-${new Date().toISOString().split('T')[0]}.png`) => {
  if (!element) return;
  try {
    const dataUrl = await toPng(element, { backgroundColor: '#0F1115', style: { transform: 'scale(1)' } });
    downloadFile(dataUrl, filename);
  } catch (err) {
    console.error('PNG Export failed', err);
  }
};

export const exportToMarkdown = (nodes: BaseNode[]) => {
  const date = new Date().toISOString().split('T')[0];
  let md = `# Jirai Workspace Export - ${date}\n\n`;

  // Simple hierarchical grouping or list since graph topology is complex to flatten perfectly
  const rootNodes = nodes.filter(n => n.type === 'root' || !nodes.some(p => p.childrenIds?.includes(n.id)));
  const otherNodes = nodes.filter(n => !rootNodes.includes(n));

  const renderNode = (node: BaseNode, depth: number) => {
    const indent = '  '.repeat(depth);
    const checkbox = node.type === 'task' ? `[${node.status === 'done' ? 'x' : ' '}] ` : '';
    const tags = node.tags?.length ? ` _(${node.tags.join(', ')})_` : '';
    
    md += `${indent}- ${checkbox}**${node.title}**${tags}\n`;
    if (node.description) md += `${indent}  > ${node.description}\n`;
    if (node.resources) {
      node.resources.forEach(res => {
        md += `${indent}  - [${res.title}](${res.url})\n`;
      });
    }
  };

  md += `## Root Nodes\n`;
  rootNodes.forEach(n => renderNode(n, 0));

  if (otherNodes.length > 0) {
    md += `\n## Other Nodes\n`;
    otherNodes.forEach(n => renderNode(n, 0));
  }

  const filename = `jirai-outline-${date}.md`;
  const blob = new Blob([md], { type: 'text/markdown' });
  downloadFile(blob, filename);
};
