
import { GoogleGenAI, Type } from "@google/genai";
import { BaseNode, BaseEdge, ViewMode, LayoutPreference } from "../types";
import { MODELS, LIMITS, COLORS, SIZES } from "../constants";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a unique ID for nodes and edges.
 */
const generateId = (): string => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return Math.random().toString(36).substr(2, 9);
};

/**
 * 1. RADIAL TREE LAYOUT (Analysis / Organic)
 * Uses BFS to organize nodes into concentric circles (Hub & Spoke)
 * Simulates an "Investigation Wall" feel.
 */
const applyOrganicLayout = (nodes: BaseNode[], edges: BaseEdge[]): BaseNode[] => {
    if (nodes.length === 0) return nodes;

    // Build adjacency list
    const adj: Record<string, string[]> = {};
    nodes.forEach(n => adj[n.id] = []);
    edges.forEach(e => {
        if (!adj[e.from]) adj[e.from] = [];
        if (!adj[e.to]) adj[e.to] = [];
        adj[e.from].push(e.to);
    });

    // Find root (node with no incoming edges or first node)
    const incoming = new Set(edges.map(e => e.to));
    let roots = nodes.filter(n => !incoming.has(n.id));
    if (roots.length === 0) roots = [nodes[0]];

    const levels: Record<string, number> = {};
    const queue: { id: string, level: number }[] = roots.map(r => ({ id: r.id, level: 0 }));
    const visited = new Set<string>();
    
    roots.forEach(r => visited.add(r.id));

    while (queue.length > 0) {
        const item = queue.shift();
        if (!item) break;
        const { id, level } = item;
        levels[id] = level;

        const neighbors = adj[id] || [];
        neighbors.forEach(nid => {
            if (!visited.has(nid)) {
                visited.add(nid);
                queue.push({ id: nid, level: level + 1 });
            }
        });
    }

    // Assign unvisited to level 1
    nodes.forEach(n => {
        if (!visited.has(n.id)) {
            levels[n.id] = 1;
        }
    });

    const nodesByLevel: Record<number, BaseNode[]> = {};
    Object.entries(levels).forEach(([nodeId, level]) => {
        if (!nodesByLevel[level as unknown as number]) nodesByLevel[level as unknown as number] = [];
        const node = nodes.find(n => n.id === nodeId);
        if (node) nodesByLevel[level as unknown as number].push(node);
    });

    const centerX = 0;
    const centerY = 0;

    Object.entries(nodesByLevel).forEach(([lvlStr, levelNodes]) => {
        const level = parseInt(lvlStr);
        const radius = Math.max(level * 300, 0); // 300px gap per level
        
        if (level === 0) {
            levelNodes.forEach(n => {
                n.position = { x: centerX, y: centerY };
                // Root is big
                n.visual.sizeMultiplier = 1.5;
                n.visual.shape = 'circle';
            });
        } else {
            const angleStep = (2 * Math.PI) / levelNodes.length;
            levelNodes.forEach((n, i) => {
                // Distribute roughly in circle
                const angle = i * angleStep + (level * 0.5); 
                n.position = {
                    x: centerX + radius * Math.cos(angle) + (Math.random() * 50 - 25), // Add jitter for organic look
                    y: centerY + radius * Math.sin(angle) + (Math.random() * 50 - 25)
                };
                n.visual.sizeMultiplier = 1;
                n.visual.shape = n.type === 'person' ? 'circle' : 'rounded-rect';
            });
        }
    });

    return nodes;
};

/**
 * 2. MANAGEMENT LAYOUT (Timeline / Gantt)
 * Maps nodes to X-axis based on Date.
 * Rows based on index or explicit grouping.
 */
const applyTimelineLayout = (nodes: BaseNode[]): BaseNode[] => {
    const colWidth = 300; // Pixel width per day approx
    const startX = 120; // Offset for sidebar
    const topMargin = 150; 
    
    const today = new Date();
    today.setHours(0,0,0,0);

    // Sort by date
    const sortedNodes = [...nodes].sort((a, b) => {
        const dateA = a.workflow?.start ? new Date(a.workflow.start).getTime() : 0;
        const dateB = b.workflow?.start ? new Date(b.workflow.start).getTime() : 0;
        return dateA - dateB;
    });

    const rowHeight = 120;

    sortedNodes.forEach((n, index) => {
        let daysFromToday = 0;
        
        if (n.workflow?.start) {
            const d = new Date(n.workflow.start);
            d.setHours(0,0,0,0);
            const diffTime = d.getTime() - today.getTime();
            daysFromToday = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        } else {
            // Fallback if no date: Stagger
            daysFromToday = index; 
        }

        // Clamp to avoid huge negative/positive
        if (daysFromToday < -5) daysFromToday = -5;
        if (daysFromToday > 60) daysFromToday = 60;

        n.position.x = startX + (daysFromToday * colWidth) + 20;
        n.position.y = topMargin + (index * rowHeight); // Waterfall effect

        // Enforce visual style for timeline
        n.visual.width = 280;
        n.visual.height = 90;
        n.visual.shape = 'rounded-rect';
    });

    return nodes;
}

