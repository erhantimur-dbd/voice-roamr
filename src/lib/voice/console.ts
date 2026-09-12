import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getConsole } from "./functions";

export const CONSOLE_KEY = ["roamr-console"] as const;

export function useConsole() {
  const { user, isPending: sessionPending } = useCurrentUserState();
  const q = useQuery({
    queryKey: CONSOLE_KEY,
    queryFn: () => getConsole(),
    enabled: Boolean(user),
    staleTime: 15_000,
  });
  return { ...q, user, sessionPending };
}

export function useConsoleInvalidate() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: CONSOLE_KEY });
}

export type ConsoleData = NonNullable<Awaited<ReturnType<typeof getConsole>>>;
