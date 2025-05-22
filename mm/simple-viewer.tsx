#!/usr/bin/env bun
import React from "react";
import { render, Box, Text } from "ink";
import { readMindmapFile } from "./viewer.js";
import { parseMindmapFile, MindmapNode } from "./renderer.js";

interface ViewerProps {
  filepath: string;
}

function SimpleViewer({ filepath }: ViewerProps) {
  const [nodes, setNodes] = React.useState<MindmapNode[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function loadFile() {
      try {
        const content = await readMindmapFile(filepath);
        const parsed = parseMindmapFile(content);
        setNodes(parsed);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    }
    loadFile();
  }, [filepath]);

  if (error) {
    return <Text color="red">Error: {error}</Text>;
  }

  if (nodes.length === 0) {
    return <Text dimColor>Loading...</Text>;
  }

  function renderNode(node: MindmapNode, depth = 0): React.ReactElement {
    const indent = "  ".repeat(depth);
    const bullet = depth === 0 ? "•" : "◦";
    
    return (
      <Box key={`${node.text}-${depth}`} flexDirection="column">
        <Text>{indent}{bullet} {node.text}</Text>
        {node.children.map(child => renderNode(child, depth + 1))}
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      <Text bold>📝 {filepath}</Text>
      <Box marginTop={1} flexDirection="column">
        {nodes.map(node => renderNode(node))}
      </Box>
    </Box>
  );
}

const filepath = process.argv[2];

if (!filepath) {
  console.error("Usage: bun simple-viewer.tsx <file.mm>");
  process.exit(1);
}

render(<SimpleViewer filepath={filepath} />);