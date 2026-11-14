/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import {
  BENCHMARK_TEST_CASES,
  OptimizationOptions,
  runTACOptimization,
} from './engine/tacOptimizer';
import { FULL_JAVA_SWING_SOURCE_CODE } from './engine/javaSwingSourceCode';
import { AcademicReportView } from './components/AcademicReportView';
import { JavaSwingSimulator } from './components/JavaSwingSimulator';
import { PresentationSnapshotsView } from './components/PresentationSnapshotsView';
import { JavaSourceCodeView } from './components/JavaSourceCodeView';

type ActiveTab = 'report' | 'simulator' | 'snapshots' | 'code';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('report');

  // Grading scheme marks X + Y + Z = 10
  const [marksX, setMarksX] = useState<number>(4);
  const [marksY, setMarksY] = useState<number>(3);
  const [marksZ, setMarksZ] = useState<number>(3);

  // Simulator state initialized with Benchmark Case 1
  const [activePresetId, setActivePresetId] = useState<string>(
    BENCHMARK_TEST_CASES[0].id
  );
  const [tacInput, setTacInput] = useState<string>(
    BENCHMARK_TEST_CASES[0].tacInput
  );
  const [liveOutputVar, setLiveOutputVar] = useState<string>(
    BENCHMARK_TEST_CASES[0].liveOutputs[0]
  );
  const [options, setOptions] = useState<OptimizationOptions>({
    constantFolding: true,
    cse: true,
    deadCodeRemoval: true,
  });

  const currentReport = useMemo(() => {
    const liveVars = liveOutputVar
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    return runTACOptimization(tacInput, options, liveVars);
  }, [tacInput, options, liveOutputVar]);

  const handleSelectPreset = (presetId: string) => {
    const found = BENCHMARK_TEST_CASES.find((b) => b.id === presetId);
    if (!found) return;
    setActivePresetId(found.id);
    setTacInput(found.tacInput);
    setLiveOutputVar(found.liveOutputs.join(', '));
  };

  const handleLoadCaseIntoSimulator = (presetId: string) => {
    handleSelectPreset(presetId);
    setActiveTab('simulator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateMarks = (x: number, y: number, z: number) => {
    setMarksX(x);
    setMarksY(y);
    setMarksZ(z);
  };

  const handleDownloadJava = () => {
    const blob = new Blob([FULL_JAVA_SWING_SOURCE_CODE], {
      type: 'text/x-java-source;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'IntermediateCodeOptimizerGUI.java';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-8 px-6 py-4 bg-white/95 backdrop-blur-xs border-b border-slate-200 no-print">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#report"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('report');
          }}
          className="text-lg font-display font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
        >
          CompilerOpt Java Swing Report
        </a>

        {/* Zone 2: 4 concise single-line text navigation links */}
        <nav
          aria-label="Primary Navigation"
          className="flex items-center gap-6 text-sm font-medium text-slate-600 overflow-x-auto"
        >
          <a
            href="#report"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('report');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-4 ${
              activeTab === 'report'
                ? 'text-slate-950 font-semibold underline'
                : 'hover:text-slate-900'
            }`}
          >
            Project Report
          </a>
          <a
            href="#simulator"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('simulator');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-4 ${
              activeTab === 'simulator'
                ? 'text-slate-950 font-semibold underline'
                : 'hover:text-slate-900'
            }`}
          >
            Swing Simulator
          </a>
          <a
            href="#snapshots"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('snapshots');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-4 ${
              activeTab === 'snapshots'
                ? 'text-slate-950 font-semibold underline'
                : 'hover:text-slate-900'
            }`}
          >
            Presentation Snapshots
          </a>
          <a
            href="#code"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('code');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-4 ${
              activeTab === 'code'
                ? 'text-slate-950 font-semibold underline'
                : 'hover:text-slate-900'
            }`}
          >
            Java Code
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={handlePrintReport}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
          >
            Print / Export PDF
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'report' && (
          <AcademicReportView
            marksX={marksX}
            marksY={marksY}
            marksZ={marksZ}
            onUpdateMarks={handleUpdateMarks}
            primaryReport={currentReport}
            onNavigateTab={setActiveTab}
            onDownloadJava={handleDownloadJava}
            onPrintReport={handlePrintReport}
          />
        )}

        {activeTab === 'simulator' && (
          <JavaSwingSimulator
            tacInput={tacInput}
            setTacInput={setTacInput}
            liveOutputVar={liveOutputVar}
            setLiveOutputVar={setLiveOutputVar}
            options={options}
            setOptions={setOptions}
            report={currentReport}
            activePresetId={activePresetId}
            onSelectPreset={handleSelectPreset}
            onDownloadJava={handleDownloadJava}
          />
        )}

        {activeTab === 'snapshots' && (
          <PresentationSnapshotsView
            marksX={marksX}
            marksY={marksY}
            marksZ={marksZ}
            onLoadCaseIntoSimulator={handleLoadCaseIntoSimulator}
            onPrintReport={handlePrintReport}
          />
        )}

        {activeTab === 'code' && (
          <JavaSourceCodeView onDownloadJava={handleDownloadJava} />
        )}
      </main>

      {/* Quiet Academic Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 px-6 text-xs text-slate-500 no-print">
        <div className="max-w-[1380px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            Undergraduate Compiler Design Project Report · Intermediate Code Optimization in Java Swing
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleDownloadJava}
              className="text-slate-700 hover:text-slate-950 hover:underline font-medium"
            >
              Download IntermediateCodeOptimizerGUI.java
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={handlePrintReport}
              className="text-slate-700 hover:text-slate-950 hover:underline font-medium"
            >
              Print Complete Report
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
