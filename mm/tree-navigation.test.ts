import { describe, expect, it } from "bun:test";
import { flattenNodesForNavigation } from "./navigation";
import type { MindmapNode } from "./renderer";
import {
  findFirstChild,
  findNextSibling,
  findParent,
  findPrevSibling,
} from "./tree-navigation";

describe("Tree Navigation", () => {
  const sampleNodes: MindmapNode[] = [
    {
      text: "Root 1",
      level: 0,
      children: [
        { text: "Child 1.1", level: 1, children: [] },
        {
          text: "Child 1.2",
          level: 1,
          children: [
            { text: "Grandchild 1.2.1", level: 2, children: [] },
            { text: "Grandchild 1.2.2", level: 2, children: [] },
          ],
        },
        { text: "Child 1.3", level: 1, children: [] },
      ],
    },
    {
      text: "Root 2",
      level: 0,
      children: [{ text: "Child 2.1", level: 1, children: [] }],
    },
  ];

  const flatNodes = flattenNodesForNavigation(sampleNodes);

  describe("Sibling Navigation (Up/Down)", () => {
    it("should find next sibling", () => {
      // Child 1.1 (index 1) -> Child 1.2 (index 2)
      expect(findNextSibling(1, flatNodes)).toBe(2);

      // Child 1.2 (index 2) -> Child 1.3 (index 5)
      expect(findNextSibling(2, flatNodes)).toBe(5);

      // Root 1 (index 0) -> Root 2 (index 6)
      expect(findNextSibling(0, flatNodes)).toBe(6);
    });

    it("should find previous sibling", () => {
      // Child 1.2 (index 2) -> Child 1.1 (index 1)
      expect(findPrevSibling(2, flatNodes)).toBe(1);

      // Child 1.3 (index 5) -> Child 1.2 (index 2)
      expect(findPrevSibling(5, flatNodes)).toBe(2);

      // Root 2 (index 6) -> Root 1 (index 0)
      expect(findPrevSibling(6, flatNodes)).toBe(0);
    });

    it("should stay at same position when no siblings", () => {
      // Grandchild 1.2.1 (index 3) has sibling -> Grandchild 1.2.2 (index 4)
      expect(findNextSibling(3, flatNodes)).toBe(4);

      // Grandchild 1.2.2 (index 4) -> Grandchild 1.2.1 (index 3)
      expect(findPrevSibling(4, flatNodes)).toBe(3);

      // Child 2.1 (index 7) has no siblings
      expect(findNextSibling(7, flatNodes)).toBe(7);
      expect(findPrevSibling(7, flatNodes)).toBe(7);
    });
  });

  describe("Hierarchy Navigation (Left/Right)", () => {
    it("should find parent (left arrow)", () => {
      // Child 1.1 (index 1) -> Root 1 (index 0)
      expect(findParent(1, flatNodes)).toBe(0);

      // Grandchild 1.2.1 (index 3) -> Child 1.2 (index 2)
      expect(findParent(3, flatNodes)).toBe(2);

      // Root nodes stay at same position
      expect(findParent(0, flatNodes)).toBe(0);
    });

    it("should find first child (right arrow)", () => {
      // Root 1 (index 0) -> Child 1.1 (index 1)
      expect(findFirstChild(0, flatNodes)).toBe(1);

      // Child 1.2 (index 2) -> Grandchild 1.2.1 (index 3)
      expect(findFirstChild(2, flatNodes)).toBe(3);

      // Leaf nodes stay at same position
      expect(findFirstChild(1, flatNodes)).toBe(1);
      expect(findFirstChild(3, flatNodes)).toBe(3);
    });
  });
});
