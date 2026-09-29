import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as cn } from "./catalog-data-087TMwXI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/input-BsJ7Tovf.js
var import_jsx_runtime = require_jsx_runtime();
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("h-11 w-full rounded-md border border-border bg-surface px-3 text-sm text-ink placeholder:text-subtle outline-none transition-shadow focus:ring-2 focus:ring-primary/30", className),
		...props
	});
}
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("min-h-28 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink placeholder:text-subtle outline-none transition-shadow focus:ring-2 focus:ring-primary/30", className),
		...props
	});
}
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: cn("text-xs font-medium uppercase tracking-wide text-muted", className),
		...props
	});
}
//#endregion
export { Label as n, Textarea as r, Input as t };
