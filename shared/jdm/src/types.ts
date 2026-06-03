export type NodeType =
  | 'inputNode'
  | 'outputNode'
  | 'decisionTableNode'
  | 'expressionNode'
  | 'functionNode'
  | 'switchNode'
  | 'decisionNode';

export interface Position {
  x: number;
  y: number;
}

export interface DecisionEdge {
  id: string;
  sourceId: string;
  targetId: string;
  sourceHandle?: string;
  targetHandle?: string;
  type?: string;
}

export interface DecisionTableColumn {
  id: string;
  name: string;
  field: string;
}

export interface DecisionTableContent {
  hitPolicy: 'first' | 'collect';
  inputs: DecisionTableColumn[];
  outputs: DecisionTableColumn[];
  rules: Array<Record<string, string> & { _id: string; _description?: string }>;
  passThrough?: boolean;
  inputField?: string | null;
  outputPath?: string | null;
  executionMode?: string;
}

export interface ExpressionEntry {
  id: string;
  key: string;
  value: string;
}

export interface ExpressionContent {
  expressions: ExpressionEntry[];
}

export interface FunctionContent {
  source: string;
}

export interface SwitchCondition {
  id: string;
  condition: string;
  field?: string;
}

export interface SwitchContent {
  hitPolicy?: string;
  conditions: SwitchCondition[];
}

export interface InputContent {
  schema?: string;
}

export interface OutputContent {
  schema?: string;
}

export interface DecisionContent {
  key: string;
  passThrough?: boolean;
  inputField?: string | null;
  outputPath?: string | null;
  executionMode?: string;
}

export type NodeContent =
  | InputContent
  | OutputContent
  | DecisionTableContent
  | ExpressionContent
  | FunctionContent
  | SwitchContent
  | DecisionContent
  | Record<string, unknown>;

export interface DecisionNode {
  id: string;
  type: NodeType;
  name: string;
  position: Position;
  content?: NodeContent;
}

export interface DecisionGraph {
  nodes: DecisionNode[];
  edges: DecisionEdge[];
  metadata?: Record<string, unknown>;
}

export interface DocumentMeta {
  id: string;
  name: string;
  fileName: string;
}
