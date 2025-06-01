import type { MindmapNode } from "./renderer";
import { flattenNodesForNavigation } from "./navigation";

export interface EditorState {
  nodes: MindmapNode[];
  mode: "navigation" | "edit";
  selectedIndex: number;
  editingIndex: number;
  editingText: string;
}

export function createInitialEditorState(nodes: MindmapNode[]): EditorState {
  return {
    nodes: [...nodes], // Deep copy to avoid mutations
    mode: "navigation",
    selectedIndex: 0,
    editingIndex: -1,
    editingText: "",
  };
}

export function addSiblingNode(
  state: EditorState,
  nodeText: string,
): EditorState {
  const flatNodes = flattenNodesForNavigation(state.nodes);
  const currentNode = flatNodes[state.selectedIndex];

  if (!currentNode) return state;

  const newNode: MindmapNode = {
    text: nodeText,
    level: currentNode.node.level,
    children: [],
  };

  // Deep copy the nodes structure
  const newNodes = JSON.parse(JSON.stringify(state.nodes)) as MindmapNode[];

  if (currentNode.depth === 0) {
    // Adding sibling to root node
    const rootIndex = currentNode.path[0];
    if (rootIndex === undefined) return state;
    newNodes.splice(rootIndex + 1, 0, newNode);

    // Calculate new selected index by finding the new node in flattened navigation
    const newFlatNodes = flattenNodesForNavigation(newNodes);
    const newSelectedIndex = newFlatNodes.findIndex(
      (flatNode) => flatNode.node === newNode,
    );

    return {
      ...state,
      nodes: newNodes,
      selectedIndex:
        newSelectedIndex >= 0 ? newSelectedIndex : state.selectedIndex,
    };
  } else {
    // Adding sibling to child node
    const path = currentNode.path;
    const parentPath = path.slice(0, -1);
    const siblingIndex = path[path.length - 1];
    if (siblingIndex === undefined) return state;

    // Find parent node
    const parentRootIndex = parentPath[0];
    if (parentRootIndex === undefined) return state;
    let parent = newNodes[parentRootIndex];
    if (!parent) return state;

    for (let i = 1; i < parentPath.length; i++) {
      const parentIndex = parentPath[i];
      if (parentIndex === undefined) return state;
      parent = parent.children[parentIndex];
      if (!parent) return state;
    }

    // Insert new sibling
    parent.children.splice(siblingIndex + 1, 0, newNode);

    // Calculate new selected index
    const newFlatNodes = flattenNodesForNavigation(newNodes);
    const newSelectedIndex = newFlatNodes.findIndex(
      (flatNode) => flatNode.node === newNode,
    );

    return {
      ...state,
      nodes: newNodes,
      selectedIndex:
        newSelectedIndex >= 0 ? newSelectedIndex : state.selectedIndex,
    };
  }
}

export function addChildNode(
  state: EditorState,
  nodeText: string,
): EditorState {
  const flatNodes = flattenNodesForNavigation(state.nodes);
  const currentNode = flatNodes[state.selectedIndex];

  if (!currentNode) return state;

  const newNode: MindmapNode = {
    text: nodeText,
    level: currentNode.node.level + 1,
    children: [],
  };

  // Deep copy the nodes structure
  const newNodes = JSON.parse(JSON.stringify(state.nodes)) as MindmapNode[];

  // Find the actual node in the new structure and add child
  const path = currentNode.path;
  const rootIndex = path[0];
  if (rootIndex === undefined) return state;
  let targetNode = newNodes[rootIndex];
  if (!targetNode) return state;

  for (let i = 1; i < path.length; i++) {
    const childIndex = path[i];
    if (childIndex === undefined) return state;
    targetNode = targetNode.children[childIndex];
    if (!targetNode) return state;
  }

  targetNode.children.push(newNode);

  // Calculate new selected index
  const newFlatNodes = flattenNodesForNavigation(newNodes);
  const newSelectedIndex = newFlatNodes.findIndex(
    (flatNode) =>
      flatNode.node.text === newNode.text && flatNode.depth === newNode.level,
  );

  return {
    ...state,
    nodes: newNodes,
    selectedIndex:
      newSelectedIndex >= 0 ? newSelectedIndex : state.selectedIndex,
  };
}

