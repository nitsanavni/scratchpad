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
