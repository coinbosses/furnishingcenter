import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as cn } from "./catalog-data-087TMwXI.mjs";
import { n as formatNaira } from "./money-DjeZ0LfL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/price-tag-7NSvamv2.js
var import_jsx_runtime = require_jsx_runtime();
function PriceTag({ price, compareAt, className }) {
	const onSale = compareAt != null && compareAt > price;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex flex-wrap items-baseline gap-2 tabular-nums", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-medium text-ink",
			children: formatNaira(price)
		}), onSale ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm text-subtle line-through",
			children: formatNaira(compareAt)
		}) : null]
	});
}
//#endregion
export { PriceTag as t };
