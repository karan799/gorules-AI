/**
 * QA API smoke tests for gorules-AI backend
 */
const API = 'http://localhost:3001/api/v1';

async function post(path, body) {
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }
  return { status: res.status, json };
}

const starterGraph = {
  nodes: [
    { id: 'in1', type: 'inputNode', name: 'Request', position: { x: 80, y: 200 }, content: { schema: '' } },
    {
      id: 'tbl1',
      type: 'decisionTableNode',
      name: 'Discount',
      position: { x: 320, y: 200 },
      content: {
        hitPolicy: 'first',
        inputs: [{ id: 'i1', name: 'Amount', field: 'amount' }],
        outputs: [{ id: 'o1', name: 'Discount', field: 'discount' }],
        rules: [
          { _id: 'r1', _description: 'High', i1: '> 100', o1: '0.15' },
          { _id: 'r2', _description: 'Default', i1: '', o1: '0' },
        ],
        passThrough: true,
        inputField: null,
        outputPath: null,
        executionMode: 'single',
      },
    },
    { id: 'out1', type: 'outputNode', name: 'Response', position: { x: 560, y: 200 }, content: {} },
  ],
  edges: [
    { id: 'e1', sourceId: 'in1', targetId: 'tbl1', type: 'edge' },
    { id: 'e2', sourceId: 'tbl1', targetId: 'out1', type: 'edge' },
  ],
};

const tests = [];

async function run() {
  console.log('=== QA API Tests ===\n');

  const health = await fetch(`${API}/health`);
  tests.push({
    name: 'GET /health',
    pass: health.ok,
    detail: await health.json(),
  });

  const validate = await post('/validate/graph', { content: starterGraph });
  tests.push({
    name: 'POST /validate/graph (starter)',
    pass: validate.status === 200 && validate.json.valid,
    detail: validate,
  });

  const sim1 = await post('/simulate', {
    content: starterGraph,
    context: { amount: 150 },
  });
  tests.push({
    name: 'POST /simulate (amount=150)',
    pass: sim1.status === 200 && sim1.json.result !== undefined,
    detail: { status: sim1.status, result: sim1.json.result, hasTrace: !!sim1.json.trace },
  });

  const sim2 = await post('/simulate', {
    content: starterGraph,
    context: { amount: 50 },
  });
  tests.push({
    name: 'POST /simulate (amount=50)',
    pass: sim2.status === 200,
    detail: { status: sim2.status, result: sim2.json.result },
  });

  const badGraph = { nodes: [{ id: '1', type: 'inputNode', name: 'X', position: { x: 0, y: 0 } }], edges: [] };
  const simBad = await post('/simulate', { content: badGraph, context: {} });
  tests.push({
    name: 'POST /simulate (no output node — expect error)',
    pass: simBad.status >= 400,
    detail: { status: simBad.status, error: simBad.json.error },
  });

  const exprGraph = {
    nodes: [
      { id: 'in', type: 'inputNode', name: 'Request', position: { x: 0, y: 0 }, content: {} },
      {
        id: 'ex',
        type: 'expressionNode',
        name: 'Expr',
        position: { x: 200, y: 0 },
        content: {
          expressions: [{ id: 'e1', key: 'total', value: 'amount * 2' }],
        },
      },
      { id: 'out', type: 'outputNode', name: 'Response', position: { x: 400, y: 0 }, content: {} },
    ],
    edges: [
      { id: 'e1', sourceId: 'in', targetId: 'ex', type: 'edge' },
      { id: 'e2', sourceId: 'ex', targetId: 'out', type: 'edge' },
    ],
  };
  const simExpr = await post('/simulate', { content: exprGraph, context: { amount: 10 } });
  tests.push({
    name: 'POST /simulate (expression node)',
    pass: simExpr.status === 200,
    detail: { status: simExpr.status, result: simExpr.json.result },
  });

  let passed = 0;
  for (const t of tests) {
    const icon = t.pass ? 'PASS' : 'FAIL';
    if (t.pass) passed++;
    console.log(`[${icon}] ${t.name}`);
    if (!t.pass || process.env.VERBOSE) console.log('  ', JSON.stringify(t.detail, null, 2));
  }
  console.log(`\n${passed}/${tests.length} passed`);
  process.exit(passed === tests.length ? 0 : 1);
}

run().catch((e) => {
  console.error('Test runner failed:', e.message);
  process.exit(1);
});
