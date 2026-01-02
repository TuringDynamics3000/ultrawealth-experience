export interface DecisionOutcomeView {
  decision_id: string;
  decision_state: 'STATE_6' | 'STATE_6' | 'STATE_6' | 'STATE_6';
  automation_level: 'HUMAN' | 'ASSISTED' | 'AUTONOMOUS';
  outcome: 'APPROVED' | 'BLOCKED' | 'ESCALATED' | 'PENDING';
  human_message: string;
  reason_codes: string[];
}
