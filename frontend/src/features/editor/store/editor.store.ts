import { create } from 'zustand';
import {
  createEmptyGraph,
  createStarterGraph,
  type DecisionGraph,
  type DocumentMeta,
  type NodeType,
} from '@gorules-editor/shared-jdm';

export interface SimulationState {
  result?: unknown;
  trace?: unknown;
  performance?: unknown;
  error?: string;
}

interface EditorState {
  graph: DecisionGraph;
  document: DocumentMeta;
  selectedNodeId: string | null;
  simulation: SimulationState | null;
  dirty: boolean;
  simulatorOpen: boolean;
  setGraph: (graph: DecisionGraph) => void;
  setDocumentName: (name: string) => void;
  setSelectedNodeId: (id: string | null) => void;
  setSimulation: (sim: SimulationState | null) => void;
  setDirty: (dirty: boolean) => void;
  setSimulatorOpen: (open: boolean) => void;
  newDocument: () => void;
  loadGraph: (graph: DecisionGraph, meta?: Partial<DocumentMeta>) => void;
}

const defaultDocument = (): DocumentMeta => ({
  id: crypto.randomUUID(),
  name: 'Untitled Decision',
  fileName: 'untitled.json',
});

export const useEditorStore = create<EditorState>((set) => ({
  graph: createEmptyGraph(),
  document: defaultDocument(),
  selectedNodeId: null,
  simulation: null,
  dirty: false,
  simulatorOpen: true,

  setGraph: (graph) => set({ graph, dirty: true }),
  setDocumentName: (name) =>
    set((s) => ({
      document: {
        ...s.document,
        name,
        fileName: `${name.replace(/\s+/g, '-').toLowerCase()}.json`,
      },
      dirty: true,
    })),
  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
  setSimulation: (simulation) => set({ simulation }),
  setDirty: (dirty) => set({ dirty }),
  setSimulatorOpen: (simulatorOpen) => set({ simulatorOpen }),

  newDocument: () =>
    set({
      graph: createStarterGraph(),
      document: defaultDocument(),
      selectedNodeId: null,
      simulation: null,
      dirty: false,
    }),

  loadGraph: (graph, meta) =>
    set((s) => ({
      graph,
      document: meta ? { ...s.document, ...meta } : s.document,
      selectedNodeId: null,
      simulation: null,
      dirty: false,
    })),
}));

export const PALETTE_ITEMS: { type: NodeType; label: string }[] = [
  { type: 'inputNode', label: 'Request' },
  { type: 'outputNode', label: 'Response' },
  { type: 'decisionTableNode', label: 'Decision table' },
  { type: 'expressionNode', label: 'Expression' },
  { type: 'functionNode', label: 'Function' },
  { type: 'switchNode', label: 'Switch' },
  { type: 'decisionNode', label: 'Decision' },
];
