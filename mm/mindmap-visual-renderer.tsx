import React from "react";
import { Box, Text } from "ink";
import { formatMindmapVisual, MindmapLine } from "./mindmap-formatter.js";
import { MindmapNode } from "./renderer.js";

interface MindmapVisualRendererProps {
  nodes: MindmapNode[];
  selectedIndex?: number;
}

export function MindmapVisualRenderer({ nodes, selectedIndex = -1 }: MindmapVisualRendererProps) {
  const lines = formatMindmapVisual(nodes);
  
  return (
    <Box flexDirection="column">
      {lines.map((line, index) => (
        <MindmapLineComponent 
          key={index} 
          line={line} 
          isSelected={index === selectedIndex}
        />
      ))}
    </Box>
  );
}

interface MindmapLineComponentProps {
  line: MindmapLine;
  isSelected: boolean;
}

function MindmapLineComponent({ line, isSelected }: MindmapLineComponentProps) {
  const baseIndent = "  ".repeat(line.indent);
  const connector = line.hasConnection ? "─ " : "  ";
  const selector = isSelected ? "► " : "  ";
  
  return (
    <Box>
      <Text 
        backgroundColor={isSelected ? "blue" : undefined}
        color={isSelected ? "white" : "gray"}
        bold={isSelected}
      >
        {selector}{baseIndent}{connector}{line.text}
      </Text>
    </Box>
  );
}