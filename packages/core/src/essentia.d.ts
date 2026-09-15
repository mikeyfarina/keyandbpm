// Typings for the parts of essentia.js this package uses. The published package ships
// `dist/core_api.d.ts` but never declares it as its types entry, and types every method
// as `any`, so the surface we depend on is described here instead.

declare module "essentia.js/dist/essentia.js-core.es.js" {
  /** A std::vector<float> living in WASM memory. Must be deleted or it leaks. */
  export interface EssentiaVector {
    size(): number;
    get(index: number): number;
    delete(): void;
  }

  export interface EssentiaVectorVector {
    size(): number;
    get(index: number): EssentiaVector;
    delete(): void;
  }

  export interface EssentiaApi {
    version: string;
    arrayToVector(input: Float32Array): EssentiaVector;
    vectorToArray(input: EssentiaVector): Float32Array;
    FrameGenerator(audio: Float32Array, frameSize: number, hopSize: number): EssentiaVectorVector;
    Windowing(frame: EssentiaVector, normalized: boolean, size: number, type: string): { frame: EssentiaVector };
    Spectrum(frame: EssentiaVector, size: number): { spectrum: EssentiaVector };
    SpectralPeaks(
      spectrum: EssentiaVector,
      magnitudeThreshold: number,
      maxFrequency: number,
      maxPeaks: number,
      minFrequency: number,
      orderBy: string,
      sampleRate: number,
    ): { frequencies: EssentiaVector; magnitudes: EssentiaVector };
    RhythmExtractor2013(
      signal: EssentiaVector,
      maxTempo: number,
      method: "multifeature" | "degara",
      minTempo: number,
    ): {
      bpm: number;
      confidence: number;
      ticks: EssentiaVector;
      estimates: EssentiaVector;
      bpmIntervals: EssentiaVector;
    };
    KeyExtractor(
      audio: EssentiaVector,
      averageDetuningCorrection: boolean,
      frameSize: number,
      hopSize: number,
      hpcpSize: number,
      maxFrequency: number,
      maximumSpectralPeaks: number,
      minFrequency: number,
      pcpThreshold: number,
      profileType: string,
      sampleRate: number,
      spectralPeaksThreshold: number,
      tuningFrequency: number,
      weightType: string,
      windowType: string,
    ): { key: string; scale: "major" | "minor"; strength: number };
    shutdown(): void;
    delete(): void;
  }

  const Essentia: new (wasmModule: unknown, isDebug?: boolean) => EssentiaApi;
  export default Essentia;
}

declare module "essentia.js/dist/essentia-wasm.umd.js" {
  /** Synchronous build with the WASM embedded, for Bun and Node. `module.exports` is the module. */
  const wasmModule: unknown;
  export = wasmModule;
}

declare module "essentia.js/dist/essentia-wasm.es.js" {
  /** Browser build with the WebAssembly inlined, already instantiated. */
  export const EssentiaWASM: unknown;
}
