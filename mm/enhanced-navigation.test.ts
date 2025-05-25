import { describe, it, expect } from "bun:test";
import {
  findParentIndex,
  findFirstChildIndex,
  addSiblingNode,
  addChildNode,
  findRootIndex,
} from "./enhanced-navigation";
import { flattenNodesForNavigation } from "./navigation";
import type { MindmapNode } from "./renderer";

describe("Enhanced Navigation", () => {
  const sampleNodes: MindmapNode[] = [
    {
      text: "Root 1",
      level: 0,
      children: [
        { text: "Child 1.1", level: 1, children: [] },
        {
          text: "Child 1.2",
          level: 1,
          children: [{ text: "Grandchild 1.2.1", level: 2, children: [] }],
        },
      ],
    },
    { text: "Root 2", level: 0, children: [] },
  ];

  it("should find parent index correctly", () => {
    const flatNodes = flattenNodesForNavigation(sampleNodes);

    // Child 1.1 (index 1) should go to Root 1 (index 0)
    expect(findParentIndex(1, flatNodes)).toBe(0);

    // Grandchild 1.2.1 (index 3) should go to Child 1.2 (index 2)
    expect(findParentIndex(3, flatNodes)).toBe(2);

    // Root nodes should stay at same position
    expect(findParentIndex(0, flatNodes)).toBe(0);
    expect(findParentIndex(4, flatNodes)).toBe(4);
  });

  it("should find first child index correctly", () => {
    const flatNodes = flattenNodesForNavigation(sampleNodes);

    // Root 1 (index 0) should go to Child 1.1 (index 1)
    expect(findFirstChildIndex(0, flatNodes)).toBe(1);

    // Child 1.2 (index 2) should go to Grandchild 1.2.1 (index 3)
    expect(findFirstChildIndex(2, flatNodes)).toBe(3);

    // Leaf nodes should stay at same position
    expect(findFirstChildIndex(1, flatNodes)).toBe(1);
    expect(findFirstChildIndex(4, flatNodes)).toBe(4);
  });

  it("should find root index correctly", () => {
    const flatNodes = flattenNodesForNavigation(sampleNodes);

    // Any node in first tree should go to Root 1 (index 0)
    expect(findRootIndex(0, flatNodes)).toBe(0);
    expect(findRootIndex(1, flatNodes)).toBe(0);
    expect(findRootIndex(2, flatNodes)).toBe(0);
    expect(findRootIndex(3, flatNodes)).toBe(0);

    // Root 2 and descendants should go to Root 2 (index 4)
    expect(findRootIndex(4, flatNodes)).toBe(4);
  });
});
