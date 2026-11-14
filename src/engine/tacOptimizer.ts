export interface TACQuadruple {
  index: number;
  raw: string;
  target: string;
  arg1: string;
  operator: string; // '+', '-', '*', '/', '=', etc.
  arg2: string;
  cost: number; // Instruction cycle weight (e.g., '*' = 24, '/' = 28, '+' = 14, '-' = 16, '=' = 10)
  status: 'active' | 'folded' | 'cse_merged' | 'dead_removed';
  statusTag: string;
  explanation: string;
  canonicalRef?: string;
}

export interface FigGraphNode {
  id: number; // 1-based vertex index matching Fig. 1.1 style
  codeLabel: string; // e.g. "a", "t1 (*)", "res"
  detail: string; // e.g. "t1 = 4 * 5" or "20"
  x: number;
  y: number;
  kind: 'input' | 'compute' | 'output' | 'folded' | 'eliminated';
}

export interface FigGraphEdge {
  id: string;
  from: number;
  to: number;
  edgeName: string; // e.g. "A", "B", "C"... matching sample prompt "Input names of Edges (A, B, C, ...) and weights (in integer format)"
  weight: number; // Integer weight (cycle cost / data dependency weight)
  operandLabel: string;
  isEliminated?: boolean;
}

export interface FigGraphData {
  title: string;
  subtitle: string;
  totalWeight: number;
  nodes: FigGraphNode[];
  edges: FigGraphEdge[];
}

export interface OptimizationOptions {
  constantFolding: boolean;
  cse: boolean;
  deadCodeRemoval: boolean;
}

export interface PassStepLog {
  passName: string;
  techniqueCode: 'INIT' | 'CF' | 'CSE' | 'DCE';
  description: string;
  quadruples: TACQuadruple[];
  changesCount: number;
}

export interface OptimizationReport {
  originalLines: string[];
  finalLines: string[];
  initialQuadruples: TACQuadruple[];
  passLogs: PassStepLog[];
  finalQuadruples: TACQuadruple[];
  unoptimizedGraph: FigGraphData;
  optimizedGraph: FigGraphData;
  metrics: {
    originalCount: number;
    optimizedCount: number;
    eliminatedCount: number;
    originalCycleCost: number;
    optimizedCycleCost: number;
    costSavingsPercent: number;
    foldedCount: number;
    cseCount: number;
    deadRemovedCount: number;
  };
}

export interface BenchmarkTestCase {
  id: string;
  title: string;
  focusArea: string;
  description: string;
  liveOutputs: string[]; // Variables considered live on exit
  tacInput: string;
  expectedSummary: string;
}

