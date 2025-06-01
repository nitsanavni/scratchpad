import type { NavigationNode } from "./navigation";

export function findParentIndex(
  currentIndex: number,
  flatNodes: NavigationNode[],
): number {
  if (currentIndex >= flatNodes.length || currentIndex < 0) return currentIndex;

  const currentNode = flatNodes[currentIndex];
  if (!currentNode) return currentIndex;
  const currentPath = currentNode.path;

  // If already at root level, stay there
  if (currentPath.length <= 1) return currentIndex;

  // Find parent by looking for node with path one level up
  const parentPath = currentPath.slice(0, -1);

  for (let i = currentIndex - 1; i >= 0; i--) {
    const node = flatNodes[i];
    if (!node) continue;
    if (arraysEqual(node.path, parentPath)) {
      return i;
    }
  }

  return currentIndex;
}

export function findFirstChildIndex(
  currentIndex: number,
  flatNodes: NavigationNode[],
): number {
  if (currentIndex >= flatNodes.length || currentIndex < 0) return currentIndex;

  const currentNode = flatNodes[currentIndex];
  if (!currentNode) return currentIndex;

  // Check if there's a next node and if it's a child
  if (currentIndex + 1 < flatNodes.length) {
    const nextNode = flatNodes[currentIndex + 1];
    if (!nextNode) return currentIndex;
    if (nextNode.depth === currentNode.depth + 1) {
      return currentIndex + 1;
    }
  }

  // No children, stay at current position
  return currentIndex;
}

export function findRootIndex(
  currentIndex: number,
  flatNodes: NavigationNode[],
): number {
  if (currentIndex >= flatNodes.length || currentIndex < 0) return currentIndex;

  const currentNode = flatNodes[currentIndex];
  if (!currentNode) return currentIndex;
  const rootIndex = currentNode.path[0];
  if (rootIndex === undefined) return currentIndex;
  const rootPath = [rootIndex]; // First element is the root index

  // Find the root node by looking for path with single element
  for (let i = 0; i < flatNodes.length; i++) {
    const node = flatNodes[i];
    if (!node) continue;
    if (arraysEqual(node.path, rootPath)) {
      return i;
    }
  }

  return currentIndex;
}

// TODO: Implement addSiblingNode
// export function addSiblingNode(
//   currentIndex: number,
//   flatNodes: NavigationNode[],
//   nodes: MindmapNode[],
// ): { newNodes: MindmapNode[]; newIndex: number } {
//   // TODO: Implement sibling addition
//   return { newNodes: nodes, newIndex: currentIndex };
// }

// TODO: Implement addChildNode
// export function addChildNode(
//   currentIndex: number,
//   flatNodes: NavigationNode[],
//   nodes: MindmapNode[],
// ): { newNodes: MindmapNode[]; newIndex: number } {
//   // TODO: Implement child addition
//   return { newNodes: nodes, newIndex: currentIndex };
// }

function arraysEqual(a: number[], b: number[]): boolean {
  return a.length === b.length && a.every((val, i) => val === b[i]);
}
