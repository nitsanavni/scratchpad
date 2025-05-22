import { MindmapNode } from "./renderer";
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
    newNodes.splice(rootIndex + 1, 0, newNode);

    return {
      ...state,
      nodes: newNodes,
      selectedIndex: state.selectedIndex + 1,
    };
  } else {
    // Adding sibling to child node
    const path = currentNode.path;
    const parentPath = path.slice(0, -1);
    const siblingIndex = path[path.length - 1];

    // Find parent node
    let parent = newNodes[parentPath[0]];
    for (let i = 1; i < parentPath.length; i++) {
      parent = parent.children[parentPath[i]];
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
  let targetNode = newNodes[path[0]];

  for (let i = 1; i < path.length; i++) {
    targetNode = targetNode.children[path[i]];
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
  let actualNode = newNodes[path[0]];

  for (let i = 1; i < path.length; i++) {
    actualNode = actualNode.children[path[i]];
  }

  actualNode.text = newText;

  return {
    ...state,
    nodes: newNodes,
  };
}
