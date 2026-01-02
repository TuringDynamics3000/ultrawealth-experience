export interface DecisionOutcomeView {
  decision_id: string;
  decision_state: 'STATE_2' | 'STATE_3' | 'STATE_4' | 'STATE_5';
  automation_level: 'HUMAN' | 'ASSISTED' | 'AUTONOMOUS';
  outcome: 'APPROVED' | 'BLOCKED' | 'ESCALATED' | 'PENDING';
  human_message: string;
  reason_codes: string[];
}
