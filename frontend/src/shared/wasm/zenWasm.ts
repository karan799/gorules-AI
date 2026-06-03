let wasmReady: Promise<void> | null = null;

export function ensureZenWasmLoaded(): Promise<void> {
  if (!wasmReady) {
    wasmReady = (async () => {
      const ZenEngineWasm = await import('@gorules/zen-engine-wasm');
      const wasmUrl = (await import('@gorules/zen-engine-wasm/dist/zen_engine_wasm_bg.wasm?url'))
        .default;
      await ZenEngineWasm.default(wasmUrl);
    })();
  }
  return wasmReady;
}

export function useWasmReady(): boolean {
  return wasmReady !== null;
}
