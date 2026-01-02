export async function mockInteractionIntentsPost() {
  return {
    type: 'DECISION_EXCEPTION',
    decision_id: 'mock_decision_001',
    decision_state: 'STATE_3',
    decision_class: 'CLASS_A',
    automation_level: 'ASSISTED',
    failure_message:
      'Mock mode: additional evidence required to rebalance portfolio.',
    escalation_options: [
      { option_type: 'REQUEST_EVIDENCE', permitted: true },
      { option_type: 'ESCALATE_TO_HUMAN', permitted: true },
    ],
  };
}
