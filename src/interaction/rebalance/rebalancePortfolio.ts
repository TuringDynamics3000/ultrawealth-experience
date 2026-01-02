import { DefaultApi, Configuration } from '@/generated/turingos';

const api = new DefaultApi(
  new Configuration({
    basePath: process.env.NEXT_PUBLIC_TURINGOS_API ?? 'http://localhost:3000',
  })
);

/**
 * Canonical Reference Flow:
 * Rebalance Portfolio via Intent -> Decision -> Outcome
 */
export async function rebalancePortfolio(
  sessionId: string,
  portfolioId: string,
  targetAllocation: {
    equities: number;
    bonds: number;
  }
) {
  return api.interactionIntentsPost({
    session_id: sessionId,
    intent: {
      intent_id: ebalance-\,
      intent_type: 'EXECUTE',
      target_type: 'PORTFOLIO',
      target_id: portfolioId,
      payload: {
        rebalance: true,
        target_allocation: targetAllocation,
      },
    },
  });
}
