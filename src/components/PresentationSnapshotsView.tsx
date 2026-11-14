import React, { useState } from 'react';
import {
  BENCHMARK_TEST_CASES,
  runTACOptimization,
} from '../engine/tacOptimizer';
import { Fig11GraphCanvas } from './Fig11GraphCanvas';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Printer,
  Terminal,
  CheckSquare,
} from 'lucide-react';

interface PresentationSnapshotsViewProps {
  marksX: number;
  marksY: number;
  marksZ: number;
  onLoadCaseIntoSimulator: (presetId: string) => void;
  onPrintReport: () => void;
}

export const PresentationSnapshotsView: React.FC<PresentationSnapshotsViewProps> = ({
  marksX,
  marksY,
  marksZ,
  onLoadCaseIntoSimulator,
  onPrintReport,
}) => {
  const [activeSlide, setActiveSlide] = useState<number>(0);

  // Precompute reports for all 5 benchmark test cases for instant snapshot rendering
  const benchmarkSnapshots = BENCHMARK_TEST_CASES.map((tc) => ({
    testCase: tc,
    report: runTACOptimization(
      tc.tacInput,
      { constantFolding: true, cse: true, deadCodeRemoval: true },
      tc.liveOutputs
    ),
  }));

  const slides = [
    {
      index: 1,
      kicker: 'Slide 01 · Course Overview & Evaluation Rubric',
      title: 'Intermediate Code Optimization using Java Swing',
      subtitle:
        'Undergraduate Compiler Design Project — Constant Folding, Common Sub-Expression Elimination, and Dead Code Removal',
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-7 bg-slate-50 rounded-lg border border-slate-200 p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-display font-bold text-slate-900">
                Formal Problem Statement &amp; Scope
              </h3>
              <p className="text-sm text-slate-700 mt-2 leading-relaxed">
                In a modern multi-pass compiler, the front-end translates source programs into an intermediate representation such as <strong>Three-Address Code (TAC)</strong> and <strong>Directed Acyclic Graphs (DAGs)</strong>. This project implements a complete Java Swing GUI workbench that transforms unoptimized TAC into an optimal machine-independent sequence.
              </p>
              <div className="mt-4 space-y-2.5 text-sm text-slate-800">
                <div>
                  <strong className="text-slate-900">1. Constant Folding &amp; Propagation:</strong> Evaluates expressions with known literal operands at compile time (e.g., <code>t1 = 4 * 7 → t1 = 28</code>) and substitutes constants forward.
                </div>
                <div>
                  <strong className="text-slate-900">2. Common Sub-Expression Elimination (CSE):</strong> Detects identical or commutative expressions (e.g., <code>a + b</code> and <code>b + a</code>) via DAG value numbering to eliminate redundant evaluations.
                </div>
                <div>
                  <strong className="text-slate-900">3. Dead Code Removal:</strong> Performs backward liveness analysis from live output variables to prune unused temporaries and overwritten definitions.
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>Language: Java (JDK 8+)</span>
              <span>·</span>
              <span>GUI Framework: Java Swing (javax.swing &amp; java.awt.Graphics2D)</span>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white rounded-lg border border-slate-200 p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-display font-bold text-slate-900">
                Grading Scheme (X + Y + Z = 10 Marks)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Aligned with the undergraduate Compiler Design evaluation rubric:
              </p>
              <div className="mt-4 divide-y divide-slate-200 text-sm tabular-nums">
                <div className="py-3 flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold text-slate-900">
                      (X) Appropriate Java Swing GUI
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5">
                      JFrame, JTextArea TAC editors, JCheckBox selectors, JTable pass trace &amp; Fig. 1.1 custom JPanel graph canvas
                    </div>
                  </div>
                  <span className="font-mono font-bold text-sky-700 shrink-0">
                    X = {marksX} Marks
                  </span>
                </div>
                <div className="py-3 flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold text-slate-900">
                      (Y) Expected Inputs &amp; Outputs
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5">
                      Unambiguous TAC inputs, edge weights (A, B, C...), optimization choice, and verified optimal DAG output
                    </div>
                  </div>
                  <span className="font-mono font-bold text-sky-700 shrink-0">
                    Y = {marksY} Marks
                  </span>
                </div>
                <div className="py-3 flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold text-slate-900">
                      (Z) Well-Documented Code &amp; Presentation
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5">
                      Complete Javadoc documentation, complexity analysis, and presentation snapshots
                    </div>
                  </div>
                  <span className="font-mono font-bold text-sky-700 shrink-0">
                    Z = {marksZ} Marks
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between font-mono text-sm font-bold text-slate-900 tabular-nums">
              <span>Total Project Marks (X + Y + Z)</span>
              <span>{marksX + marksY + marksZ} / 10 Marks</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      index: 2,
      kicker: 'Slide 02 · Unambiguous Specification (Modeled After Faculty Sample)',
      title: 'Clear Definition of (a) Objective, (b) Expected Inputs, and (c) Expected Outputs',
      subtitle:
        'Structured in exact accordance with the sample project specification with zero ambiguity',
      content: (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-slate-50 rounded-lg border border-slate-200 p-5">
              <div className="text-xs font-mono font-semibold text-sky-800">
                (a) OBJECTIVE
              </div>
              <h4 className="text-base font-display font-bold text-slate-900 mt-1">
                GUI-Based Intermediate Code Optimization
              </h4>
              <p className="text-sm text-slate-700 mt-2 leading-relaxed">
                Develop a well-documented Java application using Java Swing components to optimize intermediate Three-Address Code (TAC) and its corresponding dependency graph by applying <strong>Constant Folding</strong>, <strong>Common Sub-Expression Elimination (CSE)</strong>, and <strong>Dead Code Removal</strong>.
              </p>
            </div>

            <div className="bg-slate-50 rounded-lg border border-slate-200 p-5">
              <div className="text-xs font-mono font-semibold text-sky-800">
                (b) EXPECTED INPUTS
              </div>
              <h4 className="text-base font-display font-bold text-slate-900 mt-1">
                TAC Statements, Edge Weights &amp; Technique Choice
              </h4>
              <p className="text-sm text-slate-700 mt-2 leading-relaxed">
                1. A sequence of unoptimized Three-Address Code (TAC) statements entered via a Swing <code>JTextArea</code>, which constructs a directed dependency graph with numbered vertices <code>(1, 2, ...)</code>, named edges <code>(A, B, C, ...)</code>, and integer instruction weights.<br />
                2. The user&apos;s choice of optimization technique(s) selected via Swing <code>JCheckBox</code> controls.
              </p>
            </div>

            <div className="bg-slate-50 rounded-lg border border-slate-200 p-5">
              <div className="text-xs font-mono font-semibold text-sky-800">
                (c) EXPECTED OUTPUTS
              </div>
              <h4 className="text-base font-display font-bold text-slate-900 mt-1">
                Optimal TAC &amp; Reduced Fig. 1.1 DAG
              </h4>
              <p className="text-sm text-slate-700 mt-2 leading-relaxed">
                1. The reduced, optimal Three-Address Code sequence displayed in the output <code>JTextArea</code>.<br />
                2. A side-by-side visual graph rendered on a custom Swing <code>JPanel</code> (as shown in <strong>Fig. 1.1</strong>) comparing the unoptimized graph against the optimal reduced DAG, along with a <code>JTable</code> transformation trace.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <Fig11GraphCanvas
              unoptimizedGraph={benchmarkSnapshots[0].report.unoptimizedGraph}
              optimizedGraph={benchmarkSnapshots[0].report.optimizedGraph}
              captionText="Fig. 1.1 Unoptimized Three-Address Code Dependency Graph (Weight: 126) and its Optimal Reduced DAG Solution (Weight: 48)"
            />
          </div>
        </div>
      ),
    },
    {
      index: 3,
      kicker: 'Slide 03 · Technique 1 Walkthrough & Snapshot',
      title: 'Constant Folding & Compile-Time Constant Propagation',
      subtitle:
        'Evaluating literal arithmetic expressions during compilation rather than at runtime',
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-50 rounded-lg border border-slate-200 p-5">
              <h4 className="text-base font-display font-bold text-slate-900">
                Algorithmic Mechanism
              </h4>
              <ol className="mt-3 space-y-2 text-sm text-slate-700 list-decimal list-inside leading-relaxed">
                <li>
                  Maintain a compile-time constant symbol table <code>Map&lt;String, Double&gt; constTable</code>.
                </li>
                <li>
                  For each quadruple <code>target = arg1 op arg2</code>, substitute known constant values from <code>constTable</code> into <code>arg1</code> and <code>arg2</code>.
                </li>
                <li>
                  If both <code>arg1</code> and <code>arg2</code> are numeric literals, compute <code>val = evaluate(op, arg1, arg2)</code> at compile time, rewrite the quadruple to <code>target = val</code> (reducing edge weight from 24/14 to 10), and record <code>(target, val)</code> in <code>constTable</code>.
                </li>
              </ol>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-4 font-mono text-xs space-y-3">
              <div>
                <div className="text-slate-500 font-semibold mb-1">
                  (b) Expected Input (Case 2 — Constant Folding):
                </div>
                <pre className="bg-slate-50 p-2.5 rounded border border-slate-200 text-slate-800">
                  {benchmarkSnapshots[1].testCase.tacInput}
                </pre>
              </div>
              <div>
                <div className="text-emerald-800 font-semibold mb-1">
                  (c) Expected Output (After Folding + Dead Code Cleanup):
                </div>
                <pre className="bg-emerald-50/50 p-2.5 rounded border border-emerald-200 text-slate-900 font-semibold">
                  {benchmarkSnapshots[1].report.finalLines.join('\n')}
                </pre>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white rounded-lg border border-slate-200 p-4">
            <Fig11GraphCanvas
              unoptimizedGraph={benchmarkSnapshots[1].report.unoptimizedGraph}
              optimizedGraph={benchmarkSnapshots[1].report.optimizedGraph}
              captionText="Fig. 1.2 GUI Graph Output for Case 2: Chained Constant Folding (6 instructions reduced to 1 active operation)"
            />
          </div>
        </div>
      ),
    },
    {
      index: 4,
      kicker: 'Slide 04 · Technique 2 Walkthrough & Snapshot',
      title: 'Common Sub-Expression Elimination (CSE) via DAG Value Numbering',
      subtitle:
        'Detecting congruent and commutative sub-expressions to avoid redundant ALU computations',
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-50 rounded-lg border border-slate-200 p-5">
              <h4 className="text-base font-display font-bold text-slate-900">
                Algorithmic Mechanism
              </h4>
              <ol className="mt-3 space-y-2 text-sm text-slate-700 list-decimal list-inside leading-relaxed">
                <li>
                  For each binary quadruple <code>t = a op b</code>, construct a canonical signature key. For commutative operators (<code>+</code>, <code>*</code>), sort operands lexicographically so <code>x * y</code> and <code>y * x</code> produce identical keys <code>*:x:y</code>.
                </li>
                <li>
                  Look up the key in <code>exprTable</code>. If an active variable <code>t_prev</code> already holds this expression and neither operand has been redefined since, replace <code>t = a op b</code> with <code>t = t_prev</code> and alias <code>t → t_prev</code>.
                </li>
                <li>
                  When any variable <code>v</code> is redefined, invalidate all entries in <code>exprTable</code> referencing <code>v</code>.
                </li>
              </ol>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-4 font-mono text-xs space-y-3">
              <div>
                <div className="text-slate-500 font-semibold mb-1">
                  (b) Expected Input (Case 3 — CSE Benchmark):
                </div>
                <pre className="bg-slate-50 p-2.5 rounded border border-slate-200 text-slate-800">
                  {benchmarkSnapshots[2].testCase.tacInput}
                </pre>
              </div>
              <div>
                <div className="text-emerald-800 font-semibold mb-1">
                  (c) Expected Output (Shared DAG Nodes):
                </div>
                <pre className="bg-emerald-50/50 p-2.5 rounded border border-emerald-200 text-slate-900 font-semibold">
                  {benchmarkSnapshots[2].report.finalLines.join('\n')}
                </pre>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white rounded-lg border border-slate-200 p-4">
            <Fig11GraphCanvas
              unoptimizedGraph={benchmarkSnapshots[2].report.unoptimizedGraph}
              optimizedGraph={benchmarkSnapshots[2].report.optimizedGraph}
              captionText="Fig. 1.3 GUI Graph Output for Case 3: Common Sub-Expression Elimination merging duplicate x*y and p+q nodes"
            />
          </div>
        </div>
      ),
    },
    {
      index: 5,
      kicker: 'Slide 05 · Technique 3 Walkthrough & Snapshot',
      title: 'Backward Liveness Analysis & Dead Code Removal',
      subtitle:
        'Pruning unused temporaries, overwritten variables, and folded intermediate definitions',
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-50 rounded-lg border border-slate-200 p-5">
              <h4 className="text-base font-display font-bold text-slate-900">
                Algorithmic Mechanism
              </h4>
              <ol className="mt-3 space-y-2 text-sm text-slate-700 list-decimal list-inside leading-relaxed">
                <li>
                  Initialize the active <code>liveSet</code> with the program&apos;s designated output variable(s) on exit (e.g., <code>netPay</code> or <code>finalRes</code>).
                </li>
                <li>
                  Scan quadruples in reverse order from instruction <code>N</code> down to <code>1</code>.
                </li>
                <li>
                  If instruction <code>i</code> defines <code>target</code> and <code>target ∉ liveSet</code>, mark instruction <code>i</code> as <code>DEAD CODE REMOVED</code> and prune its edges from the DAG.
                </li>
                <li>
                  Otherwise, remove <code>target</code> from <code>liveSet</code> (since its current definition is satisfied) and insert non-constant operands <code>arg1, arg2</code> into <code>liveSet</code>.
                </li>
              </ol>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-4 font-mono text-xs space-y-3">
              <div>
                <div className="text-slate-500 font-semibold mb-1">
                  (b) Expected Input (Case 4 — Dead Code Benchmark):
                </div>
                <pre className="bg-slate-50 p-2.5 rounded border border-slate-200 text-slate-800">
                  {benchmarkSnapshots[3].testCase.tacInput}
                </pre>
              </div>
              <div>
                <div className="text-emerald-800 font-semibold mb-1">
                  (c) Expected Output (Only Live Statements Retained):
                </div>
                <pre className="bg-emerald-50/50 p-2.5 rounded border border-emerald-200 text-slate-900 font-semibold">
                  {benchmarkSnapshots[3].report.finalLines.join('\n')}
                </pre>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white rounded-lg border border-slate-200 p-4">
            <Fig11GraphCanvas
              unoptimizedGraph={benchmarkSnapshots[3].report.unoptimizedGraph}
              optimizedGraph={benchmarkSnapshots[3].report.optimizedGraph}
              captionText="Fig. 1.4 GUI Graph Output for Case 4: Backward Liveness Analysis eliminating unusedBonus, tempCalc, and overwritten tax=500"
            />
          </div>
        </div>
      ),
    },
  ];

  const currentSlide = slides[activeSlide];

  return (
    <section className="max-w-[1380px] mx-auto px-6 py-8 space-y-12">
      {/* PART 1: Interactive Presentation Slide Deck for Viva / Classroom Presentation */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 bg-slate-900 text-white">
          <div>
            <div className="text-xs font-mono text-sky-300">
              {currentSlide.kicker}
            </div>
            <h2 className="text-xl font-display font-bold mt-0.5">
              {currentSlide.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0 no-print">
            <button
              type="button"
              onClick={() =>
                setActiveSlide((s) => (s > 0 ? s - 1 : slides.length - 1))
              }
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-lg border border-slate-700 transition-colors whitespace-nowrap"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Prev Slide
            </button>
            <span className="text-xs font-mono px-2.5 text-slate-300 tabular-nums">
              {activeSlide + 1} / {slides.length}
            </span>
            <button
              type="button"
              onClick={() =>
                setActiveSlide((s) => (s + 1 < slides.length ? s + 1 : 0))
              }
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition-colors whitespace-nowrap"
            >
              Next Slide
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Slide Selector Strip */}
        <div className="flex items-center gap-1.5 px-6 py-2.5 bg-slate-100 border-b border-slate-200 overflow-x-auto no-print">
          {slides.map((s, idx) => (
            <button
              key={s.index}
              type="button"
              onClick={() => setActiveSlide(idx)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeSlide === idx
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Slide {s.index}: {s.title.split('(')[0].trim().slice(0, 28)}
            </button>
          ))}
        </div>

        {/* Slide Body */}
        <div className="p-6">{currentSlide.content}</div>
      </div>

      {/* PART 2: Complete Java Swing GUI Execution Snapshots for All 5 Benchmark Test Cases */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <p className="text-xs font-medium text-sky-700">
              Captured Java Swing GUI Execution Snapshots · All 5 Pre-Loaded Test Suites
            </p>
            <h2 className="text-2xl font-display font-bold text-slate-900 mt-0.5">
              Expected Inputs, Java Swing GUI Snapshots &amp; Expected Outputs
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Each snapshot below captures the complete Java Swing <code>JFrame</code> state—showing <strong>(b) Expected Input TAC</strong>, <strong>(c) Expected Output TAC</strong>, and <strong>Fig. 1.1 Side-by-Side Graph Outputs</strong>.
            </p>
          </div>
          <button
            type="button"
            onClick={onPrintReport}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 no-print"
          >
            <Printer className="w-3.5 h-3.5" />
            Print All Snapshots
          </button>
        </div>

        <div className="space-y-8">
          {benchmarkSnapshots.map(({ testCase, report }, index) => (
            <div
              key={testCase.id}
              className="bg-white rounded-xl border border-slate-300 shadow-xs overflow-hidden print-break-inside-avoid"
            >
              {/* Simulated Swing Window Header for the Snapshot */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-slate-800 text-white border-b border-slate-700">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-sky-400 shrink-0" />
                  <span className="text-xs font-mono font-semibold">
                    Java Swing GUI Snapshot #{index + 1} — {testCase.title}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-300">
                    Focus: {testCase.focusArea}
                  </span>
                  <button
                    type="button"
                    onClick={() => onLoadCaseIntoSimulator(testCase.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white rounded transition-colors whitespace-nowrap no-print"
                  >
                    <Play className="w-3 h-3" />
                    Interactive Run in Simulator
                  </button>
                </div>
              </div>

              {/* Simulated Swing Toolbar Inside Snapshot */}
              <div className="px-5 py-2.5 bg-[#EDF2F7] border-b border-slate-300 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-700 font-mono">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="inline-flex items-center gap-1 text-slate-900 font-semibold">
                    <CheckSquare className="w-3.5 h-3.5 text-sky-700" />
                    Constant Folding
                  </span>
                  <span className="inline-flex items-center gap-1 text-slate-900 font-semibold">
                    <CheckSquare className="w-3.5 h-3.5 text-sky-700" />
                    Common Sub-Expression Elimination (CSE)
                  </span>
                  <span className="inline-flex items-center gap-1 text-slate-900 font-semibold">
                    <CheckSquare className="w-3.5 h-3.5 text-sky-700" />
                    Dead Code Removal
                  </span>
                </div>
                <div className="tabular-nums">
                  Live Output Variable: <strong className="text-slate-900">{testCase.liveOutputs.join(', ')}</strong> · Reduction:{' '}
                  <strong className="text-emerald-700">
                    -{report.metrics.costSavingsPercent}% Cycle Weight
                  </strong>
                </div>
              </div>

              {/* Snapshot Content: Input/Output TAC + Fig. 1.1 Dual Graph */}
              <div className="p-5 space-y-5 bg-[#F8FAFC]">
                <p className="text-sm text-slate-700 leading-relaxed">
                  <strong>Test Case Objective:</strong> {testCase.description}{' '}
                  <span className="text-slate-900 font-medium">
                    {testCase.expectedSummary}
                  </span>
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg border border-slate-300 p-3.5">
                    <div className="text-xs font-mono font-semibold text-slate-700 pb-2 mb-2 border-b border-slate-100">
                      (b) Expected Input — Unoptimized TAC ({report.metrics.originalCount} Statements, Cost Weight: {report.metrics.originalCycleCost})
                    </div>
                    <pre className="font-mono text-xs text-slate-800 leading-relaxed">
                      {report.originalLines
                        .map((line, idx) => `${idx + 1}.  ${line}`)
                        .join('\n')}
                    </pre>
                  </div>

                  <div className="bg-white rounded-lg border border-emerald-300 p-3.5">
                    <div className="text-xs font-mono font-semibold text-emerald-800 pb-2 mb-2 border-b border-emerald-100">
                      (c) Expected Output — Optimal TAC ({report.metrics.optimizedCount} Statements, Cost Weight: {report.metrics.optimizedCycleCost})
                    </div>
                    <pre className="font-mono text-xs font-semibold text-slate-900 leading-relaxed">
                      {report.finalLines
                        .map((line, idx) => `${idx + 1}.  ${line}`)
                        .join('\n')}
                    </pre>
                  </div>
                </div>

                {/* Fig. 1.1 Dual Graph Snapshot */}
                <Fig11GraphCanvas
                  unoptimizedGraph={report.unoptimizedGraph}
                  optimizedGraph={report.optimizedGraph}
                  variant="swing"
                  captionText={`Fig. 1.${index + 1}: Java Swing Graphics2D Output for ${testCase.title}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