/**
 * 3. WORKFLOW LAYOUT (Calendar Grid)
 * Maps nodes to a 7-column grid.
 */
const applyCalendarLayout = (nodes: BaseNode[]): BaseNode[] => {
    const startX = 0;
    const startY = 60; // Header height
    const cellWidth = 250;
    const cellHeight = 200;

    const cellCounts: Record<string, number> = {}; // "row-col" -> count

    nodes.forEach((n, i) => {
        let date = new Date();
        if (n.workflow?.start) {
             try {
                 date = new Date(n.workflow.start);
             } catch (e) { date = new Date(); }
        } else {
             // Fallback: distribute evenly
             date = new Date();
             date.setDate(date.getDate() + (i % 14)); 
        }

        const today = new Date();
        // Normalize to avoid extreme grids
        const diffTime = date.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // Calculate grid position (0 = Today/Monday, etc. simplified)
        // For simplicity, let's map relative to today in a monthly view
        let gridIndex = diffDays; 
        if (gridIndex < 0) gridIndex = 0;
        
        let row = Math.floor(gridIndex / 7);
        let col = gridIndex % 7;

        // Cap rows
        if (row > 5) { row = 5; col = i % 7; }

        const key = `${row}-${col}`;
        const stackIndex = cellCounts[key] || 0;
        cellCounts[key] = stackIndex + 1;

        n.position.x = startX + (col * cellWidth) + 10; // Padding
        n.position.y = startY + (row * cellHeight) + 40 + (stackIndex * 45); // Stack vertically in cell
        
        // Enforce visual style for calendar
        n.visual.width = 230;
        n.visual.height = 40; // Compact badge
        n.visual.shape = 'rounded-rect';
    });
    return nodes;
}

export const reapplyLayout = (nodes: BaseNode[], edges: BaseEdge[], viewMode: ViewMode, preference: LayoutPreference = 'ORGANIC'): BaseNode[] => {
    // Deep clone to avoid mutating state directly during calculation
    const newNodes = JSON.parse(JSON.stringify(nodes));

    if (viewMode === 'management') {
        return applyTimelineLayout(newNodes);
    } else if (viewMode === 'workflow') {
        return applyCalendarLayout(newNodes);
    } else {
        return applyOrganicLayout(newNodes, edges);
    }
};

/**
 * Selects the correct AI Persona based on the current view mode.
 */
const getSystemInstruction = (viewMode: ViewMode): string => {
  const today = new Date().toISOString().split('T')[0];
  
  const BASE_RULES = `
    Current Date: ${today}.
    Output strict JSON only. No markdown.
    COMMON RULES:
    - Generate unique IDs.
    - Use visual colors: Person(Purple), Video(Red), Task(Green), Project(Blue), Topic(Gray).
  `;

  if (viewMode === 'management') {
    return `
      ROLE: SENIOR PROJECT MANAGER (Gantt Expert).
      OBJECTIVE: Create a linear, time-sequenced Project Plan.
      
      CRITICAL INSTRUCTIONS:
      1. **TIME ANCHORING:** Every node MUST have a 'workflow.start' date (YYYY-MM-DD). Start from ${today}.
      2. **SEQUENCING:** Phase 1 -> Phase 2. Dependencies must be chronological.
      3. **TYPES:** Use 'project' for Phases (set 'workflow.end' for duration), 'task' for items, 'diamond' for milestones.
      4. **NO CLUSTERS:** Structure is linear waterfall or parallel tracks.
      
      ${BASE_RULES}
    `;
  }

  if (viewMode === 'workflow') {
    return `
      ROLE: EXECUTIVE SCHEDULER (Calendar Expert).
      OBJECTIVE: Schedule tasks onto a Weekly/Monthly Calendar grid.
      
      CRITICAL INSTRUCTIONS:
      1. **DISTRIBUTION:** Spread tasks across dates ('workflow.start') to balance workload over next 14 days. 
      2. **AVOID PILING:** Do NOT put everything on "Today".
      3. **TYPES:** 'task' (To-Do), 'note' (Meeting), 'document' (Deadline).
      
      ${BASE_RULES}
    `;
  }

  // Default: Analysis (Investigator/Mind Map)
  return `
    ROLE: SPATIAL KNOWLEDGE ARCHITECT (Investigation Wall).
    OBJECTIVE: Explode the prompt into a deep, branching Mind Map.
    
    CRITICAL INSTRUCTIONS:
    1. **TOPOLOGY:** Create CLUSTERS (Hub-and-Spoke). DO NOT create linear lists.
    2. **CONNECTIONS:** Connect nodes based on semantics ('related', 'depends_on'). Creates a mesh/web.
    3. **DEPTH:** Go 2-3 levels deep. 
    4. **RICHNESS:** Add 'link' nodes for references, 'person' nodes for key figures, 'video' nodes for media.
    
    ${BASE_RULES}
  `;
};

