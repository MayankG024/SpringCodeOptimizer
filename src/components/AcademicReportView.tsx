import React, { useState } from 'react';
import {
  BENCHMARK_TEST_CASES,
  OptimizationReport,
  runTACOptimization,
} from '../engine/tacOptimizer';
import { FULL_JAVA_SWING_SOURCE_CODE } from '../engine/javaSwingSourceCode';
import { Fig11GraphCanvas } from './Fig11GraphCanvas';
import {
  Play,
  Download,
  Printer,
  Edit3,
  Eye,
  FileCode,
  Sliders,
} from 'lucide-react';

interface StudentMetadata {
  studentName: string;
  rollNumber: string;
  courseTitle: string;
  semester: string;
  facultyName: string;
  institution: string;
}

interface AcademicReportViewProps {
  marksX: number;
  marksY: number;
  marksZ: number;
  onUpdateMarks: (x: number, y: number, z: number) => void;
  primaryReport: OptimizationReport;
  onNavigateTab: (tab: 'report' | 'simulator' | 'snapshots' | 'code') => void;
  onDownloadJava: () => void;
  onPrintReport: () => void;
}

export const AcademicReportView: React.FC<AcademicReportViewProps> = ({
  marksX,
  marksY,
  marksZ,
  onUpdateMarks,
  primaryReport,
  onNavigateTab,
  onDownloadJava,
  onPrintReport,
}) => {
  const [metadata, setMetadata] = useState<StudentMetadata>({
    studentName: 'Mayank Sharma',
    rollNumber: 'CS-2026-042',
    courseTitle: 'CS304: Compiler Design (Undergraduate)',
    semester: 'B.Tech Computer Science & Engineering — Semester VI',
    facultyName: 'Prof. Dept. of Computer Science & Engineering',
    institution: 'Department of Computer Science & Engineering',
  });

  const [isEditingMeta, setIsEditingMeta] = useState<boolean>(false);
  const [showReferenceImage, setShowReferenceImage] = useState<boolean>(false);

  const allBenchmarksComputed = BENCHMARK_TEST_CASES.map((tc) => ({
    testCase: tc,
    report: runTACOptimization(
      tc.tacInput,
      { constantFolding: true, cse: true, deadCodeRemoval: true },
      tc.liveOutputs
    ),
  }));

  return (
    <article className="max-w-[1160px] mx-auto px-6 py-8 space-y-10">
      {/* ===================================================================== */}
      {/* 1. REPORT COVER SHEET & EXECUTIVE HEADER                              */}
      {/* ===================================================================== */}
      <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-xs print-break-inside-avoid">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
              <span>{metadata.courseTitle}</span>
              <span aria-hidden="true">·</span>
              <span>Java Swing GUI Implementation</span>
              <span aria-hidden="true">·</span>
              <span>Max Marks: 10 (X + Y + Z = 10)</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight leading-tight">
              Design GUI-Based Solutions for Intermediate Code Optimization in Java Swing
            </h1>

            <p className="text-base text-slate-600 leading-relaxed pt-1">
              An all-inclusive undergraduate Compiler Design project report implementing{' '}
              <strong className="text-slate-900">Constant Folding</strong>,{' '}
              <strong className="text-slate-900">Common Sub-Expression Elimination (CSE)</strong>, and{' '}
              <strong className="text-slate-900">Dead Code Removal</strong> over Three-Address Code (TAC) and Directed Acyclic Graphs (DAGs).
            </p>
          </div>

          <div className="flex flex-wrap lg:flex-col items-stretch gap-2.5 shrink-0 no-print">
            <button
              type="button"
              onClick={() => onNavigateTab('simulator')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-sky-700 rounded-lg hover:bg-sky-800 transition-colors whitespace-nowrap"
            >
              <Play className="w-3.5 h-3.5" />
              Launch Swing GUI Simulator
            </button>
            <button
              type="button"
              onClick={onDownloadJava}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              Download .java Code
            </button>
            <button
              type="button"
              onClick={() => setIsEditingMeta((v) => !v)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors whitespace-nowrap"
            >
              <Edit3 className="w-3.5 h-3.5" />
              {isEditingMeta ? 'Done Editing Cover Details' : 'Customize Student Cover Details'}
            </button>
          </div>
        </div>

        {/* Editable Student & Course Metadata Strip */}
        {isEditingMeta ? (
          <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 no-print">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Student Name
              </label>
              <input
                type="text"
                value={metadata.studentName}
                onChange={(e) =>
                  setMetadata({ ...metadata, studentName: e.target.value })
                }
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Roll / Registration Number
              </label>
              <input
                type="text"
                value={metadata.rollNumber}
                onChange={(e) =>
                  setMetadata({ ...metadata, rollNumber: e.target.value })
                }
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Course Code &amp; Title
              </label>
              <input
                type="text"
                value={metadata.courseTitle}
                onChange={(e) =>
                  setMetadata({ ...metadata, courseTitle: e.target.value })
                }
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Degree &amp; Semester
              </label>
              <input
                type="text"
                value={metadata.semester}
                onChange={(e) =>
                  setMetadata({ ...metadata, semester: e.target.value })
                }
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Evaluating Faculty
              </label>
              <input
                type="text"
                value={metadata.facultyName}
                onChange={(e) =>
                  setMetadata({ ...metadata, facultyName: e.target.value })
                }
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Department / Institution
              </label>
              <input
                type="text"
                value={metadata.institution}
                onChange={(e) =>
                  setMetadata({ ...metadata, institution: e.target.value })
                }
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded text-slate-900"
              />
            </div>
          </div>
        ) : null}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 text-xs">
          <div>
            <div className="text-slate-500">Submitted By</div>
            <div className="font-semibold text-slate-900 mt-0.5">
              {metadata.studentName} ({metadata.rollNumber})
            </div>
          </div>
          <div>
            <div className="text-slate-500">Program &amp; Semester</div>
            <div className="font-semibold text-slate-900 mt-0.5">
              {metadata.semester}
            </div>
          </div>
          <div>
            <div className="text-slate-500">Evaluating Faculty</div>
            <div className="font-semibold text-slate-900 mt-0.5">
              {metadata.facultyName}
            </div>
          </div>
          <div>
            <div className="text-slate-500">Implementation Stack</div>
            <div className="font-mono font-semibold text-slate-900 mt-0.5">
              Java SE · javax.swing · Graphics2D
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. GRADING SCHEME & RUBRIC ALIGNMENT (X + Y + Z = 10 MARKS)           */}
      {/* ===================================================================== */}
      <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-xs print-break-inside-avoid">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-display font-bold text-slate-900">
              01. Project Grading Scheme &amp; Evaluation Matrix (X + Y + Z = 10 Marks)
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              This project carries <strong>10 marks</strong>. Faculty may adjust the distribution <code className="font-mono">(X, Y, Z)</code> below as deemed fit such that <code className="font-mono">X + Y + Z = 10</code>.
            </p>
          </div>

          {/* Preset Distribution Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg no-print shrink-0">
            <span className="text-[11px] font-medium text-slate-500 px-2 inline-flex items-center gap-1">
              <Sliders className="w-3 h-3" />
              Distribution (X:Y:Z):
            </span>
            {[
              { label: '4 + 3 + 3 = 10', x: 4, y: 3, z: 3 },
              { label: '3 + 4 + 3 = 10', x: 3, y: 4, z: 3 },
              { label: '5 + 3 + 2 = 10', x: 5, y: 3, z: 2 },
            ].map((preset) => {
              const active =
                marksX === preset.x &&
                marksY === preset.y &&
                marksZ === preset.z;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => onUpdateMarks(preset.x, preset.y, preset.z)}
                  className={`px-2.5 py-1 text-xs font-mono font-medium rounded transition-colors whitespace-nowrap ${
                    active
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="overflow-x-auto mt-5">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600 bg-slate-50">
                <th className="py-3 px-4 font-semibold">Grading Criterion (As Specified in Question)</th>
                <th className="py-3 px-4 font-semibold">Variable</th>
                <th className="py-3 px-4 font-semibold text-right">Allocated Marks</th>
                <th className="py-3 px-4 font-semibold">Project Implementation &amp; Verification Evidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 tabular-nums">
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900">
                  Appropriate GUI for input and output as mentioned in the question
                </td>
                <td className="py-3.5 px-4 font-mono font-semibold text-sky-700">
                  X Marks
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-right">
                  {marksX} / 10
                </td>
                <td className="py-3.5 px-4 text-slate-600 leading-relaxed">
                  Implemented using <code>javax.swing.JFrame</code>, <code>JSplitPane</code>, <code>JTextArea</code> (TAC input/output), <code>JCheckBox</code> (choice of optimization technique), <code>JTable</code> (pass trace), and custom <code>GraphCanvasPanel extends JPanel</code> rendering <strong>Fig. 1.1</strong> with anti-aliased <code>Graphics2D</code>.
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900">
                  Expected input and Output as mentioned in the question
                </td>
                <td className="py-3.5 px-4 font-mono font-semibold text-sky-700">
                  Y Marks
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-right">
                  {marksY} / 10
                </td>
                <td className="py-3.5 px-4 text-slate-600 leading-relaxed">
                  Clearly accepts Three-Address Code statements, named edges <code>(A, B, C...)</code>, integer weights, and user technique choice; accurately computes and displays reduced TAC and side-by-side <strong>Fig. 1.1</strong> optimal DAG across 5 benchmark test suites.
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900">
                  Well documented code / Presentation
                </td>
                <td className="py-3.5 px-4 font-mono font-semibold text-sky-700">
                  Z Marks
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-right">
                  {marksZ} / 10
                </td>
                <td className="py-3.5 px-4 text-slate-600 leading-relaxed">
                  Includes full Javadoc class and method documentation in <code>IntermediateCodeOptimizerGUI.java</code>, step-by-step pass explanations, time/space complexity analysis, and presentation slide snapshots.
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="bg-slate-50 border-t-2 border-slate-300 font-mono font-bold text-slate-900 tabular-nums">
                <td className="py-3 px-4">Total Marks (Where X + Y + Z = 10)</td>
                <td className="py-3 px-4 text-sky-800">X + Y + Z</td>
                <td className="py-3 px-4 text-right text-sm">
                  {marksX + marksY + marksZ} / 10
                </td>
                <td className="py-3 px-4 font-sans font-normal text-slate-600">
                  All three evaluation pillars verified with live GUI simulation, snapshots, and compilable Java code.
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 3. FORMAL SPECIFICATION MODELED STRICTLY ON THE FACULTY SAMPLE        */}
      {/* ===================================================================== */}
      <div className="bg-white rounded-xl border-2 border-slate-900 p-8 shadow-xs print-break-inside-avoid">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
          <div>
            <p className="text-xs font-mono text-slate-500">
              Formal Problem Specification · Modeled After Sample Project Format ((a) Objective, (b) Inputs, (c) Outputs &amp; Fig. 1.1)
            </p>
            <h2 className="text-2xl font-display font-bold text-slate-900 mt-1">
              Project-1: Design GUI based solutions for Intermediate Code Optimization:
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setShowReferenceImage((v) => !v)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 transition-colors whitespace-nowrap shrink-0 no-print"
          >
            <Eye className="w-3.5 h-3.5" />
            {showReferenceImage
              ? 'Hide Faculty Sample Reference Image'
              : 'Compare with Faculty Sample Format'}
          </button>
        </div>

        {/* Optional Collapsible Reference Comparison showing the uploaded sample image */}
        {showReferenceImage && (
          <div className="my-5 p-4 bg-slate-50 rounded-lg border border-slate-200 no-print">
            <div className="text-xs font-semibold text-slate-700 mb-2">
              Reference Formatting Sample Provided in Prompt (Showing (a) Objective, (b) Inputs, (c) Outputs, and Fig. 1.1 Graph Layout):
            </div>
            <img
              src="/assets/aistudio/image_8a20946b.png"
              alt="Faculty Sample Project Specification Format showing Objective, Inputs, Outputs, and Fig 1.1 Graph"
              referrerPolicy="no-referrer"
              className="max-h-72 mx-auto rounded border border-slate-300 bg-white p-2 object-contain"
            />
          </div>
        )}

        {/* Unambiguous (a) Objective, (b) Expected Inputs, and (c) Expected Outputs */}
        <div className="mt-6 space-y-5 text-slate-900 leading-relaxed pl-2 sm:pl-6">
          <div className="text-sm sm:text-base">
            <strong className="font-display font-bold text-slate-950">
              (a) Objective:{' '}
            </strong>
            Develop a program in Java using Java Swing components to optimize intermediate Three-Address Code (TAC) and its corresponding dependency graph by applying <strong>Constant Folding</strong>, <strong>Common Sub-Expression Elimination (CSE)</strong>, and <strong>Dead Code Removal</strong>.
          </div>

          <div className="text-sm sm:text-base">
            <strong className="font-display font-bold text-slate-950">
              (b) Expected Inputs:{' '}
            </strong>
            Input a sequence of unoptimized Three-Address Code (TAC) statements (such as arithmetic assignments <code>t1 = 4 * 7</code>, <code>t2 = a + b</code>, <code>t4 = a + b</code>, and intermediate temporaries) and construct a directed dependency graph using appropriate Java Swing components as shown in <strong>Fig. 1.1</strong>. Assign names to the dependency edges (<code>A, B, C, ...</code>) and instruction execution weights (in integer format: <code>28</code> for division, <code>24</code> for multiplication, <code>16</code> for subtraction, <code>14</code> for addition, and <code>10</code> for assignment). The user should then input a choice of optimization technique(s) (<strong>Constant Folding</strong> / <strong>Common Sub-Expression Elimination</strong> / <strong>Dead Code Removal</strong>) and specify the live output variable.
          </div>

          <div className="text-sm sm:text-base">
            <strong className="font-display font-bold text-slate-950">
              (c) Expected Outputs:{' '}
            </strong>
            The program should compute and display the optimal intermediate code solution (reduced Three-Address Code statements, quadruple pass transformation table, and the pruned Directed Acyclic Graph with minimum total execution weight) for the chosen optimization technique(s) using Java Swing components as shown in <strong>Fig. 1.1</strong>.
          </div>
        </div>

        {/* Fig. 1.1 Side-by-Side Graph & Optimal DAG Solution */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <Fig11GraphCanvas
            unoptimizedGraph={primaryReport.unoptimizedGraph}
            optimizedGraph={primaryReport.optimizedGraph}
            captionText="Fig. 1.1 Unoptimized Intermediate Code Dependency Graph and its Optimal Reduced DAG Solution"
          />
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 4. THEORETICAL FRAMEWORK & ALGORITHMIC DESIGN                         */}
      {/* ===================================================================== */}
      <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-xs space-y-8 print-break-inside-avoid">
        <div className="border-b border-slate-200 pb-4">
          <h2 className="text-xl font-display font-bold text-slate-900">
            02. Theoretical Framework &amp; Compiler Optimization Algorithms
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Machine-independent code improving transformations applied on Three-Address Code (TAC) quadruples and Directed Acyclic Graphs (DAGs).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Technique 1 */}
          <div className="p-5 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono font-semibold text-sky-800">
                TECHNIQUE 01
              </div>
              <h3 className="text-base font-display font-bold text-slate-900 mt-1">
                Constant Folding &amp; Propagation
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Deduces at compile time that the value of an expression is a constant and replaces the arithmetic operation with the literal result, avoiding runtime ALU execution.
              </p>
              <div className="mt-3 pt-3 border-t border-slate-200 font-mono text-xs space-y-1 text-slate-800">
                <div className="text-slate-500">Before:</div>
                <div>t1 = 4 * 7 (Weight: 24)</div>
                <div>t5 = t1 + t2 (Weight: 14)</div>
                <div className="text-emerald-700 font-semibold pt-1">After Folding &amp; Propagation:</div>
                <div>t1 = 28 (Weight: 10)</div>
                <div>t5 = 28 + t2 (Weight: 14)</div>
              </div>
            </div>
            <div className="mt-4 pt-2.5 border-t border-slate-200 text-[11px] font-mono text-slate-500">
              Time Complexity: O(N) single pass via HashMap
            </div>
          </div>

          {/* Technique 2 */}
          <div className="p-5 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono font-semibold text-sky-800">
                TECHNIQUE 02
              </div>
              <h3 className="text-base font-display font-bold text-slate-900 mt-1">
                Common Sub-Expression Elimination
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                An occurrence of an expression <code>E = arg1 op arg2</code> is a common sub-expression if <code>E</code> was previously computed and neither <code>arg1</code> nor <code>arg2</code> has been redefined since.
              </p>
              <div className="mt-3 pt-3 border-t border-slate-200 font-mono text-xs space-y-1 text-slate-800">
                <div className="text-slate-500">Before:</div>
                <div>t2 = a + b (Weight: 14)</div>
                <div>t4 = a + b (Weight: 14)</div>
                <div>finalRes = t5 + t4</div>
                <div className="text-amber-700 font-semibold pt-1">After CSE (DAG Sharing):</div>
                <div>t2 = a + b (Weight: 14)</div>
                <div>t4 = t2 (Alias → t2)</div>
                <div>finalRes = t5 + t2</div>
              </div>
            </div>
            <div className="mt-4 pt-2.5 border-t border-slate-200 text-[11px] font-mono text-slate-500">
              Time Complexity: O(N) via Canonical Value Numbering
            </div>
          </div>

          {/* Technique 3 */}
          <div className="p-5 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono font-semibold text-sky-800">
                TECHNIQUE 03
              </div>
              <h3 className="text-base font-display font-bold text-slate-900 mt-1">
                Dead Code Removal (Liveness)
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                A variable is <strong>dead</strong> at a point in a program if its value is never used subsequently, or if it is overwritten before being read. Backward liveness traversal prunes dead statements.
              </p>
              <div className="mt-3 pt-3 border-t border-slate-200 font-mono text-xs space-y-1 text-slate-800">
                <div className="text-slate-500">Before:</div>
                <div>t3 = 75 (Never used in finalRes)</div>
                <div>debugTemp = 150 (Dead temp)</div>
                <div>t4 = t2 (Superseded by alias)</div>
                <div className="text-rose-700 font-semibold pt-1">After Backward Liveness:</div>
                <div>All 3 dead assignments eliminated</div>
              </div>
            </div>
            <div className="mt-4 pt-2.5 border-t border-slate-200 text-[11px] font-mono text-slate-500">
              Time Complexity: O(N) Reverse Data-Flow Scan
            </div>
          </div>
        </div>

        {/* Java Swing Component Mapping Table */}
        <div className="pt-4">
          <h3 className="text-base font-display font-bold text-slate-900 mb-3">
            Java Swing Component Architecture &amp; Event Handling Mapping
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                  <th className="py-2.5 px-3 font-semibold">Swing Class / Component</th>
                  <th className="py-2.5 px-3 font-semibold">Instance Identifier</th>
                  <th className="py-2.5 px-3 font-semibold">Role in Compiler Optimizer GUI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="py-2.5 px-3 font-mono font-semibold text-slate-900">javax.swing.JFrame</td>
                  <td className="py-2.5 px-3 font-mono text-sky-800">IntermediateCodeOptimizerGUI</td>
                  <td className="py-2.5 px-3 text-slate-600">Top-level desktop window managing BorderLayout and event dispatch thread (SwingUtilities.invokeLater).</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono font-semibold text-slate-900">javax.swing.JTextArea</td>
                  <td className="py-2.5 px-3 font-mono text-sky-800">inputTacArea, outputTacArea</td>
                  <td className="py-2.5 px-3 text-slate-600">Monospaced multi-line editors for entering (b) Expected Input TAC and displaying (c) Expected Output TAC.</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono font-semibold text-slate-900">javax.swing.JCheckBox</td>
                  <td className="py-2.5 px-3 font-mono text-sky-800">chkConstantFolding, chkCSE, chkDeadCode</td>
                  <td className="py-2.5 px-3 text-slate-600">Interactive user choice controls to enable/disable Constant Folding, CSE, and Dead Code Removal independently.</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono font-semibold text-slate-900">javax.swing.JPanel (Graphics2D)</td>
                  <td className="py-2.5 px-3 font-mono text-sky-800">beforeGraphPanel, afterGraphPanel</td>
                  <td className="py-2.5 px-3 text-slate-600">Overrides paintComponent(Graphics g) with anti-aliasing to draw Fig. 1.1 numbered circular vertices and integer-weighted edges.</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono font-semibold text-slate-900">javax.swing.JTable</td>
                  <td className="py-2.5 px-3 font-mono text-sky-800">traceTable (DefaultTableModel)</td>
                  <td className="py-2.5 px-3 text-slate-600">Displays the quadruple structure (Target, Arg1, Op, Arg2, Weight, Pass Status, and Compiler Explanation).</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 5. EXPECTED INPUTS & EXPECTED OUTPUTS ACROSS ALL BENCHMARK CASES      */}
      {/* ===================================================================== */}
      <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl font-display font-bold text-slate-900">
              03. Verified Expected Inputs &amp; Outputs (Benchmark Test Suites 1–5)
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Complete input/output verification tables and quantitative cycle cost reductions across all optimization techniques.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('snapshots')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg border border-sky-200 transition-colors whitespace-nowrap shrink-0 no-print"
          >
            View All GUI Presentation Snapshots →
          </button>
        </div>

        <div className="space-y-6">
          {allBenchmarksComputed.map(({ testCase, report }, idx) => (
            <div
              key={testCase.id}
              className="rounded-lg border border-slate-200 p-5 bg-slate-50/60 print-break-inside-avoid"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2 pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-sm font-display font-bold text-slate-900">
                    {testCase.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {testCase.description}
                  </p>
                </div>
                <div className="text-xs font-mono text-slate-700 tabular-nums shrink-0">
                  Statements: <strong>{report.metrics.originalCount} → {report.metrics.optimizedCount}</strong> · Graph Weight: <strong>{report.metrics.originalCycleCost} → {report.metrics.optimizedCycleCost} (-{report.metrics.costSavingsPercent}%)</strong>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-white rounded border border-slate-200 p-3">
                  <div className="text-[11px] font-mono font-semibold text-slate-500 mb-1.5">
                    (b) Expected Input (Three-Address Code &amp; Live Var: {testCase.liveOutputs.join(', ')})
                  </div>
                  <pre className="font-mono text-xs text-slate-800 leading-relaxed">
                    {report.originalLines
                      .map((line, i) => `${i + 1}.  ${line}`)
                      .join('\n')}
                  </pre>
                </div>

                <div className="bg-white rounded border border-emerald-200 p-3">
                  <div className="text-[11px] font-mono font-semibold text-emerald-800 mb-1.5">
                    (c) Expected Output (Optimal Reduced Three-Address Code)
                  </div>
                  <pre className="font-mono text-xs font-semibold text-slate-900 leading-relaxed">
                    {report.finalLines
                      .map((line, i) => `${i + 1}.  ${line}`)
                      .join('\n')}
                  </pre>
                  <div className="mt-2.5 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                    {testCase.expectedSummary}
                  </div>
                </div>
              </div>

              {/* Show detailed Quadruple Trace Table for Benchmark 1 in the main report */}
              {idx === 0 && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="text-xs font-semibold text-slate-800 mb-2">
                    Step-by-Step Quadruple Transformation Table for Case 1:
                  </div>
                  <div className="overflow-x-auto bg-white rounded border border-slate-200">
                    <table className="w-full text-left border-collapse text-xs font-mono tabular-nums">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-200 text-slate-700">
                          <th className="py-2 px-3">#</th>
                          <th className="py-2 px-3">Input Statement</th>
                          <th className="py-2 px-3">Transformed Quadruple</th>
                          <th className="py-2 px-3 text-right">Weight</th>
                          <th className="py-2 px-3">Optimization Pass Action</th>
                          <th className="py-2 px-3 font-sans">Explanation</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {report.passLogs[report.passLogs.length - 1].quadruples.map(
                          (q, qIdx) => (
                            <tr
                              key={q.index}
                              className={
                                q.status === 'dead_removed'
                                  ? 'text-slate-400 bg-rose-50/30'
                                  : 'text-slate-900'
                              }
                            >
                              <td className="py-2 px-3">{q.index}</td>
                              <td className="py-2 px-3">
                                {report.originalLines[qIdx]}
                              </td>
                              <td className="py-2 px-3 font-semibold">{q.raw}</td>
                              <td className="py-2 px-3 text-right">{q.cost}</td>
                              <td className="py-2 px-3 font-semibold">
                                {q.statusTag}
                              </td>
                              <td className="py-2 px-3 font-sans text-slate-600">
                                {q.explanation}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 6. COMPLETE JAVA SWING SOURCE CODE LISTING IN REPORT                  */}
      {/* ===================================================================== */}
      <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-xs space-y-5 print-page-break">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl font-display font-bold text-slate-900">
              04. Complete Java Swing Source Code (IntermediateCodeOptimizerGUI.java)
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Well-documented Java implementation with Javadoc comments, ready for compilation (<code>javac IntermediateCodeOptimizerGUI.java</code>).
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 no-print">
            <button
              type="button"
              onClick={() => onNavigateTab('code')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 transition-colors whitespace-nowrap"
            >
              <FileCode className="w-3.5 h-3.5" />
              Open Modular Code Inspector
            </button>
            <button
              type="button"
              onClick={onDownloadJava}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              Download .java
            </button>
          </div>
        </div>

        <div className="bg-slate-950 text-slate-100 rounded-lg p-5 overflow-x-auto max-h-[540px] print:max-h-none print:bg-slate-50 print:text-slate-900 print:border print:border-slate-300">
          <pre className="font-mono text-[11px] leading-relaxed">
            {FULL_JAVA_SWING_SOURCE_CODE}
          </pre>
        </div>

        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-600 no-print">
          <span>
            Ready for classroom submission, faculty evaluation, or PDF report printing.
          </span>
          <button
            type="button"
            onClick={onPrintReport}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / Save Complete Report as PDF
          </button>
        </div>
      </div>
    </article>
  );
};
