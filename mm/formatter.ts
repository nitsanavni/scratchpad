import { MindmapNode } from "./renderer";

export function formatToMindmap(nodes: MindmapNode[]): string {
  const lines: string[] = [];
  
  function formatNode(node: MindmapNode): void {
    const indent = '  '.repeat(node.level);
    lines.push(`${indent}${node.text}`);
    
    for (const child of node.children) {
      formatNode(child);
    }
  }
  
  for (const node of nodes) {
    formatNode(node);
  }
  
  return lines.join('\n');
}