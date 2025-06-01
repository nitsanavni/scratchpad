import { describe, expect, it } from "bun:test";
import { formatToMindmap } from "./formatter";
import { parseMindmapFile } from "./renderer";

describe("Roundtrip Tests", () => {
  it("should preserve simple flat structure", () => {
    const original = "Node 1\nNode 2\nNode 3";
    const parsed = parseMindmapFile(original);
    const formatted = formatToMindmap(parsed);
    expect(formatted).toBe(original);
  });

  it("should preserve nested structure", () => {
    const original = "Root\n  Child 1\n  Child 2\n    Grandchild";
    const parsed = parseMindmapFile(original);
    const formatted = formatToMindmap(parsed);
    expect(formatted).toBe(original);
  });

  it("should preserve deep nesting", () => {
    const original =
      "Root\n  Level 1\n    Level 2\n      Level 3\n        Level 4";
    const parsed = parseMindmapFile(original);
    const formatted = formatToMindmap(parsed);
    expect(formatted).toBe(original);
  });

  it("should preserve multiple root nodes", () => {
    const original = "Root 1\n  Child 1a\n  Child 1b\nRoot 2\n  Child 2a";
    const parsed = parseMindmapFile(original);
    const formatted = formatToMindmap(parsed);
    expect(formatted).toBe(original);
  });

  it("should preserve irregular indentation", () => {
    const original = "Root\n      Deep child\n  Shallow child";
    const parsed = parseMindmapFile(original);
    const formatted = formatToMindmap(parsed);
    expect(formatted).toBe(original);
  });

  it("should handle empty content", () => {
    const original = "";
    const parsed = parseMindmapFile(original);
    const formatted = formatToMindmap(parsed);
    expect(formatted).toBe(original);
  });

  it("should handle complex mixed structure", () => {
    const original =
      "Project\n  Frontend\n    React\n      Components\n        Header\n        Footer\n    Styling\n      CSS\n      Tailwind\n  Backend\n    API\n      REST\n      GraphQL\n    Database\n      PostgreSQL\nDocumentation\n  README\n  API Docs";
    const parsed = parseMindmapFile(original);
    const formatted = formatToMindmap(parsed);
    expect(formatted).toBe(original);
  });
});
