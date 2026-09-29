//#region node_modules/.nitro/vite/services/ssr/assets/money-DjeZ0LfL.js
var naira = new Intl.NumberFormat("en-NG", {
	style: "currency",
	currency: "NGN",
	maximumFractionDigits: 0
});
function formatNaira(amount) {
	return naira.format(amount);
}
function deliveryFeeFor(subtotal, fulfillment) {
	if (fulfillment === "pickup") return 0;
	if (subtotal >= 4e5) return 0;
	return 8500;
}
//#endregion
export { formatNaira as n, deliveryFeeFor as t };