export function updateNodeText(
  state: EditorState,
  nodeIndex: number,
  newText: string,
): EditorState {
  const flatNodes = flattenNodesForNavigation(state.nodes);
  const targetNode = flatNodes[nodeIndex];

  if (!targetNode) return state;

  // Deep copy the nodes structure
  const newNodes = JSON.parse(JSON.stringify(state.nodes)) as MindmapNode[];

  // Find the actual node in the new structure and update text
  const path = targetNode.path;
  const rootIndex = path[0];
  if (rootIndex === undefined) return state;
  let actualNode = newNodes[rootIndex];
  if (!actualNode) return state;

  for (let i = 1; i < path.length; i++) {
    const childIndex = path[i];
    if (childIndex === undefined) return state;
    actualNode = actualNode.children[childIndex];
    if (!actualNode) return state;
  }

  actualNode.text = newText;

  return {
    ...state,
    nodes: newNodes,
  };
}

export function moveNodeUp(state: EditorState): EditorState {
  const flatNodes = flattenNodesForNavigation(state.nodes);
  const currentNode = flatNodes[state.selectedIndex];

  if (!currentNode) return state;

  // Deep copy the nodes structure
  const newNodes = JSON.parse(JSON.stringify(state.nodes)) as MindmapNode[];
  const path = currentNode.path;

  if (currentNode.depth === 0) {
    // Moving root node up
    const rootIndex = path[0];
    if (rootIndex === undefined || rootIndex === 0) return state; // Can't move first root up

    const nodeToMove = newNodes[rootIndex];
    if (!nodeToMove) return state;

    // Remove from current position and insert before previous sibling
    newNodes.splice(rootIndex, 1);
    newNodes.splice(rootIndex - 1, 0, nodeToMove);

    // Update selected index to follow the moved node
    const newFlatNodes = flattenNodesForNavigation(newNodes);
    const newSelectedIndex = newFlatNodes.findIndex(
      (flatNode) => flatNode.node === nodeToMove,
    );

    return {
      ...state,
      nodes: newNodes,
      selectedIndex:
        newSelectedIndex >= 0 ? newSelectedIndex : state.selectedIndex,
    };
  } else {
    // Moving child node up within its parent
    const parentPath = path.slice(0, -1);
    const siblingIndex = path[path.length - 1];
    if (siblingIndex === undefined || siblingIndex === 0) return state; // Can't move first child up

    // Find parent node
    const parentRootIndex = parentPath[0];
    if (parentRootIndex === undefined) return state;
    let parent = newNodes[parentRootIndex];
    if (!parent) return state;

    for (let i = 1; i < parentPath.length; i++) {
      const parentIndex = parentPath[i];
      if (parentIndex === undefined) return state;
      parent = parent.children[parentIndex];
      if (!parent) return state;
    }

    const nodeToMove = parent.children[siblingIndex];
    if (!nodeToMove) return state;

    // Remove from current position and insert before previous sibling
    parent.children.splice(siblingIndex, 1);
    parent.children.splice(siblingIndex - 1, 0, nodeToMove);

    // Update selected index to follow the moved node
    const newFlatNodes = flattenNodesForNavigation(newNodes);
    const newSelectedIndex = newFlatNodes.findIndex(
      (flatNode) => flatNode.node === nodeToMove,
    );

    return {
      ...state,
      nodes: newNodes,
      selectedIndex:
        newSelectedIndex >= 0 ? newSelectedIndex : state.selectedIndex,
    };
  }
}

