import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { C as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { i as DEFAULT_DELIVERY } from "./catalog-data-087TMwXI.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { g as listCategories, h as getProduct, n as Route$1 } from "./router-Ba_FUwPp.mjs";
import { t as Button } from "./button-BKKaprw5.mjs";
import { n as Label, r as Textarea, t as Input } from "./input-BsJ7Tovf.mjs";
import { f as adminSaveProduct } from "./admin-K4UZHSlG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.products._id-Cb9ZKpce.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminProductForm() {
	const { id } = Route$1.useParams();
	const isNew = id === "new";
	const navigate = useNavigate();
	const qc = useQueryClient();
	const existing = useQuery({
		queryKey: ["product", id],
		queryFn: () => getProduct({ data: { id } }),
		enabled: !isNew
	});
	const cats = useQuery({
		queryKey: ["categories"],
		queryFn: () => listCategories()
	});
	const p = existing.data;
	const [name, setName] = (0, import_react.useState)("");
	const [categoryId, setCategoryId] = (0, import_react.useState)("sofas");
	const [description, setDescription] = (0, import_react.useState)("");
	const [price, setPrice] = (0, import_react.useState)(0);
	const [compareAt, setCompareAt] = (0, import_react.useState)("");
	const [images, setImages] = (0, import_react.useState)("");
	const [specs, setSpecs] = (0, import_react.useState)("Seating: 3-seater");
	const [colors, setColors] = (0, import_react.useState)("Greige,#C4B7A6");
	const [sizes, setSizes] = (0, import_react.useState)("Standard");
	const [dimensions, setDimensions] = (0, import_react.useState)("");
	const [material, setMaterial] = (0, import_react.useState)("");
	const [stock, setStock] = (0, import_react.useState)(1);
	const [warranty, setWarranty] = (0, import_react.useState)("12 months manufacturer warranty.");
	const [deliveryInfo, setDeliveryInfo] = (0, import_react.useState)(DEFAULT_DELIVERY);
	const [featured, setFeatured] = (0, import_react.useState)(false);
	const [bestseller, setBestseller] = (0, import_react.useState)(false);
	const [newArrival, setNewArrival] = (0, import_react.useState)(false);
	const [specialOffer, setSpecialOffer] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
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
		const out = {};
		for (const line of specs.split("\n")) {
			const [k, ...rest] = line.split(":");
			if (k && rest.length) out[k.trim()] = rest.join(":").trim();
		}
		return out;
	}
	function parseColors() {
		return colors.split("\n").map((l) => l.split(",")).filter((p) => p[0]?.trim()).map(([n, h]) => ({
			name: n.trim(),
			hex: (h ?? "#888888").trim()
		}));
	}
	async function onFile(files) {
		if (!files?.length) return;
		const reads = await Promise.all([...files].map((file) => new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(String(reader.result));
			reader.onerror = reject;
			reader.readAsDataURL(file);
		})));
		setImages((prev) => [prev, ...reads].filter(Boolean).join("\n"));
	}
	async function onSave() {
		try {
			const imageList = images.split("\n").map((s) => s.trim()).filter(Boolean);
			if (!imageList.length) {
				toast.error("Add at least one image URL or upload");
				return;
			}
			const saved = await adminSaveProduct({ data: {
				id: isNew ? void 0 : id,
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
				specialOffer
			} });
			await qc.invalidateQueries();
			toast.success("Product saved");
			await navigate({
				to: "/admin/products/$id",
				params: { id: saved.id }
			});
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Could not save");
		}
	}
	const leaves = (cats.data ?? []).filter((c) => c.parentId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl",
				children: isNew ? "New product" : "Edit product"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Name",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: name,
					onChange: (e) => setName(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Category",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					value: categoryId,
					onChange: (e) => setCategoryId(e.target.value),
					className: "h-11 w-full rounded-md border border-border bg-surface px-3 text-sm",
					children: leaves.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: c.id,
						children: c.name
					}, c.id))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Description",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					value: description,
					onChange: (e) => setDescription(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Price (₦)",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						value: price,
						onChange: (e) => setPrice(Number(e.target.value))
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Compare at (₦)",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						value: compareAt,
						onChange: (e) => setCompareAt(e.target.value === "" ? "" : Number(e.target.value))
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
				label: "Images (one URL per line)",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					value: images,
					onChange: (e) => setImages(e.target.value)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "file",
					accept: "image/*",
					multiple: true,
					className: "mt-2 text-sm",
					onChange: (e) => void onFile(e.target.files)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Specs (Name: value per line)",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					value: specs,
					onChange: (e) => setSpecs(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Colours (Name,#hex per line)",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					value: colors,
					onChange: (e) => setColors(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Sizes (comma separated)",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: sizes,
					onChange: (e) => setSizes(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Dimensions",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: dimensions,
					onChange: (e) => setDimensions(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Material",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: material,
					onChange: (e) => setMaterial(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Stock",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "number",
					value: stock,
					onChange: (e) => setStock(Number(e.target.value))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Warranty",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					value: warranty,
					onChange: (e) => setWarranty(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Delivery",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					value: deliveryInfo,
					onChange: (e) => setDeliveryInfo(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-4 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: featured,
							onChange: (e) => setFeatured(e.target.checked)
						}), " Featured"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: bestseller,
							onChange: (e) => setBestseller(e.target.checked)
						}), " Best seller"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: newArrival,
							onChange: (e) => setNewArrival(e.target.checked)
						}), " New"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: specialOffer,
							onChange: (e) => setSpecialOffer(e.target.checked)
						}), " Offer"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => void onSave(),
				children: "Save product"
			})
		]
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), children]
	});
}
//#endregion
export { AdminProductForm as component };
