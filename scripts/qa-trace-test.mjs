import { readFileSync } from 'fs';
import { pathToFileURL } from 'url';
import path from 'path';

// Dynamic import of trace utils - run via built test or inline
const trace = {
  tbl1: {
    id: 'tbl1',
    name: 'T',
    input: { amount: 150 },
    output: { discount: 0.15 },
    traceData: { index: 0, rule: { _id: 'r1' } },
  },
  in1: { id: 'in1', name: 'Request', input: null, output: null },
};

// Inline copy of fixed logic for verification
function getNodeTraceEntries(trace) {
  if (!trace || typeof trace !== 'object') return [];
  const entries = [];
  const root = trace;
  for (const [key, val] of Object.entries(root)) {
    if (val && typeof val === 'object' && (val.id || val.input !== undefined || val.output !== undefined)) {
      entries.push({ nodeId: val.id ?? key, ...val });
    }
  }
  return entries;
}

const entries = getNodeTraceEntries(trace);
console.log('entries', entries.map((e) => e.nodeId));
console.log(entries.length === 2 ? 'PASS trace parse' : 'FAIL trace parse');
