# Jirai API Documentation

## 🏪 Store API (Zustand)

The application state is managed via `src/store.ts`.

### State Properties

| Property | Type | Description |
|----------|------|-------------|
| `nodes` | `BaseNode[]` | Array of all nodes in the graph. |
| `edges` | `BaseEdge[]` | Array of all connections between nodes. |
| `viewMode` | `ViewMode` | Current view (`analysis`, `management`, `workflow`). |
| `selectedNodeIds` | `string[]` | IDs of currently selected nodes. |
| `editingNodeId` | `string \| null` | ID of the node currently being edited. |
| `calendarView` | `CalendarView` | Sub-view state (`WEEK`, `MONTH`). |

### Actions

#### Node Management
```typescript
// Add a new node to the graph
addNode(node: BaseNode): void

// Update specific properties of a node
updateNode(id: string, updates: Partial<BaseNode>): void

// Delete currently selected nodes and their connected edges
deleteSelectedNodes(): void

// Duplicate selected nodes (offsets position slightly)
duplicateSelectedNodes(): void
```

#### Edge Management
```typescript
// Add a connection
addEdge(edge: BaseEdge): void

// React Flow change handler
onEdgesChange(changes: EdgeChange[]): void
```

#### Selection
```typescript
// Select a node (pass multi=true to append to selection)
selectNode(id: string, multi?: boolean): void

// Select all nodes
selectAll(): void

// Clear current selection
clearSelection(): void
```

#### History
```typescript
// Revert last action
undo(): void

// Re-apply reverted action
redo(): void
```

#### View Operations
```typescript
// Switch logic mode (triggers layout recalculation)
setViewMode(mode: ViewMode): void

// Set calendar specific view
setCalendarView(view: CalendarView): void

// Trigger auto-layout based on current mode
autoLayout(): void
```

---

## 🧩 Component Props

### GraphEngine
`src/components/GraphEngine.tsx`
The main canvas renderer.

```typescript
interface GraphEngineProps {
  viewMode: 'analysis' | 'management' | 'workflow';
}
```

### CustomNode
`src/components/nodes/CustomNode.tsx`
The unified node renderer that adapts to view modes.

```typescript
interface NodeProps<BaseNode> {
  id: string;
  data: BaseNode;
  selected: boolean;
  // ... standard React Flow props
}
```

### NodeDetailsPanel
`src/components/NodeDetailsPanel.tsx`
The side panel for editing node properties.

```typescript
interface NodeDetailsProps {
  node: BaseNode | null; // Node to edit
  onClose: () => void;
  onUpdateNode: (id: string, data: Partial<BaseNode>) => void;
}
```

---

## 🪝 Hooks API

### useSearch
`src/hooks/useSearch.ts`
Provides filtering logic for the node graph.

```typescript
const {
  query,          // Current search string
  setQuery,       // Update search string
  statusFilter,   // 'all' | 'todo' | 'done'...
  typeFilter,     // 'all' | 'task' | 'video'...
  results,        // Filtered array of BaseNode[]
  focusResult     // Helper to select and focus a node
} = useSearch();
```

### useKeyboardShortcuts
`src/hooks/useKeyboardShortcuts.ts`
Manages global hotkeys.

```typescript
const { 
  isHelpOpen,     // State of the shortcut help modal
  toggleHelp      // Toggle function
} = useKeyboardShortcuts();
```

---

## 🛠️ Utility Functions

### Export/Import
`src/utils/export.ts` & `src/utils/import.ts`

```typescript
// Export workspace to a JSON file download
exportToJSON(nodes: BaseNode[], edges: BaseEdge[], selectedIds?: string[]): void

// Render canvas to PNG blob and download
exportToPNG(element: HTMLElement, filename?: string): Promise<void>

// Generate Markdown outline from graph structure
exportToMarkdown(nodes: BaseNode[]): void

// Parse and validate JSON file
importFromJSON(file: File): Promise<{ nodes: BaseNode[], edges: BaseEdge[] }>
```

---

## 🤖 AI Service API

`src/services/geminiService.ts`

### generateAnalysisFromPrompt
Main entry point for AI generation.

```typescript
generateAnalysisFromPrompt(
  prompt: string, 
  currentNodes: BaseNode[], 
  viewMode: ViewMode
): Promise<{ nodes: BaseNode[], edges: BaseEdge[] }>
```

### reapplyLayout
Post-processing layout engine.

```typescript
reapplyLayout(
  nodes: BaseNode[], 
  edges: BaseEdge[], 
  viewMode: ViewMode, 
  preference?: LayoutPreference
): BaseNode[]
```