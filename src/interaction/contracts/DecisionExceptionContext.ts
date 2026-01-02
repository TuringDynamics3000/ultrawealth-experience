export interface DecisionExceptionContext {
  decision_id: string;
  failed_invariant: 'POLICY' | 'AUTHORITY' | 'EVIDENCE' | 'STATE' | 'INTERVENTION';
  failure_code: string;
  failure_message: string;
  required_state?: string;
  missing_items?: string[];
  escalation_options: {
    option_type:
      | 'REQUEST_EVIDENCE'
      | 'REQUEST_AUTHORITY'
      | 'ESCALATE_TO_HUMAN'
      | 'DOWNGRADE_AUTOMATION'
      | 'ABANDON';
    permitted: boolean;
    reason_if_blocked?: string;
  }[];
}
