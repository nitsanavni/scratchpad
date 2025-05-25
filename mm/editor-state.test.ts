import { describe, it, expect } from "bun:test";
import {
  addSiblingNode,
  addChildNode,
  updateNodeText,
  createInitialEditorState,
} from "./editor-state";
import type { EditorState } from "./editor-state";
import type { MindmapNode } from "./renderer";

describe("Editor State", () => {
  const sampleNodes: MindmapNode[] = [
    {
      text: "Root",
      level: 0,
      children: [
        { text: "Child 1", level: 1, children: [] },
        { text: "Child 2", level: 1, children: [] },
      ],
    },
  ];

  it("should create initial editor state", () => {
    const state = createInitialEditorState(sampleNodes);

    expect(state).toEqual({
      nodes: sampleNodes,
      mode: "navigation",
      selectedIndex: 0,
      editingIndex: -1,
      editingText: "",
    });
  });

  it("should add sibling node", () => {
    const state = createInitialEditorState(sampleNodes);
    state.selectedIndex = 1; // Child 1

    const newState = addSiblingNode(state, "New Sibling");

    expect(newState.nodes[0]!.children).toHaveLength(3);
    expect(newState.nodes[0]!.children[1]!.text).toBe("New Sibling");
    expect(newState.selectedIndex).toBe(2); // Should select the new node
  });

  it("should add child node", () => {
    const state = createInitialEditorState(sampleNodes);
    state.selectedIndex = 0; // Root

    const newState = addChildNode(state, "New Child");

    expect(newState.nodes[0]!.children).toHaveLength(3);
    expect(newState.nodes[0]!.children[2]!.text).toBe("New Child");
    expect(newState.selectedIndex).toBe(3); // Should select the new node
  });

  it("should update node text", () => {
    const state = createInitialEditorState(sampleNodes);
    state.selectedIndex = 1; // Child 1

    const newState = updateNodeText(state, 1, "Updated Child 1");

    expect(newState.nodes[0]!.children[0]!.text).toBe("Updated Child 1");
  });

  it("should handle adding sibling to root node", () => {
    const state = createInitialEditorState(sampleNodes);
    state.selectedIndex = 0; // Root

    const newState = addSiblingNode(state, "New Root");

    expect(newState.nodes).toHaveLength(2);
    expect(newState.nodes[1]!.text).toBe("New Root");
    expect(newState.selectedIndex).toBe(3); // Should select the new root node in flattened navigation
  });
});
