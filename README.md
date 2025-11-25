# Jirai ⚓

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.3.0-green.svg)
![Status](https://img.shields.io/badge/status-Beta-orange.svg)
![Coverage](https://img.shields.io/badge/coverage-85%25-brightgreen.svg)

> **AI-Powered Spatial Intelligence Workspace**  
> Analyze complex topics, manage timelines, and schedule workflows in a unified, infinite canvas.

---

## 🌟 Features

### 🎯 Spatial Graph Interface
- **Infinite Canvas**: Pan, zoom, and organize thoughts without boundaries.
- **9 Distinct Node Types**: Topics, Tasks, Videos, Persons, Projects, Documents, Notes, Links, and Root nodes.
- **Smart Layouts**: Automatically arranges nodes based on context (Organic, Timeline, or Grid).

### 🤖 AI Assistant (Gemini 2.5 Flash)
- **Context-Aware Generation**: The AI understands if you are in *Analysis*, *Timeline*, or *Calendar* mode and generates structure accordingly.
- **Smart Linking**: Automatically connects new concepts to existing nodes.
- **Auto-Scheduling**: Intelligently assigns dates and durations for project management.

### 📊 Multiple View Modes
1. **Analysis Mode**: Organic Mind Map for brainstorming and investigation.
2. **Timeline Mode**: Horizontal Gantt-style view for project management.
3. **Workflow Mode**: Weekly/Monthly Calendar grid for task scheduling.

### 🛠️ Power User Tools
- **Keyboard Shortcuts**: Vim-like efficiency for navigating and editing.
- **Search & Filter**: Real-time filtering by status, type, and content.
- **Export/Import**: Save your workspace as JSON, or export as PNG/Markdown/TOON.
- **Templates**: Built-in structures for meetings, research, and projects.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- NPM or Yarn
- A Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/jirai.git
   cd jirai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   Create a `.env` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
   VITE_APP_NAME=Jirai
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 💻 Tech Stack

| Category | Technology | Description |
|----------|------------|-------------|
| **Frontend** | React 19 + TypeScript | Core UI library |
| **Build Tool** | Vite 6 | Lightning fast HMR |
| **State** | Zustand 5 | Flux-like state management with persistence |
| **Graph Engine** | React Flow 11 | Node-based interactive diagrams |
| **AI** | Google Gemini SDK | Generative language model integration |
| **Styling** | TailwindCSS | Utility-first CSS framework |
| **Testing** | Vitest + Playwright | Unit and E2E testing infrastructure |

---

## 📂 Project Structure

```
jirai/
├── src/
│   ├── components/     # React components (GraphEngine, Nodes, UI Panels)
│   ├── store/          # Zustand stores (nodes, board, templates)
│   ├── types/          # TypeScript type definitions
│   ├── hooks/          # Custom hooks (useSearch, useKeyboardShortcuts)
│   ├── utils/          # Helper functions (export, import, fileHelpers)
│   └── services/       # API services (Gemini integration)
├── tests/              # Unit and E2E test files
├── public/             # Static assets
└── docs/               # Extended documentation
```

---

## 📖 Usage Guide

### Basic Controls
- **Pan**: Space + Drag or Middle Mouse Button
- **Zoom**: Scroll Wheel or `Ctrl +` / `Ctrl -`
- **Select**: Click node (Hold Shift for multi-select)
- **Context Menu**: Right-click on canvas or nodes
- **Command Palette**: `Cmd/Ctrl + K`

### Creating Nodes
- **Double Click** anywhere on the canvas.
- Press `Ctrl + N`.
- Use the **AI Assistant Bar** at the bottom to generate content.

### Connecting Nodes
- Drag from the handle (dot) on the right side of a node to the left handle of another node.

### View Modes
- **Analysis**: Default view. Best for exploring relationships.
- **Timeline**: Switch via Sidebar. Visualizes `workflow.start` and `workflow.end` dates horizontally.
- **Workflow**: Switch via Sidebar. Visualizes tasks in a calendar grid.

---

## 🗺️ Roadmap

- [x] **Phase 1: Core Engine** (Unified React Flow renderer)
- [x] **Phase 2: AI Integration** (Gemini Persona Agents)
- [x] **Phase 3: View Systems** (Analysis, Timeline, Workflow)
- [x] **Phase 4: Persistence** (Local Storage & Undo/Redo)
- [x] **Phase 5: Mobile Optimization** (Touch gestures & Responsive UI)
- [ ] **Phase 6: Collaboration** (Real-time multiplayer via Yjs)
- [ ] **Phase 7: Plugin System** (Community extensions)

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.