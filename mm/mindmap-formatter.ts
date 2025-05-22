import { MindmapNode } from "./renderer";

export interface MindmapLine {
  text: string;
  indent: number;
  hasConnection: boolean;
  isLast: boolean;
}

export function formatMindmapVisual(nodes: MindmapNode[]): MindmapLine[] {
  const lines: MindmapLine[] = [];

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const isLastRoot = i === nodes.length - 1;

    formatNode(node, 0, lines, isLastRoot);
  }

  return lines;
}

function formatNode(
  node: MindmapNode,
  baseIndent: number,
  lines: MindmapLine[],
  isLast: boolean,
): void {
  const children = node.children;
  const hasChildren = children.length > 0;

  if (hasChildren) {
    // For nodes with children, show children first (above), then node, then remaining children (below)
    const midPoint = Math.floor(children.length / 2);

    // Children above the parent
    for (let i = 0; i < midPoint; i++) {
      formatNode(children[i], baseIndent + 1, lines, false);
    }

    // The parent node
    lines.push({
      text: node.text,
      indent: baseIndent,
      hasConnection: hasChildren,
      isLast: false,
    });

    // Children below the parent
    for (let i = midPoint; i < children.length; i++) {
      const isLastChild = i === children.length - 1;
      formatNode(children[i], baseIndent + 1, lines, isLastChild && isLast);
    }
  } else {
    // Leaf node - has connection if it's a child (indent > 0)
    lines.push({
      text: node.text,
      indent: baseIndent,
      hasConnection: baseIndent > 0,
      isLast,
    });
  }
}
