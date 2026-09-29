import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { listWishlist, toggleWishlist } from "@/lib/server/account";
import { useWishlistLocal } from "@/lib/store";

export function useWish() {
  const { user } = useCurrentUserState();
  const local = useWishlistLocal();
  const qc = useQueryClient();
  const server = useQuery({
    queryKey: ["wishlist"],
    queryFn: () => listWishlist(),
    enabled: Boolean(user),
  });
  const ids = user ? (server.data ?? []).map((p) => p.id) : local.ids;
  async function toggle(id: string) {
    if (user) {
      await toggleWishlist({ data: { productId: id } });
      await qc.invalidateQueries({ queryKey: ["wishlist"] });
    } else {
      local.toggle(id);
    }
  }
  return { ids, has: (id: string) => ids.includes(id), toggle, products: server.data ?? [] };
}
