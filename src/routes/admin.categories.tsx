import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { adminDeleteCategory, adminSaveCategory } from "@/lib/server/admin";
import { listCategories } from "@/lib/server/products";

export const Route = createFileRoute("/admin/categories")({ component: AdminCategories });

function AdminCategories() {
  const qc = useQueryClient();
  const list = useQuery({ queryKey: ["categories"], queryFn: () => listCategories() });
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState<string>("furniture");
  const [imageUrl, setImageUrl] = useState("");
  const save = useMutation({
    mutationFn: () =>
      adminSaveCategory({
        data: {
          name,
          parentId: parentId || null,
          description: name,
          imageUrl: imageUrl || "/categories/furniture.jpg",
          sortOrder: 99,
        },
      }),
    onSuccess: () => {
      setName("");
      void qc.invalidateQueries({ queryKey: ["categories"] });
    },
  });
  const del = useMutation({
    mutationFn: (id: string) => adminDeleteCategory({ data: { id } }),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["categories"] }),
  });
  const parents = (list.data ?? []).filter((c) => !c.parentId);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">Categories</h1>
      <ul className="space-y-2 text-sm">
        {(list.data ?? []).map((c) => (
          <li key={c.id} className="flex items-center justify-between rounded-xl bg-surface px-4 py-3">
            <span>
              {c.parentId ? `${c.parentId} / ` : ""}
              {c.name}
            </span>
            {c.parentId ? (
              <button type="button" className="text-xs text-danger" onClick={() => del.mutate(c.id)}>
                Remove
              </button>
            ) : null}
          </li>
        ))}
      </ul>
      <div className="space-y-3 rounded-xl border border-border bg-surface p-4">
        <p className="font-medium">Add subcategory</p>
        <div className="space-y-1">
          <Label>Parent</Label>
          <select
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
            className="h-11 w-full rounded-md border border-border bg-surface px-3 text-sm"
          >
            {parents.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label>Image URL</Label>
          <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        </div>
        <Button onClick={() => save.mutate()} disabled={!name}>
          Add category
        </Button>
      </div>
    </div>
  );
}
