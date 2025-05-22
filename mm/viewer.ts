import { promises as fs } from "fs";

export async function readMindmapFile(filepath: string): Promise<string> {
  try {
    const content = await fs.readFile(filepath, "utf-8");
    return content;
  } catch (error) {
    throw new Error(`Failed to read file ${filepath}: ${error}`);
  }
}
