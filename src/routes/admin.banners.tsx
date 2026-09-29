import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { adminDeleteBanner, adminListBanners, adminSaveBanner } from "@/lib/server/admin";

export const Route = createFileRoute("/admin/banners")({ component: AdminBanners });

function AdminBanners() {
  const qc = useQueryClient();
  const list = useQuery({ queryKey: ["admin-banners"], queryFn: () => adminListBanners() });
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [ctaHref, setCtaHref] = useState("/categories");
  const save = useMutation({
    mutationFn: () =>
      adminSaveBanner({
        data: {
          title,
          subtitle,
          imageUrl,
          ctaText: "Shop now",
          ctaHref,
          sortOrder: (list.data?.length ?? 0) + 1,
          active: true,
        },
      }),
    onSuccess: () => {
      setTitle("");
      setSubtitle("");
      setImageUrl("");
      void qc.invalidateQueries({ queryKey: ["admin-banners"] });
    },
  });
  const del = useMutation({
    mutationFn: (id: number) => adminDeleteBanner({ data: { id } }),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["admin-banners"] }),
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">Promotional banners</h1>
      <ul className="space-y-3">
        {(list.data ?? []).map((b) => (
          <li key={b.id} className="flex gap-3 rounded-xl bg-surface p-3">
            <img src={b.imageUrl} alt="" className="h-16 w-24 rounded-md object-cover" />
            <div className="flex-1 text-sm">
              <p className="font-medium">{b.title}</p>
              <p className="text-muted">{b.subtitle}</p>
            </div>
            <button type="button" className="text-xs text-danger" onClick={() => del.mutate(b.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <div className="space-y-3 rounded-xl border border-border bg-surface p-4">
        <p className="font-medium">New banner</p>
        <Field label="Title">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <Field label="Subtitle">
          <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
        </Field>
        <Field label="Image URL">
          <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        </Field>
        <Field label="Link">
          <Input value={ctaHref} onChange={(e) => setCtaHref(e.target.value)} />
        </Field>
        <Button onClick={() => save.mutate()} disabled={!title || !imageUrl}>
          Add banner
        </Button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
