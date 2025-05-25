import React from "react";
import { Box, Text } from "ink";
import { MindmapNode } from "./renderer.js";
import { createHorizontalLayout, LayoutLine } from "./horizontal-layout.js";
import { flattenNodesForNavigation } from "./navigation.js";

interface HorizontalMindmapRendererProps {
  nodes: MindmapNode[];
  selectedIndex?: number;
}

export function HorizontalMindmapRenderer({
  nodes,
  selectedIndex = -1,
}: HorizontalMindmapRendererProps) {
  const layoutLines = createHorizontalLayout(nodes);
  const flatNodes = flattenNodesForNavigation(nodes);

  // Create a mapping from node text to flat index for selection highlighting
  const nodeTextToIndex = new Map<string, number>();
  flatNodes.forEach((flatNode, index) => {
    nodeTextToIndex.set(flatNode.node.text, index);
  });

  return (
    <Box flexDirection="column">
      {layoutLines.map((line, lineIndex) => (
        <HorizontalLineComponent
          key={lineIndex}
          line={line}
          selectedIndex={selectedIndex}
          nodeTextToIndex={nodeTextToIndex}
        />
      ))}
    </Box>
  );
}

interface HorizontalLineComponentProps {
  line: LayoutLine;
  selectedIndex: number;
  nodeTextToIndex: Map<string, number>;
}

function HorizontalLineComponent({
  line,
  selectedIndex,
  nodeTextToIndex,
}: HorizontalLineComponentProps) {
  // Calculate the total width needed for this line
  const maxOffset = Math.max(
    ...line.nodes.map((node) => node.xOffset + node.text.length),
  );
  const lineContent = Array(maxOffset).fill(" ");

  // Place each node at its correct position
  line.nodes.forEach((layoutNode, nodeIndex) => {
    const isSelected = nodeTextToIndex.get(layoutNode.text) === selectedIndex;
    const prefix = isSelected ? "► " : "";
    const connector = nodeIndex > 0 ? "─ " : "";
    const fullText = prefix + connector + layoutNode.text;

    // Place the text in the line array
    for (let i = 0; i < fullText.length; i++) {
      if (layoutNode.xOffset + i < lineContent.length) {
        lineContent[layoutNode.xOffset + i] = fullText[i];
      }
    }
  });

  const renderedLine = lineContent.join("");

  return (
    <Box>
      <Text>{renderedLine}</Text>
    </Box>
  );
}
