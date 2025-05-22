import { describe, it, expect } from "bun:test";
import { createHorizontalLayout, LayoutLine } from "./horizontal-layout";
import { MindmapNode } from "./renderer";

describe("Horizontal Layout", () => {
  it("should layout single node", () => {
    const nodes: MindmapNode[] = [{ text: "Root", level: 0, children: [] }];

    const result = createHorizontalLayout(nodes);
    expect(result).toEqual([
      {
        nodes: [{ text: "Root", xOffset: 0 }],
        isMainLine: true,
      },
    ]);
  });

  it("should layout parent with single child horizontally", () => {
    const nodes: MindmapNode[] = [
      {
        text: "Root",
        level: 0,
        children: [{ text: "Child", level: 1, children: [] }],
      },
    ];

    const result = createHorizontalLayout(nodes);
    expect(result).toEqual([
      {
        nodes: [
          { text: "Root", xOffset: 0 },
          { text: "Child", xOffset: 5 }, // "Root" = 4 chars + 1 space = 5
        ],
        isMainLine: true,
      },
    ]);
  });

  it("should layout parent with multiple children vertically distributed", () => {
    const nodes: MindmapNode[] = [
      {
        text: "Root",
        level: 0,
        children: [
          { text: "Child1", level: 1, children: [] },
          { text: "Child2", level: 1, children: [] },
        ],
      },
    ];

    const result = createHorizontalLayout(nodes);
    expect(result).toEqual([
      {
        nodes: [{ text: "Child1", xOffset: 5 }],
        isMainLine: false,
      },
      {
        nodes: [
          { text: "Root", xOffset: 0 },
          { text: "Child2", xOffset: 5 },
        ],
        isMainLine: true,
      },
    ]);
  });

  it("should handle deep nesting", () => {
    const nodes: MindmapNode[] = [
      {
        text: "Root",
        level: 0,
        children: [
          {
            text: "Child",
            level: 1,
            children: [{ text: "Grandchild", level: 2, children: [] }],
          },
        ],
      },
    ];

    const result = createHorizontalLayout(nodes);
    expect(result).toEqual([
      {
        nodes: [
          { text: "Root", xOffset: 0 },
          { text: "Child", xOffset: 5 },
          { text: "Grandchild", xOffset: 11 }, // 5 + "Child" = 5 + 5 + 1
        ],
        isMainLine: true,
      },
    ]);
  });
});
