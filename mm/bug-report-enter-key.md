# Bug Report: Enter Key Replaces Node Instead of Adding Sibling

## Issue Description

When pressing Enter in navigation mode to add a sibling node, the existing node gets replaced/removed instead of a new sibling being added alongside it.

## Expected Behavior

1. Navigate to "Child 1" node
2. Press Enter to add sibling
3. Type "New Child Node" and press Enter to save
4. Result should be:
   ```
   Root Node
     Child 1
     New Child Node
     Child 2
   ```

## Actual Behavior

1. Navigate to "Child 1" node
2. Press Enter to add sibling
3. Type "New Child Node" and press Enter to save
4. Result is:
   ```
   Root Node
     New Child Node
     Child 2
   ```

**Problem**: "Child 1" disappeared entirely.

## Test Case

**Original file** (`test-autosave.mm`):

```
Root Node
  Child 1
  Child 2
```

**After Enter key interaction**:

```
Root Node
  New Child Node
  Child 2
```

## Root Cause Analysis Needed

The issue likely exists in one of these areas:

1. **`addSiblingNode` function** (`editor-state.ts:22-78`) - May be incorrectly calculating insertion index
2. **Edit mode flow** (`app.tsx:97-107`) - The transition from adding sibling to edit mode may be targeting wrong node
3. **Navigation index handling** - Selected index may be pointing to wrong node after sibling addition

## Steps to Reproduce

1. Open any `.mm` file with multiple children under a parent
2. Navigate to any child node (not the last one)
3. Press Enter to add sibling
4. Type any text and press Enter to save
5. Observe that the original node is gone

## Priority

**Medium** - Affects core editing functionality but doesn't crash the application.

## Files Involved

- `app.tsx` (lines 97-107: Enter key handling)
- `editor-state.ts` (lines 22-78: addSiblingNode function)
- Auto-save functionality (working correctly, saves the incorrect state)
