import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getMyProfile, updateMyProfile } from "@/lib/server/account";

export const Route = createFileRoute("/account/profile")({ component: ProfilePage });

function ProfilePage() {
  const { user, isPending } = useCurrentUserState();
  const qc = useQueryClient();
  const profile = useQuery({ queryKey: ["profile"], queryFn: () => getMyProfile(), enabled: Boolean(user) });
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (profile.data) {
      setFullName(profile.data.fullName);
      setPhone(profile.data.phone);
    }
  }, [profile.data]);

  if (isPending) return <div className="h-40 animate-pulse rounded-xl bg-surface-2" />;
  if (!user) return <RedirectToSignIn />;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-4xl">Profile</h1>
      <div className="space-y-3">
        <div className="space-y-1">
          <Label>Full name</Label>
          <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label>Phone</Label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <p className="text-sm text-muted">{user.primaryEmail}</p>
        <Button
          onClick={async () => {
            try {
              await updateMyProfile({ data: { fullName, phone } });
              await qc.invalidateQueries({ queryKey: ["profile"] });
              toast.success("Profile updated");
            } catch (e) {
              toast.error(e instanceof Error ? e.message : "Could not save");
            }
          }}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