export function moveNodeDown(state: EditorState): EditorState {
  const flatNodes = flattenNodesForNavigation(state.nodes);
  const currentNode = flatNodes[state.selectedIndex];

  if (!currentNode) return state;

  // Deep copy the nodes structure
  const newNodes = JSON.parse(JSON.stringify(state.nodes)) as MindmapNode[];
  const path = currentNode.path;

  if (currentNode.depth === 0) {
    // Moving root node down
    const rootIndex = path[0];
    if (rootIndex === undefined || rootIndex >= newNodes.length - 1)
      return state; // Can't move last root down

    const nodeToMove = newNodes[rootIndex];
    if (!nodeToMove) return state;

    // Remove from current position and insert after next sibling
    newNodes.splice(rootIndex, 1);
    newNodes.splice(rootIndex + 1, 0, nodeToMove);

    // Update selected index to follow the moved node
    const newFlatNodes = flattenNodesForNavigation(newNodes);
    const newSelectedIndex = newFlatNodes.findIndex(
      (flatNode) => flatNode.node === nodeToMove,
    );

    return {
      ...state,
      nodes: newNodes,
      selectedIndex:
        newSelectedIndex >= 0 ? newSelectedIndex : state.selectedIndex,
    };
  } else {
    // Moving child node down within its parent
    const parentPath = path.slice(0, -1);
    const siblingIndex = path[path.length - 1];
    if (siblingIndex === undefined) return state;

    // Find parent node
    const parentRootIndex = parentPath[0];
    if (parentRootIndex === undefined) return state;
    let parent = newNodes[parentRootIndex];
    if (!parent) return state;

    for (let i = 1; i < parentPath.length; i++) {
      const parentIndex = parentPath[i];
      if (parentIndex === undefined) return state;
      parent = parent.children[parentIndex];
      if (!parent) return state;
    }

    if (siblingIndex >= parent.children.length - 1) return state; // Can't move last child down

    const nodeToMove = parent.children[siblingIndex];
    if (!nodeToMove) return state;

    // Remove from current position and insert after next sibling
    parent.children.splice(siblingIndex, 1);
    parent.children.splice(siblingIndex + 1, 0, nodeToMove);

    // Update selected index to follow the moved node
    const newFlatNodes = flattenNodesForNavigation(newNodes);
    const newSelectedIndex = newFlatNodes.findIndex(
      (flatNode) => flatNode.node === nodeToMove,
    );

    return {
      ...state,
      nodes: newNodes,
      selectedIndex:
        newSelectedIndex >= 0 ? newSelectedIndex : state.selectedIndex,
    };
  }
}

export function moveNodeRight(state: EditorState): EditorState {
  const flatNodes = flattenNodesForNavigation(state.nodes);
  const currentNode = flatNodes[state.selectedIndex];

  if (!currentNode) return state;

  // Can't move into previous sibling if we're the first child or root
  const path = currentNode.path;
  const siblingIndex = path[path.length - 1];
  if (siblingIndex === undefined || siblingIndex === 0) return state;

  // Deep copy the nodes structure
  const newNodes = JSON.parse(JSON.stringify(state.nodes)) as MindmapNode[];

  // Get reference to node being moved
  let nodeToMove: MindmapNode | undefined;

  if (currentNode.depth === 0) {
    // Can't move root nodes into siblings
    return state;
  } else {
    // Find parent node to get siblings
    const parentPath = path.slice(0, -1);
    const parentRootIndex = parentPath[0];
    if (parentRootIndex === undefined) return state;
    let parent = newNodes[parentRootIndex];
    if (!parent) return state;

    for (let i = 1; i < parentPath.length; i++) {
      const parentIndex = parentPath[i];
      if (parentIndex === undefined) return state;
      parent = parent.children[parentIndex];
      if (!parent) return state;
    }

    nodeToMove = parent.children[siblingIndex];
    if (!nodeToMove) return state;

    // Get previous sibling
    const prevSibling = parent.children[siblingIndex - 1];
    if (!prevSibling) return state;

    // Remove node from current position
    parent.children.splice(siblingIndex, 1);

    // Add as last child of previous sibling
    prevSibling.children.push(nodeToMove);

    // Update node levels recursively
    const updateLevels = (node: MindmapNode, baseLevel: number) => {
      node.level = baseLevel;
      node.children.forEach((child) => updateLevels(child, baseLevel + 1));
    };
    updateLevels(nodeToMove, prevSibling.level + 1);
  }

  // Update selected index to follow the moved node
  const newFlatNodes = flattenNodesForNavigation(newNodes);
  const newSelectedIndex = newFlatNodes.findIndex(
    (flatNode) => flatNode.node === nodeToMove,
  );

  return {
    ...state,
    nodes: newNodes,
    selectedIndex:
      newSelectedIndex >= 0 ? newSelectedIndex : state.selectedIndex,
  };
}