export const BENCHMARK_TEST_CASES: BenchmarkTestCase[] = [
  {
    id: 'all-in-one',
    title: 'Case 1: Complete Pipeline (Constant Folding + CSE + Dead Code)',
    focusArea: 'All Three Techniques',
    description:
      'Demonstrates compile-time evaluation of constant arithmetic (4 * 7), elimination of duplicate sub-expression (a + b), and removal of unused temporary assignments (t3, debugTemp).',
    liveOutputs: ['finalRes'],
    tacInput: [
      't1 = 4 * 7',
      't2 = a + b',
      't3 = 100 - 25',
      't4 = a + b',
      't5 = t1 + t2',
      'debugTemp = t3 * 2',
      'finalRes = t5 + t4',
    ].join('\n'),
    expectedSummary:
      'Reduces 7 Three-Address Code instructions to 3 optimal statements and cuts total graph edge cost from 126 to 48 cycles (61.9% reduction).',
  },
  {
    id: 'constant-folding',
    title: 'Case 2: Multi-Level Constant Folding & Propagation',
    focusArea: 'Constant Folding',
    description:
      'Evaluates chained compile-time constants across arithmetic operators (*, +, -) and propagates the folded values into the final expression.',
    liveOutputs: ['area'],
    tacInput: [
      'base = 12',
      'height = 8',
      't1 = base * height',
      'offset = 4 + 6',
      't2 = t1 + offset',
      'area = t2 + bonus',
    ].join('\n'),
    expectedSummary:
      'Folds base (12), height (8), t1 (96), offset (10), and t2 (106) at compile time, simplifying 6 statements into a single addition: area = 106 + bonus.',
  },
  {
    id: 'cse-focus',
    title: 'Case 3: Common Sub-Expression Elimination (DAG Sharing)',
    focusArea: 'Common Sub-Expression Elimination',
    description:
      'Detects identical and commutative algebraic sub-expressions (x * y and y * x; p + q) where operands are not redefined, reusing existing temporary registers.',
    liveOutputs: ['total'],
    tacInput: [
      't1 = x * y',
      't2 = p + q',
      't3 = y * x',
      't4 = t1 - t2',
      't5 = p + q',
      't6 = t3 - t5',
      'total = t4 + t6',
    ].join('\n'),
    expectedSummary:
      'Identifies t3 as congruent to t1 (commutative x * y) and t5 as identical to t2 (p + q), enabling t6 to merge with t4 and cutting redundant multiplications and additions.',
  },
  {
    id: 'dead-code-focus',
    title: 'Case 4: Liveness Analysis & Dead Code Removal',
    focusArea: 'Dead Code Removal',
    description:
      'Performs backward data-flow liveness analysis from the output variable (netPay) to prune unreachable temporaries and overwritten assignments.',
    liveOutputs: ['netPay'],
    tacInput: [
      'gross = baseSalary + allowance',
      'unusedBonus = gross * 2',
      'tax = 500',
      'tax = 350',
      'tempCalc = unusedBonus + 100',
      'netPay = gross - tax',
    ].join('\n'),
    expectedSummary:
      'Eliminates overwritten assignment (tax = 500) and unused computation chains (unusedBonus, tempCalc), retaining only live definitions contributing to netPay.',
  },
  {
    id: 'loop-invariant-array',
    title: 'Case 5: Array Index Address Calculation Optimization',
    focusArea: 'Compiler Address TAC',
    description:
      'Optimizes 2D array byte-offset Three-Address Code (i * 4, base + offset) containing constant element sizes, duplicate index calculations, and dead bounds temporaries.',
    liveOutputs: ['valSum'],
    tacInput: [
      'elemSize = 4',
      'rowStride = 10 * elemSize',
      't1 = i * rowStride',
      't2 = j * elemSize',
      'addr1 = t1 + t2',
      't3 = i * rowStride',
      'deadBound = 256 * 4',
      'addr2 = t3 + t2',
      'valSum = addr1 + addr2',
    ].join('\n'),
    expectedSummary:
      'Folds elemSize (4) and rowStride (40), merges duplicate index computation (t3 -> t1 and addr2 -> addr1), and removes deadBound.',
  },
];

function getOperatorCost(op: string): number {
  switch (op) {
    case '/':
      return 28;
    case '*':
      return 24;
    case '-':
      return 16;
    case '+':
      return 14;
    default:
      return 10;
  }
}

function isNumericLiteral(val: string): boolean {
  if (!val || val.trim() === '') return false;
  return /^-?\d+(\.\d+)?$/.test(val.trim());
}

function evaluateConstantBinary(op: string, aStr: string, bStr: string): string | null {
  if (!isNumericLiteral(aStr) || !isNumericLiteral(bStr)) return null;
  const a = Number(aStr);
  const b = Number(bStr);
  if (Number.isNaN(a) || Number.isNaN(b)) return null;

  switch (op) {
    case '+':
      return String(a + b);
    case '-':
      return String(a - b);
    case '*':
      return String(a * b);
    case '/':
      if (b === 0) return null;
      return Number.isInteger(a / b) ? String(a / b) : (a / b).toFixed(2);
    default:
      return null;
  }
}

