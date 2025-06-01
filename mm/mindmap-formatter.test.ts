import { describe, expect, it } from "bun:test";
import { formatMindmapVisual } from "./mindmap-formatter";
import type { MindmapNode } from "./renderer";

describe("Mindmap Visual Formatter", () => {
  it("should format single node", () => {
    const nodes: MindmapNode[] = [{ text: "Root", level: 0, children: [] }];

    const result = formatMindmapVisual(nodes);
    expect(result).toEqual([
      { text: "Root", indent: 0, hasConnection: false, isLast: true },
    ]);
  });

  it("should format node with children", () => {
    const nodes: MindmapNode[] = [
      {
        text: "Root",
        level: 0,
        children: [
          { text: "Child 1", level: 1, children: [] },
          { text: "Child 2", level: 1, children: [] },
        ],
      },
    ];

    const result = formatMindmapVisual(nodes);
    expect(result).toEqual([
      { text: "Child 1", indent: 1, hasConnection: true, isLast: false },
      { text: "Root", indent: 0, hasConnection: true, isLast: false },
      { text: "Child 2", indent: 1, hasConnection: true, isLast: true },
    ]);
  });

  it("should format deep nesting", () => {
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

    const result = formatMindmapVisual(nodes);
    expect(result).toEqual([
      { text: "Root", indent: 0, hasConnection: true, isLast: false },
      { text: "Child", indent: 1, hasConnection: true, isLast: false },
      { text: "Grandchild", indent: 2, hasConnection: true, isLast: true },
    ]);
  });

  it("should format multiple root nodes", () => {
    const nodes: MindmapNode[] = [
      { text: "Root 1", level: 0, children: [] },
      { text: "Root 2", level: 0, children: [] },
    ];

    const result = formatMindmapVisual(nodes);
    expect(result).toEqual([
      { text: "Root 1", indent: 0, hasConnection: false, isLast: false },
      { text: "Root 2", indent: 0, hasConnection: false, isLast: true },
    ]);
  });
});
