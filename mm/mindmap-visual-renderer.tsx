import React from "react";
import { Box, Text } from "ink";
import { MindmapNode } from "./renderer.js";
import { flattenNodesForNavigation } from "./navigation.js";

interface MindmapVisualRendererProps {
  nodes: MindmapNode[];
  selectedIndex?: number;
}

export function MindmapVisualRenderer({
  nodes,
  selectedIndex = -1,
}: MindmapVisualRendererProps) {
  // Use same flattening as navigation to keep indices aligned
  const flatNodes = flattenNodesForNavigation(nodes);

  return (
    <Box flexDirection="column">
      {flatNodes.map(({ node, depth }, index) => (
        <MindmapLineComponent
          key={index}
          node={node}
          depth={depth}
          isSelected={index === selectedIndex}
        />
      ))}
    </Box>
  );
}

interface MindmapLineComponentProps {
  node: MindmapNode;
  depth: number;
  isSelected: boolean;
}

function MindmapLineComponent({
  node,
  depth,
  isSelected,
}: MindmapLineComponentProps) {
  const baseIndent = "  ".repeat(depth);
  const connector = depth > 0 ? "─ " : "  ";
  const selector = isSelected ? "► " : "  ";

  return (
    <Box>
      <Text
        backgroundColor={isSelected ? "blue" : undefined}
        color={isSelected ? "white" : "gray"}
        bold={isSelected}
      >
        {selector}
        {baseIndent}
        {connector}
        {node.text}
      </Text>
    </Box>
  );
}
