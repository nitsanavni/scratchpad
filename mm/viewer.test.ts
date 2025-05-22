import { describe, it, expect } from "bun:test";
import { readMindmapFile } from "./viewer";
import { promises as fs } from "fs";

describe("Mindmap File Reader", () => {
  it("should read existing .mm file", async () => {
    const content = await readMindmapFile("examples/simple.mm");
    expect(content).toContain("Personal Tasks");
    expect(content).toContain("Work");
    expect(content).toContain("Home");
  });

  it("should throw error for non-existent file", async () => {
    expect(async () => {
      await readMindmapFile("non-existent.mm");
    }).toThrow();
  });

  it("should handle empty file", async () => {
    // Create temporary empty file
    await fs.writeFile("test-empty.mm", "");
    const content = await readMindmapFile("test-empty.mm");
    expect(content).toBe("");
    // Clean up
    await fs.unlink("test-empty.mm");
  });
});
