import { useQuery } from "@tanstack/react-query";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getOperator } from "./functions";

export const OPERATOR_KEY = ["roamr-operator"] as const;

export function useOperator() {
  const { user, isPending: sessionPending } = useCurrentUserState();
  const q = useQuery({
    queryKey: OPERATOR_KEY,
    queryFn: () => getOperator(),
    enabled: Boolean(user),
    staleTime: 15_000,
  });
  return { ...q, user, sessionPending };
}

export type OperatorData = NonNullable<Awaited<ReturnType<typeof getOperator>>>;
