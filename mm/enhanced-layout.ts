import type { MindmapNode } from "./renderer";
import { flattenNodesForNavigation } from "./navigation";

export interface EnhancedLayoutNode {
  text: string;
  xOffset: number;
  nodeIndex: number; // Index in the flattened navigation array
}

export interface EnhancedLayoutLine {
  nodes: EnhancedLayoutNode[];
  lineIndex: number;
}

export function createEnhancedLayout(
  nodes: MindmapNode[],
): EnhancedLayoutLine[] {
  const flatNodes = flattenNodesForNavigation(nodes);
  const lines: EnhancedLayoutLine[] = [];

  // Create a mapping from node to its index in flat array
  const nodeToIndex = new Map<MindmapNode, number>();
  flatNodes.forEach((flatNode, index) => {
    nodeToIndex.set(flatNode.node, index);
  });

  let currentLineIndex = 0;

  for (const rootNode of nodes) {
    const rootLines = layoutNodeEnhanced(
      rootNode,
      0,
      nodeToIndex,
      currentLineIndex,
    );
    lines.push(...rootLines);
    currentLineIndex += rootLines.length;
  }

  return lines;
}

function layoutNodeEnhanced(
  node: MindmapNode,
  xOffset: number,
  nodeToIndex: Map<MindmapNode, number>,
  startLineIndex: number,
): EnhancedLayoutLine[] {
  const children = node.children;
  const nodeIndex = nodeToIndex.get(node) || 0;
  const prefixOffset = 2; // "- " prefix
  const actualXOffset = xOffset + prefixOffset;

  if (children.length === 0) {
    // Leaf node - single line
    return [
      {
        nodes: [{ text: node.text, xOffset: actualXOffset, nodeIndex }],
        lineIndex: startLineIndex,
      },
    ];
  }

  if (children.length === 1) {
    // Single child - put on same line
    const firstChild = children[0];
    if (!firstChild) return [];

    const childXOffset = actualXOffset + node.text.length + 1; // +1 for space
    const childLines = layoutNodeEnhanced(
      firstChild,
      childXOffset,
      nodeToIndex,
      startLineIndex,
    );

    // Add parent to the main line (first line) of the child
    if (childLines.length > 0 && childLines[0]) {
      childLines[0].nodes.unshift({
        text: node.text,
        xOffset: actualXOffset,
        nodeIndex,
      });
    }

    return childLines;
  }

  // Multiple children - distribute vertically with parent centered
  const result: EnhancedLayoutLine[] = [];
  const childXOffset = actualXOffset + node.text.length + 1;

  // Calculate lines needed for all children
  let totalChildLines = 0;
  const childLineGroups: EnhancedLayoutLine[][] = [];

  for (const child of children) {
    const childLines = layoutNodeEnhanced(
      child,
      childXOffset,
      nodeToIndex,
      startLineIndex + totalChildLines,
    );
    childLineGroups.push(childLines);
    totalChildLines += childLines.length;
  }

  // Find the middle line index for centering the parent
  const parentLineIndex = Math.floor(totalChildLines / 2);

  // Add all child lines
  let currentChildLineIndex = 0;
  for (let i = 0; i < childLineGroups.length; i++) {
    const childLines = childLineGroups[i];
    if (!childLines) continue;

    for (const childLine of childLines) {
      const adjustedLine = {
        ...childLine,
        lineIndex: startLineIndex + currentChildLineIndex,
      };

      // Add parent to the middle line
      if (currentChildLineIndex === parentLineIndex) {
        adjustedLine.nodes.unshift({
          text: node.text,
          xOffset: actualXOffset,
          nodeIndex,
        });
      }

      result.push(adjustedLine);
      currentChildLineIndex++;
    }
  }

  return result;
}
