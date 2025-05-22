import { MindmapNode } from "./renderer";

export interface LayoutNode {
  text: string;
  xOffset: number;
}

export interface LayoutLine {
  nodes: LayoutNode[];
  isMainLine: boolean;
}

export function createHorizontalLayout(nodes: MindmapNode[]): LayoutLine[] {
  const lines: LayoutLine[] = [];

  for (const rootNode of nodes) {
    const rootLines = layoutNode(rootNode, 0);
    lines.push(...rootLines);
  }

  return lines;
}

function layoutNode(node: MindmapNode, xOffset: number): LayoutLine[] {
  const children = node.children;

  if (children.length === 0) {
    // Leaf node - single line
    return [
      {
        nodes: [{ text: node.text, xOffset }],
        isMainLine: true,
      },
    ];
  }

  if (children.length === 1) {
    // Single child - put on same line
    const childXOffset = xOffset + node.text.length + 1;
    const childLines = layoutNode(children[0], childXOffset);

    // Add parent to the main line of the child
    const mainLineIndex = childLines.findIndex((line) => line.isMainLine);
    if (mainLineIndex >= 0) {
      childLines[mainLineIndex].nodes.unshift({ text: node.text, xOffset });
    }

    return childLines;
  }

  // Multiple children - distribute vertically
  const result: LayoutLine[] = [];
  const childXOffset = xOffset + node.text.length + 1;
  const midPoint = Math.floor(children.length / 2);

  // Children above the main line
  for (let i = 0; i < midPoint; i++) {
    const childLines = layoutNode(children[i], childXOffset);
    result.push(...childLines.map((line) => ({ ...line, isMainLine: false })));
  }

  // Main line with parent and middle child
  const mainChild = children[midPoint];
  const mainChildLines = layoutNode(mainChild, childXOffset);
  const mainLineIndex = mainChildLines.findIndex((line) => line.isMainLine);

  if (mainLineIndex >= 0) {
    mainChildLines[mainLineIndex].nodes.unshift({ text: node.text, xOffset });
    result.push(...mainChildLines);
  }

  // Children below the main line
  for (let i = midPoint + 1; i < children.length; i++) {
    const childLines = layoutNode(children[i], childXOffset);
    result.push(...childLines.map((line) => ({ ...line, isMainLine: false })));
  }

  return result;
}
