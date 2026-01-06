/**
 * Simulation stub for tRPC client.
 * No backend calls are made.
 */
export const trpc = {
  useQuery: () => ({ data: null, isLoading: false }),
  useMutation: () => ({ mutate: () => null }),
};
