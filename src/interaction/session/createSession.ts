import { InteractionSession } from '../contracts/InteractionSession';
import { post } from '../api/client';

export async function createSession(
  actor_type: InteractionSession['actor_type'],
  actor_id: string,
  channel: InteractionSession['channel']
): Promise<InteractionSession> {
  return post<InteractionSession>('/interaction/sessions', {
    tenant_id: 'ultrawealth',
    actor_type,
    actor_id,
    channel,
  });
}
