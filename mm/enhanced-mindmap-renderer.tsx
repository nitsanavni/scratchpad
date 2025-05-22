import React from "react";
import { Box, Text } from "ink";
import { MindmapNode } from "./renderer.js";
import { createEnhancedLayout } from "./enhanced-layout.js";

interface EnhancedMindmapRendererProps {
  nodes: MindmapNode[];
  selectedIndex?: number;
}

export function EnhancedMindmapRenderer({ nodes, selectedIndex = -1 }: EnhancedMindmapRendererProps) {
  const layoutLines = createEnhancedLayout(nodes);
  
  return (
    <Box flexDirection="column">
      {layoutLines.map((line) => (
        <EnhancedLineComponent 
          key={line.lineIndex}
          line={line}
          selectedIndex={selectedIndex}
        />
      ))}
    </Box>
  );
}

interface EnhancedLineComponentProps {
  line: { nodes: Array<{ text: string; xOffset: number; nodeIndex: number }>; lineIndex: number };
  selectedIndex: number;
}

function EnhancedLineComponent({ line, selectedIndex }: EnhancedLineComponentProps) {
  // Calculate the total width needed for this line
  const maxOffset = Math.max(...line.nodes.map(node => node.xOffset + node.text.length));
  const lineContent = Array(maxOffset + 10).fill(' '); // +10 for extra space
  
  // Place each node at its correct position
  line.nodes.forEach((layoutNode, nodeIndex) => {
    const isSelected = layoutNode.nodeIndex === selectedIndex;
    const prefix = isSelected ? "> " : "- ";
    const connector = nodeIndex > 0 ? "─ " : "";
    const fullText = prefix + connector + layoutNode.text;
    
    // Calculate the actual position (subtract 2 for the prefix we already accounted for)
    const actualPosition = layoutNode.xOffset - 2;
    
    // Place the text in the line array
    for (let i = 0; i < fullText.length; i++) {
      if (actualPosition + i >= 0 && actualPosition + i < lineContent.length) {
        lineContent[actualPosition + i] = fullText[i];
      }
    }
  });
  
  // Find the last non-space character to trim the line
  let lastChar = lineContent.length - 1;
  while (lastChar >= 0 && lineContent[lastChar] === ' ') {
    lastChar--;
  }
  
  const renderedLine = lineContent.slice(0, lastChar + 1).join('');
  
  return (
    <Box>
      <Text>{renderedLine}</Text>
    </Box>
  );
}