import React, { useState } from 'react';
import {
  BENCHMARK_TEST_CASES,
  OptimizationOptions,
  OptimizationReport,
  TACQuadruple,
} from '../engine/tacOptimizer';
import { Fig11GraphCanvas } from './Fig11GraphCanvas';
import {
  Play,
  RotateCcw,
  StepForward,
  CheckSquare,
  Square,
  Download,
  Terminal,
} from 'lucide-react';

interface JavaSwingSimulatorProps {
  tacInput: string;
  setTacInput: (val: string) => void;
  liveOutputVar: string;
  setLiveOutputVar: (val: string) => void;
  options: OptimizationOptions;
  setOptions: React.Dispatch<React.SetStateAction<OptimizationOptions>>;
  report: OptimizationReport;
  activePresetId: string;
  onSelectPreset: (presetId: string) => void;
  onDownloadJava: () => void;
}

export const JavaSwingSimulator: React.FC<JavaSwingSimulatorProps> = ({
  tacInput,
  setTacInput,
  liveOutputVar,
  setLiveOutputVar,
  options,
  setOptions,
  report,
  activePresetId,
  onSelectPreset,
  onDownloadJava,
}) => {
  const [selectedPassIndex, setSelectedPassIndex] = useState<number>(-1); // -1 means final state
  const [showEdgeLetters, setShowEdgeLetters] = useState<boolean>(true);
  const [swingTheme, setSwingTheme] = useState<'metal' | 'nimbus'>('metal');

  const activePassLog =
    selectedPassIndex >= 0 && selectedPassIndex < report.passLogs.length
      ? report.passLogs[selectedPassIndex]
      : report.passLogs[report.passLogs.length - 1];

  const handleStepForward = () => {
    if (report.passLogs.length <= 1) return;
    if (selectedPassIndex === -1) {
      setSelectedPassIndex(0);
    } else if (selectedPassIndex + 1 < report.passLogs.length) {
      setSelectedPassIndex(selectedPassIndex + 1);
    } else {
      setSelectedPassIndex(-1);
    }
  };

  const handleReset = () => {
    onSelectPreset(activePresetId || BENCHMARK_TEST_CASES[0].id);
    setSelectedPassIndex(-1);
  };

  const toggleOption = (key: keyof OptimizationOptions) => {
    setOptions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    setSelectedPassIndex(-1);
  };

  const renderStatusText = (q: TACQuadruple) => {
    if (q.status === 'folded') {
      return (
        <span className="font-mono text-xs font-semibold text-emerald-700">
          [FOLDED] {q.statusTag}
        </span>
      );
    }
    if (q.status === 'cse_merged') {
      return (
        <span className="font-mono text-xs font-semibold text-amber-700">
          [CSE MERGED] {q.statusTag}
        </span>
      );
    }
    if (q.status === 'dead_removed') {
      return (
        <span className="font-mono text-xs font-semibold text-rose-700">
          [ELIMINATED] {q.statusTag}
        </span>
      );
    }
    return (
      <span className="font-mono text-xs font-medium text-sky-800">
        [RETAINED] LIVE CODE
      </span>
    );
  };

  return (
    <section className="max-w-[1380px] mx-auto px-6 py-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <p className="text-xs font-medium text-sky-700 mb-1">
            Interactive Execution Environment · javax.swing.JFrame &amp; Custom Graphics2D JPanel
          </p>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900">
            Java Swing Intermediate Code Optimizer Simulator
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Test custom Three-Address Code (TAC) inputs, toggle individual compiler optimization passes, and inspect the live Swing GUI rendering of Figure 1.1 side-by-side dependency and DAG graphs.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Input
          </button>
          <button
            type="button"
            onClick={onDownloadJava}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-sky-700 rounded-lg hover:bg-sky-800 transition-colors whitespace-nowrap shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            Download .java Source
          </button>
        </div>
      </div>

      {/* Two-Zone Educational Sandbox Layout: 68% Left Interactive Swing Window / 32% Right Concept & Pass Deck */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mt-6 items-start">
        {/* LEFT ZONE (8 cols on XL): Authentic Java Swing Application Frame */}
        <div className="xl:col-span-8 rounded-lg border-2 border-slate-400 bg-[#E2E8F0] shadow-md overflow-hidden">
          {/* Java Swing JFrame Title Bar */}
          <div
            className={`flex items-center justify-between px-3.5 py-2 border-b border-slate-400 select-none ${
              swingTheme === 'metal'
                ? 'bg-gradient-to-r from-slate-700 via-slate-800 to-slate-700 text-white'
                : 'bg-gradient-to-r from-sky-900 via-slate-800 to-sky-900 text-white'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Terminal className="w-4 h-4 text-sky-300 shrink-0" />
              <span className="text-xs font-mono font-semibold truncate">
                Compiler Design Project: GUI-Based Intermediate Code Optimizer (Swing JFrame)
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() =>
                  setSwingTheme((t) => (t === 'metal' ? 'nimbus' : 'metal'))
                }
                className="px-2 py-0.5 text-[11px] font-mono bg-slate-600/80 hover:bg-slate-500 text-slate-100 rounded border border-slate-400/50 transition-colors whitespace-nowrap"
                title="Switch Java Swing LookAndFeel"
              >
                LaF: {swingTheme === 'metal' ? 'Metal' : 'Nimbus'}
              </button>
              <div className="flex items-center gap-1.5 ml-1">
                <span className="w-3 h-3 rounded-xs bg-slate-500 border border-slate-300 inline-block" />
                <span className="w-3 h-3 rounded-xs bg-slate-500 border border-slate-300 inline-block" />
                <span className="w-3 h-3 rounded-xs bg-rose-600 border border-rose-300 inline-block" />
              </div>
            </div>
          </div>

          {/* Java Swing JMenuBar */}
          <div className="flex flex-wrap items-center justify-between gap-4 px-3 py-1.5 bg-[#EDF2F7] border-b border-slate-300 text-xs text-slate-700">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleReset}
                className="hover:text-slate-950 hover:underline whitespace-nowrap"
              >
                File (Reset)
              </button>
              <button
                type="button"
                onClick={() =>
                  setOptions({
                    constantFolding: true,
                    cse: true,
                    deadCodeRemoval: true,
                  })
                }
                className="hover:text-slate-950 hover:underline whitespace-nowrap"
              >
                Enable All Passes
              </button>
              <button
                type="button"
                onClick={() => setShowEdgeLetters((v) => !v)}
                className="hover:text-slate-950 hover:underline whitespace-nowrap"
              >
                {showEdgeLetters
                  ? 'Hide Edge Names (A, B, C...)'
                  : 'Show Edge Names (A, B, C...)'}
              </button>
            </div>
            <div className="text-[11px] font-mono text-slate-500">
              javax.swing.JSplitPane · Graphics2D Anti-Aliased Canvas
            </div>
          </div>

          {/* Swing North Control Panel: JCheckBox Optimization Selectors */}
          <div className="p-3 bg-[#F1F5F9] border-b border-slate-300">
            <fieldset className="border border-slate-300 rounded px-3 py-2 bg-white">
              <legend className="text-[11px] font-mono font-semibold text-slate-700 px-1.5">
                Select Optimization Choice (JCheckBox / JRadioButton)
              </legend>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => toggleOption('constantFolding')}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-800 hover:text-sky-800 whitespace-nowrap"
                  >
                    {options.constantFolding ? (
                      <CheckSquare className="w-4 h-4 text-sky-700" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                    1. Constant Folding
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleOption('cse')}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-800 hover:text-sky-800 whitespace-nowrap"
                  >
                    {options.cse ? (
                      <CheckSquare className="w-4 h-4 text-sky-700" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                    2. Common Sub-Expression Elimination (CSE)
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleOption('deadCodeRemoval')}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-800 hover:text-sky-800 whitespace-nowrap"
                  >
                    {options.deadCodeRemoval ? (
                      <CheckSquare className="w-4 h-4 text-sky-700" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                    3. Dead Code Removal
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleStepForward}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-800 bg-slate-100 border border-slate-300 rounded hover:bg-slate-200 transition-colors whitespace-nowrap"
                  >
                    <StepForward className="w-3.5 h-3.5 text-sky-700" />
                    Step Pass (
                    {selectedPassIndex === -1
                      ? 'All'
                      : `${selectedPassIndex + 1}/${report.passLogs.length}`}
                    )
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPassIndex(-1)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-sky-700 rounded hover:bg-sky-800 transition-colors whitespace-nowrap"
                  >
                    <Play className="w-3.5 h-3.5" />
                    Run Full Optimizer
                  </button>
                </div>
              </div>
            </fieldset>
          </div>

          {/* Swing Center Split Area: Input/Output JTextAreas + Fig 1.1 Graph Canvas */}
          <div className="p-3 space-y-3 bg-[#E2E8F0]">
            {/* Input & Output TAC JTextAreas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <fieldset className="border border-slate-300 rounded bg-white p-2.5">
                <legend className="text-[11px] font-mono font-semibold text-slate-700 px-1">
                  (b) Expected Input: Three-Address Code (JTextArea)
                </legend>
                <textarea
                  value={tacInput}
                  onChange={(e) => {
                    setTacInput(e.target.value);
                    setSelectedPassIndex(-1);
                  }}
                  rows={7}
                  spellCheck={false}
                  aria-label="Three-Address Code Input"
                  className="w-full font-mono text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-sky-600 leading-relaxed"
                />
                <div className="flex items-center justify-between gap-2 mt-2 pt-1.5 border-t border-slate-100">
                  <label
                    htmlFor="live-output-var"
                    className="text-[11px] font-mono text-slate-600"
                  >
                    Live Output Variable (JTextField):
                  </label>
                  <input
                    id="live-output-var"
                    type="text"
                    value={liveOutputVar}
                    onChange={(e) => setLiveOutputVar(e.target.value)}
                    className="font-mono text-xs px-2 py-1 w-36 bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-600"
                  />
                </div>
              </fieldset>

              <fieldset className="border border-slate-300 rounded bg-white p-2.5 flex flex-col justify-between">
                <legend className="text-[11px] font-mono font-semibold text-emerald-800 px-1">
                  (c) Expected Output: Optimal TAC Statements (JTextArea)
                </legend>
                <div className="font-mono text-xs bg-emerald-50/40 border border-emerald-200 rounded p-2.5 h-[146px] overflow-y-auto space-y-1">
                  {report.finalLines.length > 0 ? (
                    report.finalLines.map((line, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-slate-900 font-semibold"
                      >
                        <span className="text-slate-400 select-none w-5 text-right tabular-nums">
                          {i + 1}.
                        </span>
                        <span>{line}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-slate-400 italic">
                      No active instructions remaining.
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 mt-2 pt-1.5 border-t border-slate-100 tabular-nums">
                  <span>
                    Instructions: {report.metrics.originalCount} →{' '}
                    <strong className="text-emerald-700">
                      {report.metrics.optimizedCount}
                    </strong>
                  </span>
                  <span>·</span>
                  <span>
                    Cycle Cost: {report.metrics.originalCycleCost} →{' '}
                    <strong className="text-emerald-700">
                      {report.metrics.optimizedCycleCost}
                    </strong>{' '}
                    (-{report.metrics.costSavingsPercent}%)
                  </span>
                </div>
              </fieldset>
            </div>

            {/* Custom Swing JPanel Graph Canvas (Fig. 1.1) */}
            <fieldset className="border border-slate-300 rounded bg-slate-50 p-3">
              <legend className="text-[11px] font-mono font-semibold text-slate-700 px-1.5">
                Custom Swing JPanel (paintComponent Graphics2D) — Fig. 1.1 Graph &amp; Optimal DAG
              </legend>
              <Fig11GraphCanvas
                unoptimizedGraph={report.unoptimizedGraph}
                optimizedGraph={report.optimizedGraph}
                showEdgeLetters={showEdgeLetters}
                variant="swing"
                captionText="Fig. 1.1: Unoptimized TAC Dependency Graph (Left) vs. Optimal Reduced DAG (Right) with Edge Names (A, B, C...) & Integer Weights"
              />
            </fieldset>

            {/* Swing JTable Quadruple Transformation Trace */}
            <fieldset className="border border-slate-300 rounded bg-white p-2.5">
              <legend className="text-[11px] font-mono font-semibold text-slate-700 px-1.5">
                javax.swing.JTable — Pass-by-Pass Quadruple Transformation Trace ({activePassLog.passName})
              </legend>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-mono">
                      <th className="py-1.5 px-2.5">#</th>
                      <th className="py-1.5 px-2.5">Statement</th>
                      <th className="py-1.5 px-2.5">Target</th>
                      <th className="py-1.5 px-2.5">Arg 1</th>
                      <th className="py-1.5 px-2.5">Op</th>
                      <th className="py-1.5 px-2.5">Arg 2</th>
                      <th className="py-1.5 px-2.5 text-right">Weight</th>
                      <th className="py-1.5 px-2.5">Pass Status</th>
                      <th className="py-1.5 px-2.5">Compiler Explanation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono tabular-nums">
                    {activePassLog.quadruples.map((q) => (
                      <tr
                        key={q.index}
                        className={
                          q.status === 'dead_removed'
                            ? 'bg-rose-50/40 text-slate-400 line-through'
                            : q.status === 'folded'
                            ? 'bg-emerald-50/40 text-slate-900'
                            : q.status === 'cse_merged'
                            ? 'bg-amber-50/40 text-slate-900'
                            : 'text-slate-800'
                        }
                      >
                        <td className="py-1.5 px-2.5 font-semibold">{q.index}</td>
                        <td className="py-1.5 px-2.5 font-semibold">{q.raw}</td>
                        <td className="py-1.5 px-2.5">{q.target}</td>
                        <td className="py-1.5 px-2.5">{q.arg1}</td>
                        <td className="py-1.5 px-2.5">{q.operator}</td>
                        <td className="py-1.5 px-2.5">{q.arg2 || '—'}</td>
                        <td className="py-1.5 px-2.5 text-right">{q.cost}</td>
                        <td className="py-1.5 px-2.5 no-underline">
                          {renderStatusText(q)}
                        </td>
                        <td className="py-1.5 px-2.5 font-sans text-slate-600 no-underline">
                          {q.explanation}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </fieldset>
          </div>
        </div>

        {/* RIGHT ZONE (4 cols on XL): Benchmark Test Cases, Pass Stepper & Concept Deck */}
        <div className="xl:col-span-4 space-y-5">
          {/* Pre-loaded Benchmark Selector */}
          <div className="bg-white rounded-lg border border-slate-200 p-5">
            <h2 className="text-base font-display font-bold text-slate-900">
              Pre-Loaded Compiler Benchmarks
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Select a test suite to load its Three-Address Code and verify Constant Folding, CSE, and Dead Code Removal.
            </p>
            <div className="mt-3.5 space-y-2">
              {BENCHMARK_TEST_CASES.map((tc) => {
                const isSelected = activePresetId === tc.id;
                return (
                  <button
                    key={tc.id}
                    type="button"
                    onClick={() => {
                      onSelectPreset(tc.id);
                      setSelectedPassIndex(-1);
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      isSelected
                        ? 'bg-sky-50/70 border-sky-600 text-slate-900'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-900">
                        {tc.title}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Focus: {tc.focusArea} · Live Output: <code>{tc.liveOutputs.join(', ')}</code>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Guided Compiler Pass Progression */}
          <div className="bg-white rounded-lg border border-slate-200 p-5">
            <h2 className="text-base font-display font-bold text-slate-900">
              Guided Pass-by-Pass Inspector
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Click any compiler stage below to inspect intermediate quadruples before and after each transformation.
            </p>

            <div className="mt-3.5 space-y-2">
              {report.passLogs.map((log, idx) => {
                const isCurrent =
                  (selectedPassIndex === -1 &&
                    idx === report.passLogs.length - 1) ||
                  selectedPassIndex === idx;
                return (
                  <button
                    key={log.passName}
                    type="button"
                    onClick={() => setSelectedPassIndex(idx)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      isCurrent
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold">
                        {log.passName}
                      </span>
                      <span
                        className={`text-[11px] font-mono tabular-nums ${
                          isCurrent ? 'text-sky-300' : 'text-slate-500'
                        }`}
                      >
                        {log.changesCount} change{log.changesCount === 1 ? '' : 's'}
                      </span>
                    </div>
                    <p
                      className={`text-xs mt-1 leading-relaxed ${
                        isCurrent ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      {log.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantitative Optimization Summary Card */}
          <div className="bg-white rounded-lg border border-slate-200 p-5">
            <h2 className="text-base font-display font-bold text-slate-900">
              Quantitative Optimization Metrics
            </h2>
            <dl className="mt-3 divide-y divide-slate-100 text-xs tabular-nums">
              <div className="py-2 flex items-center justify-between">
                <dt className="text-slate-600">Unoptimized TAC Statements</dt>
                <dd className="font-mono font-semibold text-slate-900">
                  {report.metrics.originalCount} statements
                </dd>
              </div>
              <div className="py-2 flex items-center justify-between">
                <dt className="text-slate-600">Optimal TAC Statements</dt>
                <dd className="font-mono font-semibold text-emerald-700">
                  {report.metrics.optimizedCount} statements
                </dd>
              </div>
              <div className="py-2 flex items-center justify-between">
                <dt className="text-slate-600">Constant Folding Evaluations</dt>
                <dd className="font-mono font-semibold text-slate-900">
                  {report.metrics.foldedCount} folded
                </dd>
              </div>
              <div className="py-2 flex items-center justify-between">
                <dt className="text-slate-600">Common Sub-Expressions Merged</dt>
                <dd className="font-mono font-semibold text-slate-900">
                  {report.metrics.cseCount} merged
                </dd>
              </div>
              <div className="py-2 flex items-center justify-between">
                <dt className="text-slate-600">Dead Instructions Eliminated</dt>
                <dd className="font-mono font-semibold text-rose-700">
                  {report.metrics.deadRemovedCount} removed
                </dd>
              </div>
              <div className="py-2 flex items-center justify-between">
                <dt className="text-slate-600">Fig. 1.1 Graph Cycle Cost Reduction</dt>
                <dd className="font-mono font-semibold text-sky-700">
                  {report.metrics.originalCycleCost} → {report.metrics.optimizedCycleCost} (-{report.metrics.costSavingsPercent}%)
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
};
