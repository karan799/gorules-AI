import type { DecisionGraph, DecisionNode, NodeType } from './types.js';

export function createId(): string {
  return crypto.randomUUID();
}

export function defaultContentForType(type: NodeType): Record<string, unknown> {
  switch (type) {
    case 'inputNode':
      return { schema: '' };
    case 'outputNode':
      return {};
    case 'decisionTableNode':
      return {
        hitPolicy: 'first',
        inputs: [],
        outputs: [],
        rules: [],
        passThrough: true,
        inputField: null,
        outputPath: null,
        executionMode: 'single',
      };
    case 'expressionNode':
      return { expressions: [] };
    case 'functionNode':
      return {
        source: `/**\n * @param {input} input\n */\nexport const handler = async (input) => {\n  return input;\n};\n`,
      };
    case 'switchNode':
      return { hitPolicy: 'first', conditions: [] };
    case 'decisionNode':
      return {
        key: '',
        passThrough: true,
        inputField: null,
        outputPath: null,
        executionMode: 'single',
      };
    default:
      return {};
  }
}

export function defaultNameForType(type: NodeType): string {
  const names: Record<NodeType, string> = {
    inputNode: 'Request',
    outputNode: 'Response',
    decisionTableNode: 'Decision table',
    expressionNode: 'Expression',
    functionNode: 'Function',
    switchNode: 'Switch',
    decisionNode: 'Decision',
  };
  return names[type];
}

export function createNode(type: NodeType, position: { x: number; y: number }): DecisionNode {
  return {
    id: createId(),
    type,
    name: defaultNameForType(type),
    position,
    content: defaultContentForType(type) as DecisionNode['content'],
  };
}

export function createEmptyGraph(): DecisionGraph {
  return { nodes: [], edges: [] };
}

export function createStarterGraph(): DecisionGraph {
  const input = createNode('inputNode', { x: 80, y: 200 });
  const table = createNode('decisionTableNode', { x: 320, y: 200 });
  const output = createNode('outputNode', { x: 560, y: 200 });

  const inputColId = createId();
  const outputColId = createId();
  table.content = {
    hitPolicy: 'first',
    inputs: [{ id: inputColId, name: 'Input', field: 'input' }],
    outputs: [{ id: outputColId, name: 'Output', field: 'output' }],
    rules: [{ _id: createId(), _description: 'Default', [inputColId]: '', [outputColId]: 'null' }],
    passThrough: true,
    inputField: null,
    outputPath: null,
    executionMode: 'single',
  };

  return {
    nodes: [input, table, output],
    edges: [
      { id: createId(), sourceId: input.id, targetId: table.id, type: 'edge' },
      { id: createId(), sourceId: table.id, targetId: output.id, type: 'edge' },
    ],
  };
}
