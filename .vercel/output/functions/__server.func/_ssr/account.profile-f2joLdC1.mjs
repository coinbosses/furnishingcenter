import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { m as useCurrentUserState } from "./router-Ba_FUwPp.mjs";
import { t as Button } from "./button-BKKaprw5.mjs";
import { n as Label, t as Input } from "./input-BsJ7Tovf.mjs";
import { t as RedirectToSignIn } from "./gates-hsNySADr.mjs";
import { l as updateMyProfile, n as getMyProfile } from "./account-BDZmsuxf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/account.profile-f2joLdC1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProfilePage() {
	const { user, isPending } = useCurrentUserState();
	const qc = useQueryClient();
	const profile = useQuery({
		queryKey: ["profile"],
		queryFn: () => getMyProfile(),
		enabled: Boolean(user)
	});
	const [fullName, setFullName] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (profile.data) {
			setFullName(profile.data.fullName);
			setPhone(profile.data.phone);
		}
	}, [profile.data]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-xl bg-surface-2" });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-4xl",
			children: "Profile"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Full name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: user.primaryEmail
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: async () => {
						try {
							await updateMyProfile({ data: {
								fullName,
								phone
							} });
							await qc.invalidateQueries({ queryKey: ["profile"] });
							toast.success("Profile updated");
						} catch (e) {
							toast.error(e instanceof Error ? e.message : "Could not save");
						}
					},
					children: "Save"
				})
			]
		})]
	});
}
//#endregion
export { ProfilePage as component };
