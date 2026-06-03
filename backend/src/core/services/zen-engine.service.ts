import { ZenEngine } from '@gorules/zen-engine';
import type { DecisionGraph } from '@gorules-editor/shared-jdm';

let engineInstance: ZenEngine | null = null;

export function getZenEngine(): ZenEngine {
  if (!engineInstance) {
    engineInstance = new ZenEngine({
      loader: async (key: string) => {
        throw new Error(
          `Sub-decision "${key}" not found. Configure ZenEngine loader for decisionNode references.`,
        );
      },
    });
  }
  return engineInstance;
}

export function createDecisionFromGraph(graph: DecisionGraph) {
  const engine = getZenEngine();
  const payload = JSON.stringify(graph);
  return engine.createDecision(Buffer.from(payload, 'utf-8'));
}
