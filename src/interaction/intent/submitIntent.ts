import { Intent } from '../contracts/Intent';
import { DecisionOutcomeView } from '../contracts/DecisionOutcomeView';
import { DecisionExceptionContext } from '../contracts/DecisionExceptionContext';
import { post } from '../api/client';

export async function submitIntent(
  intent: Intent
): Promise<
  | { outcome: DecisionOutcomeView }
  | { exception: DecisionExceptionContext }
> {
  return post('/interaction/intents', intent);
}
