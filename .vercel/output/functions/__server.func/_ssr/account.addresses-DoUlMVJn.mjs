import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { m as useCurrentUserState } from "./router-Ba_FUwPp.mjs";
import { t as Button } from "./button-BKKaprw5.mjs";
import { n as Label, t as Input } from "./input-BsJ7Tovf.mjs";
import { t as RedirectToSignIn } from "./gates-hsNySADr.mjs";
import { o as saveAddress, r as listMyAddresses, t as deleteAddress } from "./account-BDZmsuxf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/account.addresses-DoUlMVJn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AddressesPage() {
	const { user, isPending } = useCurrentUserState();
	const qc = useQueryClient();
	const list = useQuery({
		queryKey: ["addresses"],
		queryFn: () => listMyAddresses(),
		enabled: Boolean(user)
	});
	const [open, setOpen] = (0, import_react.useState)(false);
	const [label, setLabel] = (0, import_react.useState)("Home");
	const [fullName, setFullName] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [street, setStreet] = (0, import_react.useState)("");
	const [area, setArea] = (0, import_react.useState)("");
	const [city, setCity] = (0, import_react.useState)("Abuja");
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-xl bg-surface-2" });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	async function onSave() {
		try {
			await saveAddress({ data: {
				label,
				fullName,
				phone,
				street,
				area,
				city,
				state: "FCT",
				isDefault: !(list.data ?? []).length
			} });
			await qc.invalidateQueries({ queryKey: ["addresses"] });
			setOpen(false);
			toast.success("Address saved");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Could not save");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl",
				children: "Addresses"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-3",
				children: (list.data ?? []).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-xl border border-border bg-surface p-4 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-medium",
							children: [
								a.label,
								" ",
								a.isDefault ? "· Default" : ""
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-muted",
							children: [
								a.fullName,
								" · ",
								a.phone
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-muted",
							children: [
								a.street,
								", ",
								a.area,
								", ",
								a.city,
								", ",
								a.state
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "mt-2 text-xs text-danger",
							onClick: async () => {
								await deleteAddress({ data: { id: a.id } });
								await qc.invalidateQueries({ queryKey: ["addresses"] });
							},
							children: "Remove"
						})
					]
				}, a.id))
			}),
			open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3 rounded-xl bg-surface p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Label" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: label,
							onChange: (e) => setLabel(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: fullName,
							onChange: (e) => setFullName(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Phone" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: phone,
							onChange: (e) => setPhone(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Street" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: street,
							onChange: (e) => setStreet(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Area" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: area,
							onChange: (e) => setArea(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "City" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: city,
							onChange: (e) => setCity(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => void onSave(),
						children: "Save address"
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				onClick: () => setOpen(true),
				children: "Add address"
			})
		]
	});
}
//#endregion
export { AddressesPage as component };
