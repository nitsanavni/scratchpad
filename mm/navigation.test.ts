import { describe, expect, it } from "bun:test";
import { flattenNodesForNavigation } from "./navigation";
import type { MindmapNode } from "./renderer";

describe("Navigation Helper", () => {
  it("should flatten simple tree for navigation", () => {
    const nodes: MindmapNode[] = [
      { text: "Root 1", level: 0, children: [] },
      { text: "Root 2", level: 0, children: [] },
    ];

    const result = flattenNodesForNavigation(nodes);

    expect(result).toEqual([
      { node: { text: "Root 1", level: 0, children: [] }, depth: 0, path: [0] },
      { node: { text: "Root 2", level: 0, children: [] }, depth: 0, path: [1] },
    ]);
  });

  it("should flatten nested tree with proper paths", () => {
    const nodes: MindmapNode[] = [
      {
        text: "Root",
        level: 0,
        children: [
          { text: "Child 1", level: 1, children: [] },
          {
            text: "Child 2",
            level: 1,
            children: [{ text: "Grandchild", level: 2, children: [] }],
          },
        ],
      },
    ];

    const result = flattenNodesForNavigation(nodes);

    expect(result).toEqual([
      {
        node: { text: "Root", level: 0, children: expect.any(Array) },
        depth: 0,
        path: [0],
      },
      {
        node: { text: "Child 1", level: 1, children: [] },
        depth: 1,
        path: [0, 0],
      },
      {
        node: { text: "Child 2", level: 1, children: expect.any(Array) },
        depth: 1,
        path: [0, 1],
      },
      {
        node: { text: "Grandchild", level: 2, children: [] },
        depth: 2,
        path: [0, 1, 0],
      },
    ]);
  });

  it("should handle empty tree", () => {
    const result = flattenNodesForNavigation([]);
    expect(result).toEqual([]);
  });
});
