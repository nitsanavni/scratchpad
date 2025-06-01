import { promises as fs } from "node:fs";
import { Box, Text, useApp, useInput } from "ink";
import React from "react";
import { useEffect, useState } from "react";
import {
  addChildNode,
  addSiblingNode,
  createInitialEditorState,
  moveNodeDown,
  moveNodeLeft,
  moveNodeRight,
  moveNodeUp,
  updateNodeText,
} from "./editor-state.js";
import type { EditorState } from "./editor-state.js";
import { EnhancedMindmapRenderer } from "./enhanced-mindmap-renderer.js";
import { formatToMindmap } from "./formatter.js";
import { flattenNodesForNavigation } from "./navigation.js";
import { parseMindmapFile } from "./renderer.js";
import type { MindmapNode } from "./renderer.js";
import {
  findFirstChild,
  findNextSibling,
  findParent,
  findPrevSibling,
} from "./tree-navigation.js";
import { readMindmapFile } from "./viewer.js";

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
        if (key.shift) {
          // Shift+Up: Move node up before previous sibling
          const newState = moveNodeUp(editorState);
          setEditorState(newState);
          autoSave(newState.nodes);
        } else {
          setEditorState({
            ...editorState,
            selectedIndex: findPrevSibling(selectedIndex, flatNodes),
          });
        }
      }

      if (key.downArrow) {
        if (key.shift) {
          // Shift+Down: Move node down after next sibling
          const newState = moveNodeDown(editorState);
          setEditorState(newState);
          autoSave(newState.nodes);
        } else {
          setEditorState({
            ...editorState,
            selectedIndex: findNextSibling(selectedIndex, flatNodes),
          });
        }
      }

      if (key.leftArrow) {
        if (key.shift) {
          // Shift+Left: Move node as next sibling of parent
          const newState = moveNodeLeft(editorState);
          setEditorState(newState);
          autoSave(newState.nodes);
        } else {
          setEditorState({
            ...editorState,
            selectedIndex: findParent(selectedIndex, flatNodes),
          });
        }
      }

      if (key.rightArrow) {
        if (key.shift) {
          // Shift+Right: Move node as child of previous sibling
          const newState = moveNodeRight(editorState);
          setEditorState(newState);
          autoSave(newState.nodes);
        } else {
          setEditorState({
            ...editorState,
            selectedIndex: findFirstChild(selectedIndex, flatNodes),
          });
        }
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
