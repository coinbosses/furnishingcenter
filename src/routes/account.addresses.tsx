import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { deleteAddress, listMyAddresses, saveAddress } from "@/lib/server/account";

export const Route = createFileRoute("/account/addresses")({ component: AddressesPage });

function AddressesPage() {
  const { user, isPending } = useCurrentUserState();
  const qc = useQueryClient();
  const list = useQuery({ queryKey: ["addresses"], queryFn: () => listMyAddresses(), enabled: Boolean(user) });
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("Home");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("Abuja");

  if (isPending) return <div className="h-40 animate-pulse rounded-xl bg-surface-2" />;
  if (!user) return <RedirectToSignIn />;

  async function onSave() {
    try {
      await saveAddress({
        data: { label, fullName, phone, street, area, city, state: "FCT", isDefault: !(list.data ?? []).length },
      });
      await qc.invalidateQueries({ queryKey: ["addresses"] });
      setOpen(false);
      toast.success("Address saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save");
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-4xl">Addresses</h1>
      <ul className="space-y-3">
        {(list.data ?? []).map((a) => (
          <li key={a.id} className="rounded-xl border border-border bg-surface p-4 text-sm">
            <p className="font-medium">
              {a.label} {a.isDefault ? "· Default" : ""}
            </p>
            <p className="mt-1 text-muted">
              {a.fullName} · {a.phone}
            </p>
            <p className="text-muted">
              {a.street}, {a.area}, {a.city}, {a.state}
            </p>
            <button
              type="button"
              className="mt-2 text-xs text-danger"
              onClick={async () => {
                await deleteAddress({ data: { id: a.id } });
                await qc.invalidateQueries({ queryKey: ["addresses"] });
              }}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      {open ? (
        <div className="space-y-3 rounded-xl bg-surface p-4">
          <div className="space-y-1">
            <Label>Label</Label>
            <Input value={label} onChange={(e) => setLabel(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Name</Label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Phone</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Street</Label>
            <Input value={street} onChange={(e) => setStreet(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Area</Label>
            <Input value={area} onChange={(e) => setArea(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>City</Label>
            <Input value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
          <Button onClick={() => void onSave()}>Save address</Button>
        </div>
      ) : (
        <Button variant="outline" onClick={() => setOpen(true)}>
          Add address
        </Button>
      )}
    </div>
  );
}
