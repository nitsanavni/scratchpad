import { describe, it, expect } from "bun:test";
import {
  addSiblingNode,
  addChildNode,
  updateNodeText,
  createInitialEditorState,
  moveNodeUp,
  moveNodeDown,
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

  describe("Node Movement", () => {
    const multiRootNodes: MindmapNode[] = [
      {
        text: "Root 1",
        level: 0,
        children: [
          { text: "Child 1.1", level: 1, children: [] },
          { text: "Child 1.2", level: 1, children: [] },
        ],
      },
      {
        text: "Root 2",
        level: 0,
        children: [
          { text: "Child 2.1", level: 1, children: [] },
          { text: "Child 2.2", level: 1, children: [] },
        ],
      },
      {
        text: "Root 3",
        level: 0,
        children: [],
      },
    ];

    describe("moveNodeUp", () => {
      it("should move root node up", () => {
        const state = createInitialEditorState(multiRootNodes);
        state.selectedIndex = 3; // Root 2 (index 3 in flat navigation)

        const newState = moveNodeUp(state);

        expect(newState.nodes[0]!.text).toBe("Root 2");
        expect(newState.nodes[1]!.text).toBe("Root 1");
        expect(newState.nodes[2]!.text).toBe("Root 3");
        expect(newState.selectedIndex).toBe(0); // Should follow the moved node
      });

      it("should not move first root node up", () => {
        const state = createInitialEditorState(multiRootNodes);
        state.selectedIndex = 0; // Root 1

        const newState = moveNodeUp(state);

        expect(newState.nodes[0]!.text).toBe("Root 1");
        expect(newState.selectedIndex).toBe(0);
      });

      it("should move child node up", () => {
        const state = createInitialEditorState(multiRootNodes);
        state.selectedIndex = 2; // Child 1.2

        const newState = moveNodeUp(state);

        expect(newState.nodes[0]!.children[0]!.text).toBe("Child 1.2");
        expect(newState.nodes[0]!.children[1]!.text).toBe("Child 1.1");
        expect(newState.selectedIndex).toBe(1); // Should follow the moved node
      });

      it("should not move first child up", () => {
        const state = createInitialEditorState(multiRootNodes);
        state.selectedIndex = 1; // Child 1.1

        const newState = moveNodeUp(state);

        expect(newState.nodes[0]!.children[0]!.text).toBe("Child 1.1");
        expect(newState.selectedIndex).toBe(1);
      });

      it("should preserve entire subtree when moving", () => {
        const complexNodes: MindmapNode[] = [
          {
            text: "Root",
            level: 0,
            children: [
              {
                text: "Parent 1",
                level: 1,
                children: [
                  { text: "Grandchild 1", level: 2, children: [] },
                  { text: "Grandchild 2", level: 2, children: [] },
                ],
              },
              { text: "Parent 2", level: 1, children: [] },
            ],
          },
        ];

        const state = createInitialEditorState(complexNodes);
        state.selectedIndex = 4; // Parent 2

        const newState = moveNodeUp(state);

        expect(newState.nodes[0]!.children[0]!.text).toBe("Parent 2");
        expect(newState.nodes[0]!.children[1]!.text).toBe("Parent 1");
        expect(newState.nodes[0]!.children[1]!.children).toHaveLength(2);
        expect(newState.nodes[0]!.children[1]!.children[0]!.text).toBe(
          "Grandchild 1",
        );
      });
    });

    describe("moveNodeDown", () => {
      it("should move root node down", () => {
        const state = createInitialEditorState(multiRootNodes);
        state.selectedIndex = 0; // Root 1

        const newState = moveNodeDown(state);

        expect(newState.nodes[0]!.text).toBe("Root 2");
        expect(newState.nodes[1]!.text).toBe("Root 1");
        expect(newState.nodes[2]!.text).toBe("Root 3");
        expect(newState.selectedIndex).toBe(3); // Should follow the moved node
      });

      it("should not move last root node down", () => {
        const state = createInitialEditorState(multiRootNodes);
        state.selectedIndex = 5; // Root 3 (last root in flat navigation)

        const newState = moveNodeDown(state);

        expect(newState.nodes[2]!.text).toBe("Root 3");
        expect(newState.selectedIndex).toBe(5);
      });

      it("should move child node down", () => {
        const state = createInitialEditorState(multiRootNodes);
        state.selectedIndex = 1; // Child 1.1

        const newState = moveNodeDown(state);

        expect(newState.nodes[0]!.children[0]!.text).toBe("Child 1.2");
        expect(newState.nodes[0]!.children[1]!.text).toBe("Child 1.1");
        expect(newState.selectedIndex).toBe(2); // Should follow the moved node
      });

      it("should not move last child down", () => {
        const state = createInitialEditorState(multiRootNodes);
        state.selectedIndex = 2; // Child 1.2

        const newState = moveNodeDown(state);

        expect(newState.nodes[0]!.children[1]!.text).toBe("Child 1.2");
        expect(newState.selectedIndex).toBe(2);
      });

      it("should preserve entire subtree when moving", () => {
        const complexNodes: MindmapNode[] = [
          {
            text: "Root",
            level: 0,
            children: [
              {
                text: "Parent 1",
                level: 1,
                children: [
                  { text: "Grandchild 1", level: 2, children: [] },
                  { text: "Grandchild 2", level: 2, children: [] },
                ],
              },
              { text: "Parent 2", level: 1, children: [] },
            ],
          },
        ];

        const state = createInitialEditorState(complexNodes);
        state.selectedIndex = 1; // Parent 1

        const newState = moveNodeDown(state);

        expect(newState.nodes[0]!.children[0]!.text).toBe("Parent 2");
        expect(newState.nodes[0]!.children[1]!.text).toBe("Parent 1");
        expect(newState.nodes[0]!.children[1]!.children).toHaveLength(2);
        expect(newState.nodes[0]!.children[1]!.children[0]!.text).toBe(
          "Grandchild 1",
        );
      });
    });
  });
});