export const generateAnalysisFromPrompt = async (prompt: string, currentNodes: BaseNode[], viewMode: ViewMode): Promise<{ nodes: BaseNode[], edges: BaseEdge[] }> => {
  const model = MODELS.ANALYSIS;
  const nodeContext = currentNodes.map(n => ({ id: n.id, title: n.title, type: n.type })).slice(-LIMITS.MAX_NODES_CONTEXT);
  
  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Context: ${JSON.stringify(nodeContext)}. User Prompt: "${prompt}"`,
      config: {
        systemInstruction: getSystemInstruction(viewMode),
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                nodes: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING },
                            type: { type: Type.STRING, enum: ["topic", "task", "video", "person", "link", "project", "note", "root", "document"] },
                            title: { type: Type.STRING },
                            description: { type: Type.STRING },
                            status: { type: Type.STRING, enum: ["todo", "in-progress", "done", "blocked"] },
                            workflow: {
                                type: Type.OBJECT,
                                properties: {
                                    start: { type: Type.STRING, description: "YYYY-MM-DD" },
                                    end: { type: Type.STRING, description: "YYYY-MM-DD" }
                                }
                            },
                             video: {
                                type: Type.OBJECT,
                                properties: {
                                    url: { type: Type.STRING },
                                    thumbnailUrl: { type: Type.STRING },
                                    durationSeconds: { type: Type.INTEGER }
                                }
                            },
                            person: {
                                type: Type.OBJECT,
                                properties: {
                                    role: { type: Type.STRING },
                                    email: { type: Type.STRING }
                                }
                            },
                            task: {
                                type: Type.OBJECT,
                                properties: {
                                    priority: { type: Type.STRING }
                                }
                            }
                        },
                        required: ["type", "title"]
                    }
                },
                edges: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            from: { type: Type.STRING },
                            to: { type: Type.STRING },
                            kind: { type: Type.STRING },
                            label: { type: Type.STRING }
                        },
                        required: ["from", "to"]
                    }
                }
            }
        }
      }
    });

    let text = response.text;
    if (!text) throw new Error("No response from AI");
    text = text.replace(/```json\s*|\s*```/g, "").trim();
    
    let data;
    try {
        data = JSON.parse(text);
    } catch (e) {
        throw new Error("Failed to parse AI response.");
    }
    
    const today = new Date();

    let generatedNodes: BaseNode[] = data.nodes.map((n: any) => ({
      id: n.id || generateId(),
      type: n.type,
      title: n.title,
      description: n.description || '',
      tags: [],
      status: n.status || 'todo',
      progress: 0,
      childrenIds: [],
      position: { x: 0, y: 0 },
      visual: {
          sizeMultiplier: 1,
          collapsed: false,
          color: n.type === 'person' ? COLORS.PURPLE : n.type === 'video' ? COLORS.RED : n.type === 'task' ? COLORS.SUCCESS : undefined,
          shape: 'rounded-rect'
      },
      workflow: n.workflow || {},
      video: n.video,
      person: n.person,
      task: n.task,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'ai'
    }));

    // --- POST-PROCESSING FAILSAFES ---
    // If we are in Timeline/Calendar mode, we MUST have dates.
    // If AI forgot them, we algorithmically assign them to prevent broken UI.
    if (viewMode === 'management' || viewMode === 'workflow') {
        generatedNodes.forEach((n, idx) => {
            if (!n.workflow.start) {
                // Stagger: each node 1 day apart if missing date
                const d = new Date(today);
                d.setDate(today.getDate() + idx);
                n.workflow.start = d.toISOString();
            }
            if (viewMode === 'management' && !n.workflow.end) {
                const start = new Date(n.workflow.start);
                // Default duration: 2 days
                start.setDate(start.getDate() + 2);
                n.workflow.end = start.toISOString();
            }
        });
    }

    const generatedEdges: BaseEdge[] = (data.edges || []).map((e: any) => ({
        id: generateId(),
        from: e.from,
        to: e.to,
        kind: e.kind || 'solid',
        style: e.kind === 'related' ? 'dashed' : 'solid',
        weight: 1,
        opacity: 1,
        label: e.label
    }));

    // Apply the layout immediately based on the current mode
    generatedNodes = reapplyLayout(generatedNodes, generatedEdges, viewMode);

    return { nodes: generatedNodes, edges: generatedEdges };

  } catch (error) {
    console.error("Gemini Error:", error);
    return { nodes: [], edges: [] };
  }
};
