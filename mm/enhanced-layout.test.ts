import { describe, it, expect } from "bun:test";
import { createEnhancedLayout } from "./enhanced-layout";
import type { EnhancedLayoutLine } from "./enhanced-layout";
import type { MindmapNode } from "./renderer";

describe("Enhanced Layout", () => {
  it("should layout single node with dash prefix", () => {
    const nodes: MindmapNode[] = [{ text: "Root", level: 0, children: [] }];

    const result = createEnhancedLayout(nodes);
    expect(result).toEqual([
      {
        nodes: [{ text: "Root", xOffset: 2, nodeIndex: 0 }], // "- " prefix = 2 chars
        lineIndex: 0,
      },
    ]);
  });

  it("should layout parent with single child on same line", () => {
    const nodes: MindmapNode[] = [
      {
        text: "Root",
        level: 0,
        children: [{ text: "Child", level: 1, children: [] }],
      },
    ];

    const result = createEnhancedLayout(nodes);
    expect(result).toEqual([
      {
        nodes: [
          { text: "Root", xOffset: 2, nodeIndex: 0 }, // "- "
          { text: "Child", xOffset: 9, nodeIndex: 1 }, // 2 + "Root " + "- " = 2 + 4 + 1 + 2 = 9
        ],
        lineIndex: 0,
      },
    ]);
  });

  it("should center parent vertically among multiple children", () => {
    const nodes: MindmapNode[] = [
      {
        text: "Root",
        level: 0,
        children: [
          { text: "Child1", level: 1, children: [] },
          { text: "Child2", level: 1, children: [] },
          { text: "Child3", level: 1, children: [] },
        ],
      },
    ];

    const result = createEnhancedLayout(nodes);
    expect(result).toEqual([
      {
        nodes: [{ text: "Child1", xOffset: 9, nodeIndex: 1 }],
        lineIndex: 0,
      },
      {
        nodes: [
          { text: "Root", xOffset: 2, nodeIndex: 0 },
          { text: "Child2", xOffset: 9, nodeIndex: 2 },
        ],
        lineIndex: 1, // Parent on middle line
      },
      {
        nodes: [{ text: "Child3", xOffset: 9, nodeIndex: 3 }],
        lineIndex: 2,
      },
    ]);
  });

  it("should handle deep nesting with proper positioning", () => {
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

    const result = createEnhancedLayout(nodes);
    expect(result).toEqual([
      {
        nodes: [
          { text: "Root", xOffset: 2, nodeIndex: 0 },
          { text: "Child", xOffset: 9, nodeIndex: 1 },
          { text: "Grandchild", xOffset: 17, nodeIndex: 2 }, // 9 + "Child " + "- " = 9 + 5 + 1 + 2 = 17
        ],
        lineIndex: 0,
      },
    ]);
  });
});
