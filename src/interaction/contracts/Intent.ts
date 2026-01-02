export interface Intent {
  intent_id: string;
  session_id: string;
  intent_type: 'VIEW' | 'MODIFY' | 'EXECUTE' | 'REQUEST' | 'CONFIRM' | 'OVERRIDE';
  target_type: 'PORTFOLIO' | 'ACCOUNT' | 'ORDER' | 'WORKFLOW' | 'DOCUMENT';
  target_id?: string;
  payload: Record<string, unknown>;
  submitted_at: number;
}