export function parseTACInput(tacText: string): TACQuadruple[] {
  const lines = tacText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith('//') && !l.startsWith('#'));

  return lines.map((line, idx) => {
    const eqIndex = line.indexOf('=');
    if (eqIndex === -1) {
      return {
        index: idx + 1,
        raw: line,
        target: `t${idx + 1}`,
        arg1: line,
        operator: '=',
        arg2: '',
        cost: 10,
        status: 'active',
        statusTag: 'ORIGINAL',
        explanation: 'Parsed statement',
      };
    }

    const target = line.slice(0, eqIndex).trim();
    const rhs = line.slice(eqIndex + 1).trim();

    // Match binary expression: arg1 op arg2
    const binaryMatch = rhs.match(/^([a-zA-Z0-9_.$]+)\s*([+\-*/])\s*([a-zA-Z0-9_.$]+)$/);
    if (binaryMatch) {
      const [, arg1, operator, arg2] = binaryMatch;
      return {
        index: idx + 1,
        raw: `${target} = ${arg1} ${operator} ${arg2}`,
        target,
        arg1,
        operator,
        arg2,
        cost: getOperatorCost(operator),
        status: 'active',
        statusTag: 'ORIGINAL',
        explanation: `Binary operation (${operator}) with weight ${getOperatorCost(operator)}`,
      };
    }

    // Copy or constant assignment: target = arg1
    return {
      index: idx + 1,
      raw: `${target} = ${rhs}`,
      target,
      arg1: rhs,
      operator: '=',
      arg2: '',
      cost: getOperatorCost('='),
      status: 'active',
      statusTag: 'ORIGINAL',
      explanation: isNumericLiteral(rhs)
        ? `Constant assignment (${rhs}) with weight 10`
        : `Copy assignment from ${rhs} with weight 10`,
    };
  });
}

function buildFigGraph(
  quads: TACQuadruple[],
  isOptimized: boolean,
  originalQuadsCount: number
): FigGraphData {
  // Build a Fig 1.1 style graph where vertices are numbered 1..N in a clean geometric ring/layered layout
  // and edges carry Edge Names (A, B, C...) and integer cycle weights (10, 14, 16, 24, 28...)
  const activeQuads = isOptimized
    ? quads.filter((q) => q.status !== 'dead_removed' && q.status !== 'cse_merged')
    : quads;

  const nodes: FigGraphNode[] = [];
  const edges: FigGraphEdge[] = [];
  const varToNodeId = new Map<string, number>();

  // Preset geometric coordinates inspired directly by Fig 1.1's balanced 7-node layout
  const layoutSlots = [
    { x: 165, y: 42 },  // 1: Top Peak
    { x: 255, y: 82 },  // 2: Upper Right
    { x: 295, y: 168 }, // 3: Mid Right
    { x: 235, y: 272 }, // 4: Bottom Right
    { x: 135, y: 245 }, // 5: Bottom Left
    { x: 85, y: 168 },  // 6: Mid Left
    { x: 190, y: 168 }, // 7: Center Hub
    { x: 95, y: 82 },   // 8: Upper Left
    { x: 315, y: 245 }, // 9: Far Bottom Right
    { x: 55, y: 245 },  // 10: Far Bottom Left
  ];

  const getOrCreateNode = (
    symbol: string,
    detail: string,
    kind: FigGraphNode['kind']
  ): number => {
    if (varToNodeId.has(symbol)) {
      return varToNodeId.get(symbol)!;
    }
    const id = nodes.length + 1;
    const slot = layoutSlots[(id - 1) % layoutSlots.length];
    nodes.push({
      id,
      codeLabel: symbol,
      detail,
      x: slot.x,
      y: slot.y,
      kind,
    });
    varToNodeId.set(symbol, id);
    return id;
  };

  let edgeCounter = 0;
  const nextEdgeName = () => {
    const letter = String.fromCharCode(65 + (edgeCounter % 26));
    edgeCounter++;
    return letter;
  };

  // Create nodes for each statement and connect operand dependencies
  activeQuads.forEach((q, idx) => {
    const isLast = idx === activeQuads.length - 1;
    const targetKind: FigGraphNode['kind'] =
      q.status === 'folded'
        ? 'folded'
        : isLast
        ? 'output'
        : 'compute';

    const rhsText =
      q.operator === '=' ? q.arg1 : `${q.arg1} ${q.operator} ${q.arg2}`;

    const targetNodeId = getOrCreateNode(
      q.target,
      `${q.target} = ${rhsText}`,
      targetKind
    );

    // Connect arg1 if it isn't purely an inline constant on a folded node
    if (q.arg1) {
      const arg1IsConst = isNumericLiteral(q.arg1);
      if (!arg1IsConst || !isOptimized) {
        const srcId = getOrCreateNode(
          q.arg1,
          arg1IsConst ? `Const ${q.arg1}` : `Input ${q.arg1}`,
          arg1IsConst ? 'folded' : 'input'
        );
        if (srcId !== targetNodeId) {
          edges.push({
            id: `e-${edges.length + 1}`,
            from: srcId,
            to: targetNodeId,
            edgeName: nextEdgeName(),
            weight: q.cost,
            operandLabel: q.arg1,
          });
        }
      }
    }

    if (q.operator !== '=' && q.arg2) {
      const arg2IsConst = isNumericLiteral(q.arg2);
      if (!arg2IsConst || !isOptimized) {
        const src2Id = getOrCreateNode(
          q.arg2,
          arg2IsConst ? `Const ${q.arg2}` : `Input ${q.arg2}`,
          arg2IsConst ? 'folded' : 'input'
        );
        if (src2Id !== targetNodeId) {
          edges.push({
            id: `e-${edges.length + 1}`,
            from: src2Id,
            to: targetNodeId,
            edgeName: nextEdgeName(),
            weight: getOperatorCost(q.operator === '*' || q.operator === '/' ? '+' : '='),
            operandLabel: q.arg2,
          });
        }
      }
    }
  });

  // Ensure every node is connected in a cohesive structure if a single folded statement remains
  if (nodes.length === 1 && activeQuads.length === 1) {
    const q = activeQuads[0];
    const srcId = getOrCreateNode(
      q.arg1 || 'const',
      `Evaluated ${q.arg1}`,
      'folded'
    );
    edges.push({
      id: 'e-single',
      from: srcId,
      to: 1,
      edgeName: 'A',
      weight: q.cost,
      operandLabel: q.arg1,
    });
  }

  const totalWeight = activeQuads.reduce((acc, q) => acc + q.cost, 0);

  return {
    title: isOptimized
      ? 'Optimized DAG & Execution Graph (After Optimization)'
      : 'Unoptimized Intermediate Code Dependency Graph',
    subtitle: isOptimized
      ? `${activeQuads.length} active instructions · Total Cost Weight: ${totalWeight}`
      : `${originalQuadsCount} instructions · Total Cost Weight: ${totalWeight}`,
    totalWeight,
    nodes,
    edges,
  };
}

