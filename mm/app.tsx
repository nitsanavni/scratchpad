import React, { useState, useEffect } from "react";
import { Box, Text, useApp, useInput } from "ink";
import { readMindmapFile } from "./viewer.js";
import { parseMindmapFile, renderMindmap, MindmapNode } from "./renderer.js";
import { flattenNodesForNavigation, NavigationNode } from "./navigation.js";
import { findNextSibling, findPrevSibling, findParent, findFirstChild } from "./tree-navigation.js";
import { HorizontalMindmapRenderer } from "./horizontal-mindmap-renderer.js";

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
  const flatNodes = flattenNodesForNavigation(nodes);

  useInput((input, key) => {
    if (input === "q" || (key.ctrl && input === "c")) {
      exit();
    }
    
    if (key.upArrow) {
      setSelectedIndex(findPrevSibling(selectedIndex, flatNodes));
    }
    
    if (key.downArrow) {
      setSelectedIndex(findNextSibling(selectedIndex, flatNodes));
    }
    
    if (key.leftArrow) {
      setSelectedIndex(findParent(selectedIndex, flatNodes));
    }
    
    if (key.rightArrow) {
      setSelectedIndex(findFirstChild(selectedIndex, flatNodes));
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
      <Text dimColor>Use ↑/↓/←/→ to navigate, 'q' to quit</Text>
      <Box marginTop={1}>
        <HorizontalMindmapRenderer nodes={nodes} selectedIndex={selectedIndex} />
      </Box>
    </Box>
  );
}