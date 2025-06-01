import { describe, expect, it } from "bun:test";
import { formatToMindmap } from "./formatter";
import type { MindmapNode } from "./renderer";

describe("Mindmap Formatter", () => {
  it("should format simple flat list", () => {
    const nodes: MindmapNode[] = [
      { text: "Node 1", level: 0, children: [] },
      { text: "Node 2", level: 0, children: [] },
      { text: "Node 3", level: 0, children: [] },
    ];
    const result = formatToMindmap(nodes);
    expect(result).toBe("Node 1\nNode 2\nNode 3");
  });

  it("should format nested structure with double spaces", () => {
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
    const result = formatToMindmap(nodes);
    expect(result).toBe("Root\n  Child 1\n  Child 2\n    Grandchild");
  });

  it("should format empty list", () => {
    const result = formatToMindmap([]);
    expect(result).toBe("");
  });

  it("should format deep nesting", () => {
    const nodes: MindmapNode[] = [
      {
        text: "Root",
        level: 0,
        children: [
          {
            text: "Level 1",
            level: 1,
            children: [
              {
                text: "Level 2",
                level: 2,
                children: [
                  {
                    text: "Level 3",
                    level: 3,
                    children: [{ text: "Level 4", level: 4, children: [] }],
                  },
                ],
              },
            ],
          },
        ],
      },
    ];
    const result = formatToMindmap(nodes);
    expect(result).toBe(
      "Root\n  Level 1\n    Level 2\n      Level 3\n        Level 4",
    );
  });

  it("should format multiple root nodes with children", () => {
    const nodes: MindmapNode[] = [
      {
        text: "Root 1",
        level: 0,
        children: [
          { text: "Child 1a", level: 1, children: [] },
          { text: "Child 1b", level: 1, children: [] },
        ],
      },
      {
        text: "Root 2",
        level: 0,
        children: [{ text: "Child 2a", level: 1, children: [] }],
      },
    ];
    const result = formatToMindmap(nodes);
    expect(result).toBe("Root 1\n  Child 1a\n  Child 1b\nRoot 2\n  Child 2a");
  });

  it("should handle irregular nesting levels", () => {
    const nodes: MindmapNode[] = [
      {
        text: "Root",
        level: 0,
        children: [
          { text: "Deep child", level: 3, children: [] },
          { text: "Shallow child", level: 1, children: [] },
        ],
      },
    ];
    const result = formatToMindmap(nodes);
    expect(result).toBe("Root\n      Deep child\n  Shallow child");
  });

  it("should format empty text nodes as dash", () => {
    const nodes: MindmapNode[] = [
      {
        text: "Root",
        level: 0,
        children: [
          {
            text: "",
            level: 1,
            children: [],
          },
          {
            text: "Child 2",
            level: 1,
            children: [],
          },
        ],
      },
    ];

    const formatted = formatToMindmap(nodes);
    expect(formatted).toBe("Root\n  -\n  Child 2");
  });
});