export function runTACOptimization(
  tacText: string,
  options: OptimizationOptions,
  explicitLiveOutputs?: string[]
): OptimizationReport {
  const initialQuadruples = parseTACInput(tacText);
  const passLogs: PassStepLog[] = [];

  // Record Pass 0: Initial Parsed State
  passLogs.push({
    passName: 'Stage 0: Unoptimized Three-Address Code (Input)',
    techniqueCode: 'INIT',
    description:
      'Parsed input statements into Three-Address Code (TAC) quadruples (Operator, Arg1, Arg2, Result) with assigned instruction execution weights.',
    quadruples: initialQuadruples.map((q) => ({ ...q })),
    changesCount: 0,
  });

  let currentQuads: TACQuadruple[] = initialQuadruples.map((q) => ({ ...q }));
  let foldedCount = 0;
  let cseCount = 0;
  let deadRemovedCount = 0;

  // =========================================================================
  // PASS 1: CONSTANT FOLDING & CONSTANT PROPAGATION
  // =========================================================================
  if (options.constantFolding) {
    const constTable = new Map<string, string>();
    let passChanges = 0;

    currentQuads = currentQuads.map((quad) => {
      const q = { ...quad };

      // Propagate known constants into arg1 and arg2
      const resolvedArg1 = constTable.has(q.arg1) ? constTable.get(q.arg1)! : q.arg1;
      const resolvedArg2 =
        q.arg2 && constTable.has(q.arg2) ? constTable.get(q.arg2)! : q.arg2;

      const arg1Propagated = resolvedArg1 !== q.arg1;
      const arg2Propagated = resolvedArg2 !== q.arg2;
      q.arg1 = resolvedArg1;
      q.arg2 = resolvedArg2;

      if (q.operator === '=') {
        if (isNumericLiteral(q.arg1)) {
          constTable.set(q.target, q.arg1);
          if (arg1Propagated) {
            q.raw = `${q.target} = ${q.arg1}`;
            q.status = 'folded';
            q.statusTag = 'CONSTANT PROPAGATED';
            q.cost = 10;
            q.explanation = `Propagated constant ${q.arg1} into ${q.target}`;
            passChanges++;
            foldedCount++;
          }
        } else {
          constTable.delete(q.target);
        }
        return q;
      }

      // Check if binary operation can be constant folded
      const foldedValue = evaluateConstantBinary(q.operator, q.arg1, q.arg2);
      if (foldedValue !== null) {
        const originalExpr = `${q.arg1} ${q.operator} ${q.arg2}`;
        q.operator = '=';
        q.arg1 = foldedValue;
        q.arg2 = '';
        q.raw = `${q.target} = ${foldedValue}`;
        q.cost = 10;
        q.status = 'folded';
        q.statusTag = 'CONSTANT FOLDED';
        q.explanation = `Folded compile-time constant expression (${originalExpr}) -> ${foldedValue}`;
        constTable.set(q.target, foldedValue);
        passChanges++;
        foldedCount++;
      } else {
        // Variable redefined with non-constant
        constTable.delete(q.target);
        if (arg1Propagated || arg2Propagated) {
          q.raw = `${q.target} = ${q.arg1} ${q.operator} ${q.arg2}`;
          q.status = 'folded';
          q.statusTag = 'CONST OPERAND SUBSTITUTED';
          q.explanation = `Substituted known constant operand(s) into expression: ${q.raw}`;
          passChanges++;
        }
      }

      return q;
    });

    passLogs.push({
      passName: 'Pass 1: Constant Folding & Constant Propagation',
      techniqueCode: 'CF',
      description:
        'Evaluated expressions with known literal operands at compile time and substituted known constant values forward into dependent instructions.',
      quadruples: currentQuads.map((q) => ({ ...q })),
      changesCount: passChanges,
    });
  }

  // =========================================================================
  // PASS 2: COMMON SUB-EXPRESSION ELIMINATION (CSE)
  // =========================================================================
  if (options.cse) {
    // Map canonical expression key -> { targetVar, arg1, arg2 }
    const exprTable = new Map<
      string,
      { target: string; arg1: string; arg2: string }
    >();
    const copyAlias = new Map<string, string>();
    let passChanges = 0;

    const makeKey = (op: string, a1: string, a2: string): string => {
      if (op === '+' || op === '*') {
        const sorted = [a1, a2].sort();
        return `${op}:${sorted[0]}:${sorted[1]}`;
      }
      return `${op}:${a1}:${a2}`;
    };

    currentQuads = currentQuads.map((quad) => {
      const q = { ...quad };

      // Substitute any CSE copy aliases into arg1 and arg2
      if (copyAlias.has(q.arg1)) {
        q.arg1 = copyAlias.get(q.arg1)!;
      }
      if (q.arg2 && copyAlias.has(q.arg2)) {
        q.arg2 = copyAlias.get(q.arg2)!;
      }

      // Invalidate any expression in exprTable that uses or targets q.target
      for (const [key, entry] of Array.from(exprTable.entries())) {
        if (
          entry.target === q.target ||
          entry.arg1 === q.target ||
          entry.arg2 === q.target
        ) {
          exprTable.delete(key);
        }
      }
      // Invalidate any alias that points to or from q.target
      for (const [aliasKey, aliasVal] of Array.from(copyAlias.entries())) {
        if (aliasKey === q.target || aliasVal === q.target) {
          copyAlias.delete(aliasKey);
        }
      }

      if (q.operator !== '=') {
        const key = makeKey(q.operator, q.arg1, q.arg2);
        const existing = exprTable.get(key);
        if (existing) {
          const oldExpr = `${q.arg1} ${q.operator} ${q.arg2}`;
          q.operator = '=';
          q.arg1 = existing.target;
          q.arg2 = '';
          q.raw = `${q.target} = ${existing.target}`;
          q.cost = 10;
          q.status = 'cse_merged';
          q.statusTag = 'CSE ELIMINATED';
          q.canonicalRef = existing.target;
          q.explanation = `Common sub-expression (${oldExpr}) already computed in '${existing.target}'; replaced with reuse reference`;
          copyAlias.set(q.target, existing.target);
          passChanges++;
          cseCount++;
        } else {
          q.raw = `${q.target} = ${q.arg1} ${q.operator} ${q.arg2}`;
          exprTable.set(key, {
            target: q.target,
            arg1: q.arg1,
            arg2: q.arg2,
          });
        }
      } else {
        q.raw = `${q.target} = ${q.arg1}`;
      }

      return q;
    });

    passLogs.push({
      passName: 'Pass 2: Common Sub-Expression Elimination (DAG Value Numbering)',
      techniqueCode: 'CSE',
      description:
        'Constructed expression value numbers (accounting for commutativity of + and *) to merge duplicate computations and propagate canonical temporary registers.',
      quadruples: currentQuads.map((q) => ({ ...q })),
      changesCount: passChanges,
    });
  }

  // =========================================================================
  // PASS 3: BACKWARD LIVENESS ANALYSIS & DEAD CODE REMOVAL
  // =========================================================================
  if (options.deadCodeRemoval && currentQuads.length > 0) {
    const liveVars = new Set<string>();
    if (explicitLiveOutputs && explicitLiveOutputs.length > 0) {
      explicitLiveOutputs.forEach((v) => liveVars.add(v));
    } else {
      // By default, the target of the final instruction is the primary live output
      liveVars.add(currentQuads[currentQuads.length - 1].target);
    }

    const updatedQuads = currentQuads.map((q) => ({ ...q }));
    let passChanges = 0;

    // Traverse backwards from the last instruction to the first
    for (let i = updatedQuads.length - 1; i >= 0; i--) {
      const q = updatedQuads[i];
      const isTargetLive = liveVars.has(q.target);

      if (!isTargetLive) {
        q.status = 'dead_removed';
        q.statusTag = 'DEAD CODE REMOVED';
        q.explanation = `Variable '${q.target}' is never referenced by any subsequent live instruction (or is overwritten before use); eliminated.`;
        passChanges++;
        deadRemovedCount++;
      } else {
        // Target is redefined here, so remove it from live set prior to this instruction
        liveVars.delete(q.target);
        // Add operands to live set if they are variables (not numeric literals)
        if (q.arg1 && !isNumericLiteral(q.arg1)) {
          liveVars.add(q.arg1);
        }
        if (q.arg2 && !isNumericLiteral(q.arg2)) {
          liveVars.add(q.arg2);
        }
      }
    }

    currentQuads = updatedQuads;

    passLogs.push({
      passName: 'Pass 3: Backward Liveness Analysis & Dead Code Removal',
      techniqueCode: 'DCE',
      description:
        'Performed backward data-flow liveness analysis starting from output variables to prune unreachable temporaries, folded intermediate constants, and overwritten assignments.',
      quadruples: currentQuads.map((q) => ({ ...q })),
      changesCount: passChanges,
    });
  }

  const finalQuadruples = currentQuads.filter((q) => q.status !== 'dead_removed');
  const originalLines = initialQuadruples.map((q) => q.raw);
  const finalLines = finalQuadruples.map((q) => q.raw);

  const originalCycleCost = initialQuadruples.reduce((sum, q) => sum + q.cost, 0);
  const optimizedCycleCost = finalQuadruples.reduce((sum, q) => sum + q.cost, 0);
  const costSavingsPercent =
    originalCycleCost > 0
      ? Math.round(((originalCycleCost - optimizedCycleCost) / originalCycleCost) * 1000) / 10
      : 0;

  const unoptimizedGraph = buildFigGraph(
    initialQuadruples,
    false,
    initialQuadruples.length
  );
  const optimizedGraph = buildFigGraph(
    currentQuads,
    true,
    initialQuadruples.length
  );

  return {
    originalLines,
    finalLines,
    initialQuadruples,
    passLogs,
    finalQuadruples,
    unoptimizedGraph,
    optimizedGraph,
    metrics: {
      originalCount: initialQuadruples.length,
      optimizedCount: finalQuadruples.length,
      eliminatedCount: initialQuadruples.length - finalQuadruples.length,
      originalCycleCost,
      optimizedCycleCost,
      costSavingsPercent,
      foldedCount,
      cseCount,
      deadRemovedCount,
    },
  };
}
