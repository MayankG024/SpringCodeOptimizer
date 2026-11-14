import React from 'react';
import { FigGraphData } from '../engine/tacOptimizer';

interface Fig11GraphCanvasProps {
  unoptimizedGraph: FigGraphData;
  optimizedGraph: FigGraphData;
  captionText?: string;
  showEdgeLetters?: boolean;
  variant?: 'textbook' | 'swing';
}

const SingleFigGraph: React.FC<{
  graph: FigGraphData;
  labelPrefix: string;
  showEdgeLetters: boolean;
  variant: 'textbook' | 'swing';
}> = ({ graph, labelPrefix, showEdgeLetters, variant }) => {
  const nodeMap = new Map(graph.nodes.map((n) => [n.id, n]));

  return (
    <div
      className={`flex flex-col justify-between rounded-lg border ${
        variant === 'swing'
          ? 'bg-white border-slate-300 shadow-xs'
          : 'bg-white border-slate-200'
      } p-4`}
    >
      <div className="flex items-baseline justify-between gap-4 border-b border-slate-100 pb-2.5 mb-2">
        <div>
          <h4 className="text-sm font-semibold text-slate-900">
            {labelPrefix}: {graph.title}
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">{graph.subtitle}</p>
        </div>
        <div className="text-right shrink-0">
          <span className="text-xs font-mono text-slate-600 tabular-nums">
            Total Weight: <strong className="text-slate-900">{graph.totalWeight}</strong>
          </span>
        </div>
      </div>

      <div className="relative flex items-center justify-center">
        <svg
          viewBox="0 0 360 325"
          className="w-full max-w-[360px] h-[275px] select-none overflow-visible"
          role="img"
          aria-label={graph.title}
        >
          <defs>
            <marker
              id={`arrow-${labelPrefix.replace(/\s+/g, '')}`}
              markerWidth="7"
              markerHeight="7"
              refX="23"
              refY="3.5"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M0,0 L7,3.5 L0,7 Z" fill="#475569" />
            </marker>
          </defs>

          {/* Edges */}
          {graph.edges.map((edge, idx) => {
            const fromNode = nodeMap.get(edge.from);
            const toNode = nodeMap.get(edge.to);
            if (!fromNode || !toNode) return null;

            const midX = (fromNode.x + toNode.x) / 2;
            const midY = (fromNode.y + toNode.y) / 2;

            // Offset perpendicular to edge for clean label placement (like Fig 1.1)
            const dx = toNode.x - fromNode.x;
            const dy = toNode.y - fromNode.y;
            const len = Math.hypot(dx, dy) || 1;
            const normX = -dy / len;
            const normY = dx / len;
            const offsetDist = idx % 2 === 0 ? 13 : -13;
            const labelX = midX + normX * offsetDist;
            const labelY = midY + normY * offsetDist;

            return (
              <g key={edge.id}>
                <line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke="#334155"
                  strokeWidth="1.5"
                  markerEnd={`url(#arrow-${labelPrefix.replace(/\s+/g, '')})`}
                />
                <rect
                  x={labelX - 18}
                  y={labelY - 9}
                  width="36"
                  height="16"
                  rx="3"
                  fill="#FFFFFF"
                  fillOpacity="0.92"
                />
                <text
                  x={labelX}
                  y={labelY + 3}
                  textAnchor="middle"
                  className="text-[12px] font-serif font-semibold fill-slate-900 tabular-nums"
                >
                  {showEdgeLetters ? `${edge.edgeName}:${edge.weight}` : edge.weight}
                </text>
              </g>
            );
          })}

          {/* Vertices (Numbered Circles 1..N matching Fig 1.1) */}
          {graph.nodes.map((node) => {
            const strokeColor =
              node.kind === 'output'
                ? '#0284C7'
                : node.kind === 'folded'
                ? '#059669'
                : '#1E293B';

            return (
              <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                <circle
                  r="17"
                  fill="#FFFFFF"
                  stroke={strokeColor}
                  strokeWidth={node.kind === 'output' ? '2.2' : '1.6'}
                />
                <text
                  y="5"
                  textAnchor="middle"
                  className="text-[15px] font-serif font-semibold fill-slate-900 tabular-nums"
                >
                  {node.id}
                </text>
                <g transform="translate(0, 28)">
                  <rect
                    x="-34"
                    y="-10"
                    width="68"
                    height="15"
                    rx="2"
                    fill="#F8FAFC"
                    stroke="#E2E8F0"
                    strokeWidth="0.75"
                  />
                  <text
                    y="1"
                    textAnchor="middle"
                    className="text-[10px] font-mono font-medium fill-sky-800"
                  >
                    {node.codeLabel}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Vertex Legend mapping Vertex 1..N to TAC symbol/instruction */}
      <div className="mt-2 pt-2.5 border-t border-slate-100">
        <div className="text-[11px] font-medium text-slate-500 mb-1.5">
          Vertex Mapping (Numbered Nodes 1–{graph.nodes.length}):
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-slate-700">
          {graph.nodes.map((n, i) => (
            <React.Fragment key={n.id}>
              <span>
                <strong className="text-slate-900">({n.id})</strong> {n.detail}
              </span>
              {i < graph.nodes.length - 1 && (
                <span className="text-slate-300" aria-hidden="true">
                  ·
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Fig11GraphCanvas: React.FC<Fig11GraphCanvasProps> = ({
  unoptimizedGraph,
  optimizedGraph,
  captionText = 'Fig. 1.1 Unoptimized Three-Address Code Dependency Graph and its Optimal Reduced DAG Solution',
  showEdgeLetters = true,
  variant = 'textbook',
}) => {
  return (
    <div className="print-break-inside-avoid">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <SingleFigGraph
          graph={unoptimizedGraph}
          labelPrefix="(a) Initial Graph"
          showEdgeLetters={showEdgeLetters}
          variant={variant}
        />
        <SingleFigGraph
          graph={optimizedGraph}
          labelPrefix="(b) Optimal DAG"
          showEdgeLetters={showEdgeLetters}
          variant={variant}
        />
      </div>
      {captionText && (
        <p className="text-center font-display font-semibold text-sm text-slate-900 mt-3">
          {captionText}
        </p>
      )}
    </div>
  );
};
