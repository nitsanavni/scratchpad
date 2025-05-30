import React, { useState, useEffect } from "react";
import { Box, Text, useApp, useInput } from "ink";
import { readMindmapFile } from "./viewer.js";
import { parseMindmapFile, renderMindmap } from "./renderer.js";
import type { MindmapNode } from "./renderer.js";
import { flattenNodesForNavigation } from "./navigation.js";
import type { NavigationNode } from "./navigation.js";
import {
  findNextSibling,
  findPrevSibling,
  findParent,
  findFirstChild,
} from "./tree-navigation.js";
import { EnhancedMindmapRenderer } from "./enhanced-mindmap-renderer.js";
import {
  createInitialEditorState,
  addSiblingNode,
  addChildNode,
  updateNodeText,
} from "./editor-state.js";
import type { EditorState } from "./editor-state.js";
import { formatToMindmap } from "./formatter.js";
import { promises as fs } from "fs";

interface AppProps {
  filepath: string;
}

export default function App({ filepath }: AppProps) {
  const [editorState, setEditorState] = useState<EditorState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { exit } = useApp();

  const autoSave = async (nodes: MindmapNode[]) => {
    try {
      const content = formatToMindmap(nodes);
      await fs.writeFile(filepath, content, "utf-8");
    } catch (err) {
      console.error("Auto-save failed:", err);
    }
  };

  useEffect(() => {
    async function loadFile() {
      try {
        const content = await readMindmapFile(filepath);
        const parsed = parseMindmapFile(content);
        const initialState = createInitialEditorState(parsed);
        setEditorState(initialState);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    }
    loadFile();
  }, [filepath]);

  // Get current state values
  const nodes = editorState?.nodes || [];
  const selectedIndex = editorState?.selectedIndex || 0;
  const mode = editorState?.mode || "navigation";
  const flatNodes = flattenNodesForNavigation(nodes);

  useInput((input, key) => {
    if (!editorState) return;

    if (input === "q" || (key.ctrl && input === "c")) {
      exit();
    }

    if (mode === "navigation") {
      if (key.upArrow) {
        setEditorState({
          ...editorState,
          selectedIndex: findPrevSibling(selectedIndex, flatNodes),
        });
      }

      if (key.downArrow) {
        setEditorState({
          ...editorState,
          selectedIndex: findNextSibling(selectedIndex, flatNodes),
        });
      }

      if (key.leftArrow) {
        setEditorState({
          ...editorState,
          selectedIndex: findParent(selectedIndex, flatNodes),
        });
      }

      if (key.rightArrow) {
        setEditorState({
          ...editorState,
          selectedIndex: findFirstChild(selectedIndex, flatNodes),
        });
      }

      if (key.return) {
        // Enter key: add sibling and enter edit mode
        const newState = addSiblingNode(editorState, "");
        setEditorState({
          ...newState,
          mode: "edit",
          editingIndex: newState.selectedIndex,
          editingText: "",
        });
        autoSave(newState.nodes);
      }

      if (key.tab) {
        // Tab key: add child and enter edit mode
        const newState = addChildNode(editorState, "");
        setEditorState({
          ...newState,
          mode: "edit",
          editingIndex: newState.selectedIndex,
          editingText: "",
        });
        autoSave(newState.nodes);
      }
    } else if (mode === "edit") {
      if (key.escape) {
        // Exit edit mode without saving
        setEditorState({
          ...editorState,
          mode: "navigation",
          editingIndex: -1,
          editingText: "",
        });
      }

      if (key.return) {
        // Save and exit edit mode
        const updatedState = updateNodeText(
          editorState,
          editorState.editingIndex,
          editorState.editingText,
        );
        setEditorState({
          ...updatedState,
          mode: "navigation",
          editingIndex: -1,
          editingText: "",
        });
        autoSave(updatedState.nodes);
      }

      if (key.tab) {
        // Tab key: save current edit, add child and continue editing
        const savedState = updateNodeText(
          editorState,
          editorState.editingIndex,
          editorState.editingText,
        );
        const newState = addChildNode(savedState, "");
        setEditorState({
          ...newState,
          mode: "edit",
          editingIndex: newState.selectedIndex,
          editingText: "",
        });
        autoSave(newState.nodes);
      }

      // Handle text input
      if (input && !key.return && !key.escape && !key.tab) {
        setEditorState({
          ...editorState,
          editingText: editorState.editingText + input,
        });
      }

      if (key.backspace || key.delete) {
        setEditorState({
          ...editorState,
          editingText: editorState.editingText.slice(0, -1),
        });
      }
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

  if (!editorState || flatNodes.length === 0) {
    return (
      <Box>
        <Text dimColor>Loading...</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      <Text bold>Mindmap Editor - {filepath}</Text>
      <Text dimColor>
        {mode === "navigation"
          ? "Use ↑/↓/←/→ to navigate, Enter to add node, 'q' to quit"
          : "Edit mode: Type to edit, Enter to save, Esc to cancel"}
      </Text>
      <Box marginTop={1}>
        <EnhancedMindmapRenderer
          nodes={nodes}
          selectedIndex={selectedIndex}
          editingIndex={editorState.editingIndex}
          editingText={editorState.editingText}
        />
      </Box>
    </Box>
  );
}
