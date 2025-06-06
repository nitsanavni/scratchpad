import { promises as fs } from "node:fs";

export async function readMindmapFile(filepath: string): Promise<string> {
  try {
    const content = await fs.readFile(filepath, "utf-8");
    return content;
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      (error as NodeJS.ErrnoException).code === "ENOENT"
    ) {
      // File doesn't exist, create it with default content
      const defaultContent = "New Mindmap\n";
      await fs.writeFile(filepath, defaultContent, "utf-8");
      return defaultContent;
    }
    throw new Error(`Failed to read file ${filepath}: ${error}`);
  }
}
