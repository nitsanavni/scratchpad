import { describe, it, expect } from "bun:test";
import { readMindmapFile } from "./viewer";
import { promises as fs } from "fs";

describe("Mindmap File Reader", () => {
  it("should read existing .mm file", async () => {
    const content = await readMindmapFile("examples/simple.mm");
    expect(content).toContain("Personal Tasks");
    expect(content).toContain("Home");
  });

  it("should create new file for non-existent file", async () => {
    const testFile = "test-new-file.mm";
    // Ensure file doesn't exist
    try {
      await fs.unlink(testFile);
    } catch {}

    const content = await readMindmapFile(testFile);
    expect(content).toBe("New Mindmap\n");

    // Verify file was created
    const fileContent = await fs.readFile(testFile, "utf-8");
    expect(fileContent).toBe("New Mindmap\n");

    // Clean up
    await fs.unlink(testFile);
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
