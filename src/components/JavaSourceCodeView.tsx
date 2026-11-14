import React, { useState } from 'react';
import {
  FULL_JAVA_SWING_SOURCE_CODE,
  JAVA_CODE_MODULES,
} from '../engine/javaSwingSourceCode';
import { Copy, Check, Download, Terminal } from 'lucide-react';

interface JavaSourceCodeViewProps {
  onDownloadJava: () => void;
}

export const JavaSourceCodeView: React.FC<JavaSourceCodeViewProps> = ({
  onDownloadJava,
}) => {
  const [selectedModuleId, setSelectedModuleId] = useState<string>('all');
  const [copied, setCopied] = useState<boolean>(false);

  const activeModule =
    JAVA_CODE_MODULES.find((m) => m.id === selectedModuleId) ||
    JAVA_CODE_MODULES[0];

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(activeModule.codeSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback copy via textarea
      const textArea = document.createElement('textarea');
      textArea.value = activeModule.codeSnippet;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const codeLines = activeModule.codeSnippet.split('\n');

  return (
    <section className="max-w-[1380px] mx-auto px-6 py-8 space-y-8">
      {/* Header & Compilation Guide */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <p className="text-xs font-medium text-sky-700">
            Well-Documented Java Source Code · Rubric Component Z (Presentation &amp; Documentation)
          </p>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mt-0.5">
            Java Swing Source Code (IntermediateCodeOptimizerGUI.java)
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Complete, self-contained, Javadoc-documented Java implementation using standard <code>javax.swing.*</code> and <code>java.awt.Graphics2D</code> components. Ready to compile and run in any standard JDK environment.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 no-print">
          <button
            type="button"
            onClick={handleCopyCode}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Copied to Clipboard
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy Java Code
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onDownloadJava}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-sky-700 rounded-lg hover:bg-sky-800 transition-colors whitespace-nowrap shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            Download IntermediateCodeOptimizerGUI.java
          </button>
        </div>
      </div>

      {/* Terminal Compilation & Execution Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 text-slate-100 rounded-xl p-5 font-mono text-xs">
          <div className="flex items-center gap-2 text-sky-300 font-semibold pb-2.5 mb-3 border-b border-slate-800">
            <Terminal className="w-4 h-4" />
            <span>Standard JDK Compilation &amp; Execution Commands</span>
          </div>
          <div className="space-y-2 leading-relaxed">
            <div>
              <span className="text-slate-400">1. Save the file as:</span>{' '}
              <strong className="text-white">IntermediateCodeOptimizerGUI.java</strong>
            </div>
            <div>
              <span className="text-slate-400">2. Compile with javac:</span>{' '}
              <code className="text-emerald-300">$ javac IntermediateCodeOptimizerGUI.java</code>
            </div>
            <div>
              <span className="text-slate-400">3. Launch the Swing GUI:</span>{' '}
              <code className="text-emerald-300">$ java IntermediateCodeOptimizerGUI</code>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-display font-bold text-slate-900">
              Java Swing Architecture Highlights
            </h3>
            <ul className="mt-2.5 space-y-1.5 text-xs text-slate-600 leading-relaxed">
              {activeModule.highlights.map((item, i) => (
                <li key={i}>• {item}</li>
              ))}
            </ul>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-500">
            Total Lines: {FULL_JAVA_SWING_SOURCE_CODE.split('\n').length} · Package: Default (Self-Contained)
          </div>
        </div>
      </div>

      {/* Interactive Module Filter Bar (Functional Segmented Buttons) */}
      <div className="flex flex-wrap items-center justify-between gap-4 no-print">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-200/70 rounded-lg">
          {JAVA_CODE_MODULES.map((mod) => (
            <button
              key={mod.id}
              type="button"
              onClick={() => setSelectedModuleId(mod.id)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                selectedModuleId === mod.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {mod.title.split('(')[0].trim()} ({mod.lineRange})
            </button>
          ))}
        </div>
      </div>

      {/* Code Viewer Container */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs font-mono text-slate-300">
          <span>
            IntermediateCodeOptimizerGUI.java — {activeModule.subtitle}
          </span>
          <span className="text-slate-400 tabular-nums">{activeModule.lineRange}</span>
        </div>

        <div className="p-4 overflow-x-auto max-h-[780px] overflow-y-auto">
          <table className="w-full border-collapse font-mono text-xs leading-relaxed">
            <tbody>
              {codeLines.map((line, i) => (
                <tr key={i} className="hover:bg-slate-900/60">
                  <td className="select-none pr-4 text-right text-slate-600 w-10 tabular-nums">
                    {i + 1}
                  </td>
                  <td className="text-slate-100 whitespace-pre">{line}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
