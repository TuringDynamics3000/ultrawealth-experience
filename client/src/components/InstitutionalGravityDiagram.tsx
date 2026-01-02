/**
 * InstitutionalGravityDiagram
 * 
 * Economic proof rendered visually — a16z standard
 * 
 * Design principles:
 * - Single argument, not sections
 * - Kernel dominance (unquestioned centre of gravity)
 * - Irreversibility over motion (downward gravity, accumulation, lock-in)
 * - Institutional tone (infrastructure economics, not product UI)
 * - No decoration (no gradients, no playful motion, no SaaS tropes)
 * 
 * Success criterion: If a senior investor can accurately summarise the 
 * business model without narration, the task is complete.
 */

export default function InstitutionalGravityDiagram() {
  return (
    <svg
      viewBox="0 0 1200 820"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      {/* Definitions */}
      <defs>
        {/* Arrow marker */}
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
          <path d="M0,1 L10,5 L0,9 Z" fill="#6B7280" />
        </marker>
        
        {/* Blocked X marker */}
        <marker id="blocked-x" markerWidth="12" markerHeight="12" refX="6" refY="6" orient="auto">
          <circle cx="6" cy="6" r="5" fill="#0a0c10" stroke="#EF4444" strokeWidth="1.5" />
          <path d="M4,4 L8,8 M8,4 L4,8" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
        </marker>
      </defs>

      {/* ========================================
          LEGACY SYSTEMS — STRUCTURAL FAILURE
          Physically unable to cross the boundary
          ======================================== */}
      <g>
        {/* Failure block container */}
        <rect
          x="40"
          y="240"
          width="240"
          height="220"
          rx="6"
          fill="none"
          stroke="#EF4444"
          strokeWidth="1.5"
          strokeDasharray="6 4"
          opacity="0.8"
        />
        
        {/* Title */}
        <text x="160" y="275" textAnchor="middle" fill="#EF4444" fontSize="14" fontWeight="600">
          Legacy Systems
        </text>
        
        {/* Structural failures */}
        <text x="160" y="310" textAnchor="middle" fill="#9CA3AF" fontSize="12">
          No determinism
        </text>
        <text x="160" y="332" textAnchor="middle" fill="#9CA3AF" fontSize="12">
          No historical proof
        </text>
        <text x="160" y="354" textAnchor="middle" fill="#9CA3AF" fontSize="12">
          Unmigratable compliance state
        </text>
        
        {/* Critical label */}
        <rect x="80" y="385" width="160" height="24" rx="4" fill="rgba(239, 68, 68, 0.1)" />
        <text x="160" y="402" textAnchor="middle" fill="#EF4444" fontSize="11" fontWeight="500">
          No safe migration path
        </text>
        
        {/* Blocked connection lines */}
        <line x1="280" y1="320" x2="350" y2="290" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#blocked-x)" />
        <line x1="280" y1="360" x2="350" y2="360" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#blocked-x)" />
      </g>

      {/* ========================================
          WEDGE PRODUCT — Entry vector only
          ======================================== */}
      <g>
        <rect
          x="480"
          y="50"
          width="240"
          height="70"
          rx="6"
          fill="none"
          stroke="#4B5563"
          strokeWidth="1"
        />
        
        <text x="600" y="80" textAnchor="middle" fill="#E5E7EB" fontSize="14" fontWeight="500">
          UltraWealth
        </text>
        
        <text x="600" y="100" textAnchor="middle" fill="#6B7280" fontSize="11">
          Wedge tenant validating kernel economics
        </text>
      </g>

      {/* Arrow: Wedge → Kernel */}
      <line x1="600" y1="120" x2="600" y2="180" stroke="#4B5563" strokeWidth="1.5" markerEnd="url(#arrow)" />

      {/* ========================================
          DETERMINISTIC DECISION & PROOF KERNEL
          Unquestioned centre of gravity
          ======================================== */}
      <g>
        {/* Outer emphasis */}
        <rect
          x="355"
          y="190"
          width="490"
          height="170"
          rx="10"
          fill="none"
          stroke="#1E3A5F"
          strokeWidth="1"
        />
        
        {/* Main kernel box */}
        <rect
          x="360"
          y="195"
          width="480"
          height="160"
          rx="8"
          fill="#0B1220"
          stroke="#3B82F6"
          strokeWidth="2.5"
        />
        
        {/* Kernel title */}
        <text x="600" y="245" textAnchor="middle" fill="#FFFFFF" fontSize="18" fontWeight="700">
          Deterministic Decision &amp; Proof Kernel
        </text>
        
        {/* System name */}
        <text x="600" y="275" textAnchor="middle" fill="#3B82F6" fontSize="14" fontWeight="500">
          TuringOS
        </text>
        
        {/* Function description */}
        <text x="600" y="305" textAnchor="middle" fill="#9CA3AF" fontSize="12">
          System of record for regulated decisions
        </text>
        
        {/* Critical annotation — factual, not promotional */}
        <rect x="480" y="320" width="240" height="22" rx="4" fill="rgba(59, 130, 246, 0.08)" />
        <text x="600" y="336" textAnchor="middle" fill="#60A5FA" fontSize="11" fontWeight="500">
          Institutional rent extracted here
        </text>
      </g>

      {/* Arrow: Kernel → Proof */}
      <line x1="600" y1="355" x2="600" y2="420" stroke="#4B5563" strokeWidth="1.5" markerEnd="url(#arrow)" />

      {/* ========================================
          NON-REPRODUCIBLE INSTITUTIONAL PROOF
          Heavy, accumulative, cannot be recreated
          ======================================== */}
      <g>
        {/* Main proof box */}
        <rect
          x="300"
          y="430"
          width="600"
          height="120"
          rx="8"
          fill="#070B14"
          stroke="#374151"
          strokeWidth="2"
        />
        
        {/* Weight bars — visual heaviness */}
        <rect x="320" y="530" width="560" height="3" rx="1.5" fill="#1F2937" />
        <rect x="340" y="537" width="520" height="2" rx="1" fill="#111827" />
        
        {/* Title */}
        <text x="600" y="470" textAnchor="middle" fill="#E5E7EB" fontSize="16" fontWeight="600">
          Non-Reproducible Institutional Proof
        </text>
        
        {/* Key statement */}
        <text x="600" y="500" textAnchor="middle" fill="#9CA3AF" fontSize="12">
          Proof density compounds with every automated decision
        </text>
        
        {/* Irreversibility marker */}
        <text x="600" y="522" textAnchor="middle" fill="#6B7280" fontSize="10" fontStyle="italic">
          Cannot be recreated or migrated
        </text>
      </g>

      {/* Arrow: Proof → Regulatory */}
      <line x1="600" y1="550" x2="600" y2="600" stroke="#4B5563" strokeWidth="1.5" markerEnd="url(#arrow)" />

      {/* ========================================
          REGULATORY ANCHORING
          External but dependent — lock-in tied to authority
          ======================================== */}
      <g>
        {/* Dashed boundary — external, not owned */}
        <rect
          x="260"
          y="610"
          width="680"
          height="120"
          rx="8"
          fill="none"
          stroke="#6B7280"
          strokeWidth="1.5"
          strokeDasharray="8 5"
        />
        
        {/* Title */}
        <text x="600" y="650" textAnchor="middle" fill="#E5E7EB" fontSize="15" fontWeight="500">
          Regulators · Auditors · Boards
        </text>
        
        {/* Dependency statement */}
        <text x="600" y="678" textAnchor="middle" fill="#9CA3AF" fontSize="12">
          Operational trust anchors to kernel-generated proof
        </text>
        
        {/* Exit cost — inside regulatory boundary */}
        <rect x="440" y="695" width="320" height="22" rx="4" fill="rgba(107, 114, 128, 0.1)" />
        <text x="600" y="711" textAnchor="middle" fill="#9CA3AF" fontSize="11" fontWeight="500">
          Exit requires re-proving institutional history
        </text>
      </g>

      {/* ========================================
          AUTOMATION — Asymmetric compounding
          Not a loop, but throughput that increases rent
          ======================================== */}
      <g>
        {/* Curved path from proof back toward kernel */}
        <path
          d="M900 275 C1000 275, 1000 490, 900 490"
          fill="none"
          stroke="#3B82F6"
          strokeWidth="1.5"
          opacity="0.7"
        />
        
        {/* Arrow pointing back */}
        <path
          d="M900 275 L890 265 M900 275 L890 285"
          stroke="#3B82F6"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.7"
        />
        
        {/* Asymmetric compounding label */}
        <text x="980" y="350" fill="#6B7280" fontSize="11" fontWeight="400">
          <tspan x="980" dy="0">Automation increases</tspan>
          <tspan x="980" dy="16">decision throughput</tspan>
        </text>
        
        <text x="980" y="400" fill="#6B7280" fontSize="11" fontWeight="400">
          <tspan x="980" dy="0">Proof density</tspan>
          <tspan x="980" dy="16">compounds</tspan>
        </text>
      </g>

      {/* ========================================
          CLOSING ASSERTION
          Factual. Final.
          ======================================== */}
      <text
        x="600"
        y="780"
        textAnchor="middle"
        fill="#6B7280"
        fontSize="12"
        fontWeight="400"
      >
        Once institutional proof accumulates, exit requires re-proving history. At this point, exit ceases to be a rational option.
      </text>
    </svg>
  );
}
