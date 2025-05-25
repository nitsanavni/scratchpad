import type { MindmapNode } from "./renderer";

export interface NavigationNode {
  node: MindmapNode;
  depth: number;
  path: number[]; // Path to this node in the tree (e.g., [0, 1, 0] = first root, second child, first grandchild)
}

export function flattenNodesForNavigation(
  nodes: MindmapNode[],
): NavigationNode[] {
  const result: NavigationNode[] = [];

  function traverse(nodeList: MindmapNode[], depth = 0, path: number[] = []) {
    for (let i = 0; i < nodeList.length; i++) {
      const node = nodeList[i];
      if (!node) continue;
      const currentPath = [...path, i];

      result.push({
        node,
        depth,
        path: currentPath,
      });

      if (node.children.length > 0) {
        traverse(node.children, depth + 1, currentPath);
      }
    }
  }

  traverse(nodes);
  return result;
}

export function getNextNodeIndex(
  currentIndex: number,
  maxIndex: number,
): number {
  return Math.min(currentIndex + 1, maxIndex);
}

export function getPrevNodeIndex(currentIndex: number): number {
  return Math.max(currentIndex - 1, 0);
}
