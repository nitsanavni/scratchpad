import { NavigationNode } from "./navigation";

export function findNextSibling(
  currentIndex: number,
  flatNodes: NavigationNode[],
): number {
  if (currentIndex >= flatNodes.length || currentIndex < 0) return currentIndex;

  const currentNode = flatNodes[currentIndex];
  const currentPath = currentNode.path;
  const currentDepth = currentNode.depth;

  // Look for next node at same depth with same parent path
  const parentPath = currentPath.slice(0, -1);

  for (let i = currentIndex + 1; i < flatNodes.length; i++) {
    const node = flatNodes[i];

    // Found sibling: same depth and same parent path
    if (
      node.depth === currentDepth &&
      arraysEqual(node.path.slice(0, -1), parentPath)
    ) {
      return i;
    }

    // If we've gone past this subtree, no more siblings
    if (node.depth < currentDepth) {
      break;
    }
  }

  return currentIndex; // No next sibling found
}

export function findPrevSibling(
  currentIndex: number,
  flatNodes: NavigationNode[],
): number {
  if (currentIndex >= flatNodes.length || currentIndex < 0) return currentIndex;

  const currentNode = flatNodes[currentIndex];
  const currentPath = currentNode.path;
  const currentDepth = currentNode.depth;

  // Look for previous node at same depth with same parent path
  const parentPath = currentPath.slice(0, -1);

  for (let i = currentIndex - 1; i >= 0; i--) {
    const node = flatNodes[i];

    // Found sibling: same depth and same parent path
    if (
      node.depth === currentDepth &&
      arraysEqual(node.path.slice(0, -1), parentPath)
    ) {
      return i;
    }

    // If we've gone past this subtree, no more siblings
    if (node.depth < currentDepth) {
      break;
    }
  }

  return currentIndex; // No previous sibling found
}

export function findParent(
  currentIndex: number,
  flatNodes: NavigationNode[],
): number {
  if (currentIndex >= flatNodes.length || currentIndex < 0) return currentIndex;

  const currentNode = flatNodes[currentIndex];
  const currentPath = currentNode.path;

  // If already at root level, stay there
  if (currentPath.length <= 1) return currentIndex;

  // Find parent by looking for node with path one level up
  const parentPath = currentPath.slice(0, -1);

  for (let i = currentIndex - 1; i >= 0; i--) {
    const node = flatNodes[i];
    if (arraysEqual(node.path, parentPath)) {
      return i;
    }
  }

  return currentIndex;
}

export function findFirstChild(
  currentIndex: number,
  flatNodes: NavigationNode[],
): number {
  if (currentIndex >= flatNodes.length || currentIndex < 0) return currentIndex;

  const currentNode = flatNodes[currentIndex];

  // Check if there's a next node and if it's a child
  if (currentIndex + 1 < flatNodes.length) {
    const nextNode = flatNodes[currentIndex + 1];
    if (nextNode.depth === currentNode.depth + 1) {
      return currentIndex + 1;
    }
  }

  // No children, stay at current position
  return currentIndex;
}

function arraysEqual(a: number[], b: number[]): boolean {
  return a.length === b.length && a.every((val, i) => val === b[i]);
}
