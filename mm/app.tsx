import React, { useState, useEffect } from "react";
import { Box, Text, useApp, useInput } from "ink";
import { readMindmapFile } from "./viewer.js";
import { parseMindmapFile, renderMindmap, MindmapNode } from "./renderer.js";

interface AppProps {
  filepath: string;
}

export default function App({ filepath }: AppProps) {
  const [nodes, setNodes] = useState<MindmapNode[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { exit } = useApp();

  useEffect(() => {
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

  // Flatten nodes for navigation
  const flatNodes: { node: MindmapNode; depth: number }[] = [];
  
  function flattenNodes(nodeList: MindmapNode[], depth = 0) {
    for (const node of nodeList) {
      flatNodes.push({ node, depth });
      flattenNodes(node.children, depth + 1);
    }
  }
  
  flattenNodes(nodes);

  useInput((input, key) => {
    if (input === "q" || (key.ctrl && input === "c")) {
      exit();
    }
    
    if (key.upArrow && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
    
    if (key.downArrow && selectedIndex < flatNodes.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  });

  if (error) {
    return (
      <Box flexDirection="column">
        <Text color="red">Error: {error}</Text>
        <Text dimColor>Press 'q' to quit</Text>
      </Box>
    );
  }

  if (flatNodes.length === 0) {
    return (
      <Box>
        <Text dimColor>Loading...</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      <Text bold>Mindmap Viewer - {filepath}</Text>
      <Text dimColor>Use ↑/↓ to navigate, 'q' to quit</Text>
      <Box marginTop={1} flexDirection="column">
        {flatNodes.map(({ node, depth }, index) => {
          const indent = "  ".repeat(depth);
          const bullet = depth === 0 ? "•" : "◦";
          const isSelected = index === selectedIndex;
          
          return (
            <Box key={index}>
              <Text 
                backgroundColor={isSelected ? "blue" : undefined}
                color={isSelected ? "white" : undefined}
              >
                {indent}{bullet} {node.text}
              </Text>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}