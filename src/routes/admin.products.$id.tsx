import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { DEFAULT_DELIVERY } from "@/lib/constants";
import { adminSaveProduct } from "@/lib/server/admin";
import { getProduct, listCategories } from "@/lib/server/products";

export const Route = createFileRoute("/admin/products/$id")({ component: AdminProductForm });

function AdminProductForm() {
  const { id } = Route.useParams();
  const isNew = id === "new";
  const navigate = useNavigate();
  const qc = useQueryClient();
  const existing = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProduct({ data: { id } }),
    enabled: !isNew,
  });
  const cats = useQuery({ queryKey: ["categories"], queryFn: () => listCategories() });
  const p = existing.data;

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("sofas");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [compareAt, setCompareAt] = useState<number | "">("");
  const [images, setImages] = useState("");
  const [specs, setSpecs] = useState("Seating: 3-seater");
  const [colors, setColors] = useState("Greige,#C4B7A6");
  const [sizes, setSizes] = useState("Standard");
  const [dimensions, setDimensions] = useState("");
  const [material, setMaterial] = useState("");
  const [stock, setStock] = useState(1);
  const [warranty, setWarranty] = useState("12 months manufacturer warranty.");
  const [deliveryInfo, setDeliveryInfo] = useState(DEFAULT_DELIVERY);
  const [featured, setFeatured] = useState(false);
  const [bestseller, setBestseller] = useState(false);
  const [newArrival, setNewArrival] = useState(false);
  const [specialOffer, setSpecialOffer] = useState(false);

  useEffect(() => {
    if (!p) return;
    setName(p.name);
    setCategoryId(p.categoryId);
    setDescription(p.description);
    setPrice(p.price);
    setCompareAt(p.compareAt ?? "");
    setImages(p.images.join("\n"));
    setSpecs(Object.entries(p.specs).map(([k, v]) => `${k}: ${v}`).join("\n"));
    setColors(p.colors.map((c) => `${c.name},${c.hex}`).join("\n"));
    setSizes(p.sizes.join(", "));
    setDimensions(p.dimensions);
    setMaterial(p.material);
    setStock(p.stock);
    setWarranty(p.warranty);
    setDeliveryInfo(p.deliveryInfo);
    setFeatured(p.featured);
    setBestseller(p.bestseller);
    setNewArrival(p.newArrival);
    setSpecialOffer(p.specialOffer);
  }, [p]);

  function parseSpecs() {
    const out: Record<string, string> = {};
    for (const line of specs.split("\n")) {
      const [k, ...rest] = line.split(":");
      if (k && rest.length) out[k.trim()] = rest.join(":").trim();
    }
    return out;
  }
  function parseColors() {
    return colors
      .split("\n")
      .map((l) => l.split(","))
      .filter((p) => p[0]?.trim())
      .map(([n, h]) => ({ name: n.trim(), hex: (h ?? "#888888").trim() }));
  }

  async function onFile(files: FileList | null) {
    if (!files?.length) return;
    const reads = await Promise.all(
      [...files].map(
        (file) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result));
            reader.onerror = reject;
            reader.readAsDataURL(file);
          }),
      ),
    );
    setImages((prev) => [prev, ...reads].filter(Boolean).join("\n"));
  }

  async function onSave() {
    try {
      const imageList = images
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
      if (!imageList.length) {
        toast.error("Add at least one image URL or upload");
        return;
      }
      const saved = await adminSaveProduct({
        data: {
          id: isNew ? undefined : id,
          name,
          categoryId,
          description,
          price,
          compareAt: compareAt === "" ? null : Number(compareAt),
          images: imageList,
          specs: parseSpecs(),
          colors: parseColors(),
          sizes: sizes.split(",").map((s) => s.trim()).filter(Boolean),
          dimensions,
          material,
          stock,
          warranty,
          deliveryInfo,
          featured,
          bestseller,
          newArrival,
          specialOffer,
        },
      });
      await qc.invalidateQueries();
      toast.success("Product saved");
      await navigate({ to: "/admin/products/$id", params: { id: saved.id } });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save");
    }
  }

  const leaves = (cats.data ?? []).filter((c) => c.parentId);

  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl">{isNew ? "New product" : "Edit product"}</h1>
      <Field label="Name">
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </Field>
      <Field label="Category">
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="h-11 w-full rounded-md border border-border bg-surface px-3 text-sm"
        >
          {leaves.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Description">
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Price (₦)">
          <Input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
        </Field>
        <Field label="Compare at (₦)">
          <Input
            type="number"
            value={compareAt}
            onChange={(e) => setCompareAt(e.target.value === "" ? "" : Number(e.target.value))}
          />
        </Field>
      </div>
      <Field label="Images (one URL per line)">
        <Textarea value={images} onChange={(e) => setImages(e.target.value)} />
        <input type="file" accept="image/*" multiple className="mt-2 text-sm" onChange={(e) => void onFile(e.target.files)} />
      </Field>
      <Field label="Specs (Name: value per line)">
        <Textarea value={specs} onChange={(e) => setSpecs(e.target.value)} />
      </Field>
      <Field label="Colours (Name,#hex per line)">
        <Textarea value={colors} onChange={(e) => setColors(e.target.value)} />
      </Field>
      <Field label="Sizes (comma separated)">
        <Input value={sizes} onChange={(e) => setSizes(e.target.value)} />
      </Field>
      <Field label="Dimensions">
        <Input value={dimensions} onChange={(e) => setDimensions(e.target.value)} />
      </Field>
      <Field label="Material">
        <Input value={material} onChange={(e) => setMaterial(e.target.value)} />
      </Field>
      <Field label="Stock">
        <Input type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))} />
      </Field>
      <Field label="Warranty">
        <Textarea value={warranty} onChange={(e) => setWarranty(e.target.value)} />
      </Field>
      <Field label="Delivery">
        <Textarea value={deliveryInfo} onChange={(e) => setDeliveryInfo(e.target.value)} />
      </Field>
      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} /> Featured
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={bestseller} onChange={(e) => setBestseller(e.target.checked)} /> Best seller
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={newArrival} onChange={(e) => setNewArrival(e.target.checked)} /> New
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={specialOffer} onChange={(e) => setSpecialOffer(e.target.checked)} /> Offer
        </label>
      </div>
      <Button onClick={() => void onSave()}>Save product</Button>
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
