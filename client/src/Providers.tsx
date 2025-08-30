import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
export const Providers = (props: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
    </QueryClientProvider>
  )
}
