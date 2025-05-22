export interface MindmapNode {
  text: string;
  level: number;
  children: MindmapNode[];
}

export function parseMindmapFile(content: string): MindmapNode[] {
  const lines = content.split('\n').filter(line => line.trim());
  const nodes: MindmapNode[] = [];
  const stack: MindmapNode[] = [];
  
  for (const line of lines) {
    const level = Math.floor((line.length - line.trimStart().length) / 2);
    const text = line.trim();
    
    const node: MindmapNode = {
      text,
      level,
      children: []
    };
    
    // Pop stack until we find the parent level
    while (stack.length > level) {
      stack.pop();
    }
    
    if (stack.length === 0) {
      // Root level node
      nodes.push(node);
    } else {
      // Child node
      stack[stack.length - 1].children.push(node);
    }
    
    stack.push(node);
  }
  
  return nodes;
}

export function renderMindmap(nodes: MindmapNode[]): string {
  const lines: string[] = [];
  
  function renderNode(node: MindmapNode): void {
    const indent = '  '.repeat(node.level);
    const bullet = node.level === 0 ? '•' : '◦';
    lines.push(`${indent}${bullet} ${node.text}`);
    
    for (const child of node.children) {
      renderNode(child);
    }
  }
  
  for (const node of nodes) {
    renderNode(node);
  }
  
  return lines.join('\n');
}