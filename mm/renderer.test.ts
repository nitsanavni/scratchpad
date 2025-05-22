import { describe, it, expect } from "bun:test";
import { renderMindmap, parseMindmapFile } from "./renderer";

describe("Mindmap Parser", () => {
  it("should parse simple flat list", () => {
    const input = "Node 1\nNode 2\nNode 3";
    const result = parseMindmapFile(input);
    expect(result).toEqual([
      { text: "Node 1", level: 0, children: [] },
      { text: "Node 2", level: 0, children: [] },
      { text: "Node 3", level: 0, children: [] }
    ]);
  });

  it("should parse nested structure with double spaces", () => {
    const input = "Root\n  Child 1\n  Child 2\n    Grandchild";
    const result = parseMindmapFile(input);
    expect(result).toEqual([
      { 
        text: "Root", 
        level: 0, 
        children: [
          { text: "Child 1", level: 1, children: [] },
          { 
            text: "Child 2", 
            level: 1, 
            children: [
              { text: "Grandchild", level: 2, children: [] }
            ]
          }
        ]
      }
    ]);
  });
});

describe("Mindmap Parser", () => {
  it("should handle empty input", () => {
    const result = parseMindmapFile("");
    expect(result).toEqual([]);
  });

  it("should handle blank lines", () => {
    const input = "Node 1\n\nNode 2\n  \n  Child";
    const result = parseMindmapFile(input);
    expect(result).toEqual([
      { text: "Node 1", level: 0, children: [] },
      { 
        text: "Node 2", 
        level: 0, 
        children: [
          { text: "Child", level: 1, children: [] }
        ]
      }
    ]);
  });

  it("should handle deep nesting", () => {
    const input = "Root\n  Level 1\n    Level 2\n      Level 3\n        Level 4";
    const result = parseMindmapFile(input);
    expect(result).toEqual([
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
                    children: [
                      { text: "Level 4", level: 4, children: [] }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]);
  });

  it("should handle multiple root nodes with children", () => {
    const input = "Root 1\n  Child 1a\n  Child 1b\nRoot 2\n  Child 2a";
    const result = parseMindmapFile(input);
    expect(result).toEqual([
      { 
        text: "Root 1", 
        level: 0, 
        children: [
          { text: "Child 1a", level: 1, children: [] },
          { text: "Child 1b", level: 1, children: [] }
        ]
      },
      { 
        text: "Root 2", 
        level: 0, 
        children: [
          { text: "Child 2a", level: 1, children: [] }
        ]
      }
    ]);
  });

  it("should handle irregular indentation jumps", () => {
    const input = "Root\n      Deep child\n  Shallow child";
    const result = parseMindmapFile(input);
    expect(result).toEqual([
      { 
        text: "Root", 
        level: 0, 
        children: [
          { text: "Deep child", level: 3, children: [] },
          { text: "Shallow child", level: 1, children: [] }
        ]
      }
    ]);
  });
});

describe("Mindmap Renderer", () => {
  it("should render empty list", () => {
    const result = renderMindmap([]);
    expect(result).toBe("");
  });

  it("should render simple flat list", () => {
    const nodes = [
      { text: "Node 1", level: 0, children: [] },
      { text: "Node 2", level: 0, children: [] }
    ];
    const result = renderMindmap(nodes);
    expect(result).toBe("• Node 1\n• Node 2");
  });

  it("should render nested structure with proper indentation", () => {
    const nodes = [
      { 
        text: "Root", 
        level: 0, 
        children: [
          { text: "Child 1", level: 1, children: [] },
          { text: "Child 2", level: 1, children: [] }
        ]
      }
    ];
    const result = renderMindmap(nodes);
    expect(result).toBe("• Root\n  ◦ Child 1\n  ◦ Child 2");
  });

  it("should render deep nesting with different bullets", () => {
    const nodes = [
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
                  { text: "Level 3", level: 3, children: [] }
                ]
              }
            ]
          }
        ]
      }
    ];
    const result = renderMindmap(nodes);
    expect(result).toBe("• Root\n  ◦ Level 1\n    ◦ Level 2\n      ◦ Level 3");
  });

  it("should render multiple root nodes", () => {
    const nodes = [
      { 
        text: "Root 1", 
        level: 0, 
        children: [
          { text: "Child 1", level: 1, children: [] }
        ]
      },
      { 
        text: "Root 2", 
        level: 0, 
        children: [
          { text: "Child 2", level: 1, children: [] }
        ]
      }
    ];
    const result = renderMindmap(nodes);
    expect(result).toBe("• Root 1\n  ◦ Child 1\n• Root 2\n  ◦ Child 2");
  });
});