export function moveNodeLeft(state: EditorState): EditorState {
  const flatNodes = flattenNodesForNavigation(state.nodes);
  const currentNode = flatNodes[state.selectedIndex];

  if (!currentNode) return state;

  // Can't move left if we're already at root level
  if (currentNode.depth === 0) return state;

  // Deep copy the nodes structure
  const newNodes = JSON.parse(JSON.stringify(state.nodes)) as MindmapNode[];
  const path = currentNode.path;

  // Find parent and grandparent
  const parentPath = path.slice(0, -1);
  const siblingIndex = path[path.length - 1];
  if (siblingIndex === undefined) return state;

  // Find parent node
  const parentRootIndex = parentPath[0];
  if (parentRootIndex === undefined) return state;
  let parent = newNodes[parentRootIndex];
  if (!parent) return state;

  for (let i = 1; i < parentPath.length; i++) {
    const parentIndex = parentPath[i];
    if (parentIndex === undefined) return state;
    parent = parent.children[parentIndex];
    if (!parent) return state;
  }

  const nodeToMove = parent.children[siblingIndex];
  if (!nodeToMove) return state;

  // Remove from current position
  parent.children.splice(siblingIndex, 1);

  if (parentPath.length === 1) {
    // Parent is a root node, move to root level
    const parentRootIdx = parentPath[0];
    if (parentRootIdx === undefined) return state;

    // Insert after parent at root level
    newNodes.splice(parentRootIdx + 1, 0, nodeToMove);

    // Update node levels recursively
    const updateLevels = (node: MindmapNode, baseLevel: number) => {
      node.level = baseLevel;
      node.children.forEach((child) => updateLevels(child, baseLevel + 1));
    };
    updateLevels(nodeToMove, 0);
  } else {
    // Parent is not root, find grandparent
    const grandparentPath = parentPath.slice(0, -1);
    const parentIndex = parentPath[parentPath.length - 1];
    if (parentIndex === undefined) return state;

    // Find grandparent node
    const grandparentRootIndex = grandparentPath[0];
    if (grandparentRootIndex === undefined) return state;
    let grandparent = newNodes[grandparentRootIndex];
    if (!grandparent) return state;

    for (let i = 1; i < grandparentPath.length; i++) {
      const gpIndex = grandparentPath[i];
      if (gpIndex === undefined) return state;
      grandparent = grandparent.children[gpIndex];
      if (!grandparent) return state;
    }

    // Insert after parent in grandparent's children
    grandparent.children.splice(parentIndex + 1, 0, nodeToMove);

    // Update node levels recursively
    const updateLevels = (node: MindmapNode, baseLevel: number) => {
      node.level = baseLevel;
      node.children.forEach((child) => updateLevels(child, baseLevel + 1));
    };
    updateLevels(nodeToMove, grandparent.level + 1);
  }

  // Update selected index to follow the moved node
  const newFlatNodes = flattenNodesForNavigation(newNodes);
  const newSelectedIndex = newFlatNodes.findIndex(
    (flatNode) => flatNode.node === nodeToMove,
  );

  return {
    ...state,
    nodes: newNodes,
    selectedIndex:
      newSelectedIndex >= 0 ? newSelectedIndex : state.selectedIndex,
  };
}
