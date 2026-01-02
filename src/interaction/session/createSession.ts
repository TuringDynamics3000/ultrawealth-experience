import { DefaultApi, Configuration } from '@/generated/turingos';

const api = new DefaultApi(
  new Configuration({
    basePath: process.env.NEXT_PUBLIC_TURINGOS_API ?? 'http://localhost:3000',
  })
);

export async function createInteractionSession(actorId: string) {
  return api.interactionSessionsPost({
    tenant_id: 'ultrawealth',
    actor_type: 'CLIENT',
    actor_id: actorId,
    channel: 'WEB',
  });
}
