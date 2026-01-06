/**
 * useTuringCoreClient Hook
 * 
 * Provides access to the TuringCore API client.
 * Automatically selects mock or HTTP client based on DEMO_MODE.
 */

import { useMemo } from 'react';
import { getClient, type TuringCoreClient } from '../api';

/**
 * Hook to get the TuringCore API client.
 * 
 * @example
 * ```tsx
 * const client = useTuringCoreClient();
 * 
 * const { data } = await client.getPortfolio('portfolio-001');
 * ```
 */
export function useTuringCoreClient(): TuringCoreClient {
  return useMemo(() => getClient(), []);
}

export default useTuringCoreClient;
