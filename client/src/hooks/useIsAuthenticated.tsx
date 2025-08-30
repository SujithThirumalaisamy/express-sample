import { useQuery } from "@tanstack/react-query";

export function useIsAuthenticated() {
  return useQuery({
    queryKey: ["isAuthenticated"],
    queryFn: async () => {
      const { catalyst } = window;
      //@ts-ignore
      if (!catalyst?.auth?.isUserAuthenticated) {
        throw new Error("Catalyst SDK not available");
      }
      //@ts-ignore
      return (await catalyst.auth.isUserAuthenticated()).status === 200
    },
    retry: false,
    staleTime: 1000 * 60,
  });
}
