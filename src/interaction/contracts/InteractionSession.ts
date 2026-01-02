export interface InteractionSession {
  session_id: string;
  tenant_id: 'ultrawealth';
  actor_type: 'CLIENT' | 'OPERATOR' | 'ADVISER' | 'SYSTEM';
  actor_id: string;
  channel: 'WEB' | 'MOBILE' | 'OPERATOR_CONSOLE' | 'API' | 'AGENT';
  started_at: number;
  last_activity_at: number;
  decision_ids: string[];
}
