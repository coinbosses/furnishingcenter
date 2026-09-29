import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { C as useNavigate, _ as Outlet, b as createRootRoute, f as Scripts, g as createRouter, m as useRouterState, p as HeadContent, v as lazyRouteComponent, w as useRouter, x as Link, y as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, r as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { r as createServerFn, s as __exportAll } from "./ssr.mjs";
import { _ as cn, d as SEED_CATEGORIES, m as STORE } from "./catalog-data-087TMwXI.mjs";
import { bn as union, cn as _enum, dn as boolean, gn as object, hn as number, pn as literal, yn as string } from "../_libs/@better-auth/core+[...].mjs";
import { t as authClient } from "./client-1vAx-gM_.mjs";
import { n as auth } from "./server-DeWjeGKS.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { d as MapPin, f as LayoutGrid, i as ShoppingBag, m as Heart, o as Search, p as House, r as TriangleAlert, t as User } from "../_libs/lucide-react.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/products-lHY0nUXD.js
var listInput = object({
	category: string().optional(),
	q: string().optional(),
	sort: _enum([
		"featured",
		"price_asc",
		"price_desc",
		"newest",
		"name"
	]).optional(),
	minPrice: number().optional(),
	maxPrice: number().optional(),
	inStock: boolean().optional(),
	flag: _enum([
		"featured",
		"bestseller",
		"newArrival",
		"specialOffer"
	]).optional()
});
var listCategories = createServerFn({ method: "GET" }).handler(createSsrRpc("1f27125c21b555e17b81b0e1f5d452735bf7800f98431cde6aae8979df56dbc4"));
createServerFn({ method: "GET" }).handler(createSsrRpc("477918193c1b67ab41129bf938ab15285270cbbf256e389e8e6751ea436320df"));
var listProducts = createServerFn({ method: "GET" }).validator((d) => listInput.parse(d ?? {})).handler(createSsrRpc("f77ecbd962621f24ca6b18b109613b9bc6bc68cd4fd61a81d59ee40c85f43786"));
var getProduct = createServerFn({ method: "GET" }).validator(object({ id: string() })).handler(createSsrRpc("8ebc21f3eb1ce8393febc512eea25da64a0baaf5cbc8df794b278ff10393e8c5"));
var relatedProducts = createServerFn({ method: "GET" }).validator(object({
	id: string(),
	categoryId: string()
})).handler(createSsrRpc("a82955cd250d9379aca0a7ed27eccdc7ee2e5b4354af4a1c3c02fcc398bd3075"));
var homeCatalog = createServerFn({ method: "GET" }).handler(createSsrRpc("7f2de324b470bf87c0c1ceae3eee919a1688a6e7fedb2502e0bdc42c776af612"));
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-Ba_FUwPp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
function Providers({ children }) {
	const [client] = (0, import_react.useState)(() => new QueryClient({ defaultOptions: { queries: {
		staleTime: 2e4,
		retry: 1,
		refetchOnWindowFocus: false
	} } }));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
			position: "top-center",
			toastOptions: { className: "!bg-surface !text-ink !border-border !shadow-none !font-sans" }
		})]
	});
}
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	const { data, isPending } = authClient.useSession();
	const user = data?.user;
	return {
		user: user ? {
			id: user.id,
			displayName: user.name ?? null,
			primaryEmail: user.email ?? null,
			profileImageUrl: user.image ?? null,
			isDevFallback: false
		} : null,
		isPending
	};
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
function sameLine(a, b) {
	return a.productId === b.productId && a.color === b.color && a.size === b.size;
}
var useCart = create()(persist((set, get) => ({
	items: [],
	add: (item) => {
		const items = [...get().items];
		const idx = items.findIndex((i) => sameLine(i, item));
		if (idx >= 0) items[idx] = {
			...items[idx],
			quantity: items[idx].quantity + item.quantity
		};
		else items.push(item);
		set({ items });
	},
	setQty: (item, quantity) => {
		if (quantity <= 0) {
			set({ items: get().items.filter((i) => !sameLine(i, item)) });
			return;
		}
		set({ items: get().items.map((i) => sameLine(i, item) ? {
			...i,
			quantity
		} : i) });
	},
	remove: (item) => set({ items: get().items.filter((i) => !sameLine(i, item)) }),
	clear: () => set({ items: [] })
}), { name: "fc-cart" }));
var useWishlistLocal = create()(persist((set, get) => ({
	ids: [],
	toggle: (id) => {
		const has = get().ids.includes(id);
		set({ ids: has ? get().ids.filter((x) => x !== id) : [...get().ids, id] });
		return !has;
	},
	has: (id) => get().ids.includes(id),
	setAll: (ids) => set({ ids })
}), { name: "fc-wishlist" }));
var useRecent = create()(persist((set, get) => ({
	ids: [],
	push: (id) => {
		set({ ids: [id, ...get().ids.filter((x) => x !== id)].slice(0, 8) });
	}
}), { name: "fc-recent" }));
var tabs = [
	{
		to: "/",
		label: "Home",
		icon: House
	},
	{
		to: "/categories",
		label: "Categories",
		icon: LayoutGrid
	},
	{
		to: "/search",
		label: "Search",
		icon: Search
	},
	{
		to: "/wishlist",
		label: "Wishlist",
		icon: Heart
	},
	{
		to: "/cart",
		label: "Cart",
		icon: ShoppingBag
	},
	{
		to: "/account",
		label: "Account",
		icon: User
	}
];
var departments = [
	{
		slug: "furniture",
		label: "Furniture"
	},
	{
		slug: "appliances",
		label: "Appliances"
	},
	{
		slug: "electronics",
		label: "Electronics"
	}
];
function StoreShell() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const navigate = useNavigate();
	const cartCount = useCart((s) => s.items.reduce((n, i) => n + i.quantity, 0));
	const { user, isPending } = useCurrentUserState();
	function onSearch(e) {
		e.preventDefault();
		const q = String(new FormData(e.currentTarget).get("q") ?? "").trim();
		navigate({
			to: "/search",
			search: { q: q || void 0 }
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-30 border-b border-border/70 bg-bg/90 backdrop-blur-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "hidden border-b border-border/70 bg-primary text-primary-fg md:block",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto flex h-9 max-w-6xl items-center justify-between gap-4 px-4 text-xs tracking-wide",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Karu showroom · Mon–Sat 9:00–19:00 · Sun 12:00–17:00" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: "Furniture, appliances and electronics stay in their own rooms"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: `tel:${STORE.phoneTel}`,
								children: STORE.phoneDisplay
							})
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							className: "flex min-w-0 items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-10 shrink-0 place-items-center rounded-md bg-primary font-display text-lg text-primary-fg",
								children: "FC"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block truncate font-display text-xl leading-none tracking-tight",
									children: "Furnishing Center"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-1 block text-xs uppercase tracking-widest text-muted",
									children: "Karu · Abuja"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
							className: "hidden items-center gap-5 text-sm lg:flex",
							children: [departments.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/categories/$slug",
								params: { slug: d.slug },
								className: "text-muted hover:text-ink",
								children: d.label
							}, d.slug)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/contact",
								className: "text-muted hover:text-ink",
								children: "Showroom"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: onSearch,
							className: "hidden min-w-0 flex-1 md:block md:max-w-xs lg:max-w-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "sr-only",
								htmlFor: "header-q",
								children: "Search"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "header-q",
								name: "q",
								placeholder: "Search the floor",
								className: "h-11 w-full rounded-full border border-border bg-surface px-4 text-sm"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/search",
									"aria-label": "Search",
									className: "hidden size-11 place-items-center rounded-full hover:bg-surface-2 md:grid",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/wishlist",
									"aria-label": "Wishlist",
									className: "hidden size-11 place-items-center rounded-full hover:bg-surface-2 md:grid",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "size-5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/cart",
									"aria-label": "Cart",
									className: "relative grid size-11 place-items-center rounded-full hover:bg-surface-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "size-5" }), cartCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "absolute right-1 top-1 grid min-w-5 place-items-center rounded-full bg-primary px-1 text-xs text-primary-fg",
										children: cartCount
									}) : null]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: user ? "/account" : "/login",
									className: "hidden h-11 items-center rounded-full px-3 text-sm hover:bg-surface-2 md:flex",
									children: isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block w-14" }) : user ? user.displayName?.split(" ")[0] ?? "Account" : "Sign in"
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "mx-auto w-full max-w-6xl px-4 pb-8 pt-5 md:pb-16",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "border-t border-border bg-surface pb-28 md:pb-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "md:col-span-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-3xl",
									children: "Furnishing Center"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-3 max-w-xs text-sm leading-relaxed text-muted",
									children: [STORE.tagline, ". Every photograph is the piece itself — not a stand-in."]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs uppercase tracking-widest text-muted",
								children: "Shop"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "mt-3 space-y-2 text-sm",
								children: [
									departments.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/categories/$slug",
										params: { slug: d.slug },
										className: "hover:underline",
										children: d.label
									}) }, d.slug)),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/categories",
										className: "hover:underline",
										children: "All categories"
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/search",
										className: "hover:underline",
										children: "Search"
									}) })
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs uppercase tracking-widest text-muted",
									children: "Showroom"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-3 flex gap-2 text-sm leading-relaxed text-muted",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "mt-0.5 size-4 shrink-0" }), STORE.address]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-muted",
									children: STORE.hours
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/contact",
									className: "mt-3 inline-block text-sm underline",
									children: "Directions and WhatsApp"
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs uppercase tracking-widest text-muted",
									children: "Talk to the floor"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: `tel:${STORE.phoneTel}`,
									className: "mt-3 block text-sm hover:underline",
									children: STORE.phoneDisplay
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: `https://wa.me/${STORE.whatsapp}`,
									className: "mt-2 block text-sm text-muted hover:text-ink",
									children: "WhatsApp"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-4 text-xs leading-relaxed text-muted",
									children: [
										"Bank transfer: ",
										STORE.bank.name,
										" · ",
										STORE.bank.accountName,
										" · ",
										STORE.bank.accountNumber
									]
								})
							] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "border-t border-border",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3",
							children: departments.map((d) => {
								const children = SEED_CATEGORIES.filter((c) => c.parentId === d.slug).sort((a, b) => a.sortOrder - b.sortOrder);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/categories/$slug",
									params: { slug: d.slug },
									className: "font-display text-2xl",
									children: d.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-3 space-y-1.5 text-sm text-muted",
									children: children.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/categories/$slug",
										params: { slug: c.id },
										className: "hover:text-ink",
										children: c.name
									}) }, c.id))
								})] }, d.slug);
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "border-t border-border",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 md:flex-row md:items-center md:justify-between",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs uppercase tracking-widest text-muted",
									children: "FCT delivery"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted",
									children: "Karu · Nyanya · Jabi · Wuse · Garki · Maitama · Asokoro · Gwarinpa · Lugbe"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm text-muted",
									children: ["Card or ", STORE.bank.name]
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "border-t border-border",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mx-auto max-w-6xl px-4 py-4 text-xs text-muted",
							children: "Furnishing Center, Karu. Prices in naira. Every item sits in one category, and the photograph is that item. Delivery across the FCT, pickup at the showroom."
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "grid grid-cols-6",
					children: tabs.map((tab) => {
						const Icon = tab.icon;
						const active = tab.to === "/" ? pathname === "/" : pathname === tab.to || pathname.startsWith(`${tab.to}/`);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: tab.to,
							className: cn("flex min-h-14 flex-col items-center justify-center gap-0.5 text-xs", active ? "text-ink" : "text-muted"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5" }), tab.to === "/cart" && cartCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute -right-2 -top-1 grid min-w-4 place-items-center rounded-full bg-primary px-1 text-xs text-primary-fg",
									children: cartCount
								}) : null]
							}), tab.label]
						}) }, tab.to);
					})
				})
			})
		]
	});
}
var styles_default = "/assets/styles-CSOhlaFx.css";
var APP_NAME = "Furnishing Center";
var Route$27 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, viewport-fit=cover"
			},
			{ title: APP_NAME },
			{
				name: "theme-color",
				content: "#F3EEE6"
			},
			{
				name: "description",
				content: "Furnishing Center — furniture, appliances and electronics in Karu, Abuja. Showroom on Sen George Akume Way."
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Outfit:wght@400;500;600;700&display=swap"
			}
		]
	}),
	component: RootDocument
});
function RootDocument() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "bg-bg text-ink",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Providers, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RootChrome, {}) }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	});
}
function RootChrome() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	if (pathname === "/login" || pathname.startsWith("/admin")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoreShell, {});
}
var $$splitComponentImporter$25 = () => import("./routes-B-ZAZ5mw.mjs");
var Route$26 = createFileRoute("/")({
	loader: () => homeCatalog(),
	component: lazyRouteComponent($$splitComponentImporter$25, "component")
});
var $$splitComponentImporter$24 = () => import("./account-Bc49Pi2f.mjs");
var Route$25 = createFileRoute("/account")({ component: lazyRouteComponent($$splitComponentImporter$24, "component") });
var $$splitComponentImporter$23 = () => import("./admin-Dx95Bv6t.mjs");
var Route$24 = createFileRoute("/admin")({ component: lazyRouteComponent($$splitComponentImporter$23, "component") });
var $$splitComponentImporter$22 = () => import("./cart-BDwOKbeI.mjs");
var Route$23 = createFileRoute("/cart")({ component: lazyRouteComponent($$splitComponentImporter$22, "component") });
var $$splitComponentImporter$21 = () => import("./checkout-NlO8lSKa.mjs");
var Route$22 = createFileRoute("/checkout")({ component: lazyRouteComponent($$splitComponentImporter$21, "component") });
var $$splitComponentImporter$20 = () => import("./contact-DQ0oBSdy.mjs");
var Route$21 = createFileRoute("/contact")({ component: lazyRouteComponent($$splitComponentImporter$20, "component") });
var $$splitComponentImporter$19 = () => import("./login-Ba3eXj0w.mjs");
var Route$20 = createFileRoute("/login")({
	validateSearch: (s) => ({ redirect: typeof s.redirect === "string" ? s.redirect : void 0 }),
	component: lazyRouteComponent($$splitComponentImporter$19, "component")
});
var $$splitComponentImporter$18 = () => import("./search-LHH1xM70.mjs");
var Route$19 = createFileRoute("/search")({
	validateSearch: (s) => ({ q: typeof s.q === "string" ? s.q : void 0 }),
	component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
var $$splitComponentImporter$17 = () => import("./wishlist-BPG2ieGk.mjs");
var Route$18 = createFileRoute("/wishlist")({ component: lazyRouteComponent($$splitComponentImporter$17, "component") });
var $$splitComponentImporter$16 = () => import("./account.index-COMHY3YQ.mjs");
var Route$17 = createFileRoute("/account/")({ component: lazyRouteComponent($$splitComponentImporter$16, "component") });
var $$splitComponentImporter$15 = () => import("./account.addresses-DoUlMVJn.mjs");
var Route$16 = createFileRoute("/account/addresses")({ component: lazyRouteComponent($$splitComponentImporter$15, "component") });
var $$splitComponentImporter$14 = () => import("./account.orders-CYH2sxF0.mjs");
var Route$15 = createFileRoute("/account/orders")({ component: lazyRouteComponent($$splitComponentImporter$14, "component") });
var $$splitComponentImporter$13 = () => import("./account.profile-f2joLdC1.mjs");
var Route$14 = createFileRoute("/account/profile")({ component: lazyRouteComponent($$splitComponentImporter$13, "component") });
var $$splitComponentImporter$12 = () => import("./admin.index-CbLl3h_-.mjs");
var Route$13 = createFileRoute("/admin/")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
var $$splitComponentImporter$11 = () => import("./admin.banners-43J4gz-M.mjs");
var Route$12 = createFileRoute("/admin/banners")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("./admin.categories-CWvZ8nzD.mjs");
var Route$11 = createFileRoute("/admin/categories")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./admin.customers-CpeOpnD0.mjs");
var Route$10 = createFileRoute("/admin/customers")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./admin.inventory-CYGZokDH.mjs");
var Route$9 = createFileRoute("/admin/inventory")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./admin.orders-fYzj3F2R.mjs");
var Route$8 = createFileRoute("/admin/orders")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./admin.products-DiZNMBA_.mjs");
var Route$7 = createFileRoute("/admin/products")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./categories.index-Ci5VIGcI.mjs");
var Route$6 = createFileRoute("/categories/")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./categories._slug-5Mufgjbd.mjs");
var Route$5 = createFileRoute("/categories/$slug")({
	loader: async ({ params }) => {
		const [categories, products] = await Promise.all([listCategories(), listProducts({ data: { category: params.slug } })]);
		return {
			categories,
			products
		};
	},
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./product._slug-BtGzWNhq.mjs");
var Route$4 = createFileRoute("/product/$slug")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./account.orders._id-DvGW1FFw.mjs");
var Route$3 = createFileRoute("/account/orders/$id")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./admin.orders._id-B1mNhdK2.mjs");
var Route$2 = createFileRoute("/admin/orders/$id")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./admin.products._id-Cb9ZKpce.mjs");
var Route$1 = createFileRoute("/admin/products/$id")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var Route = createFileRoute("/api/auth/$")({ server: { handlers: {
	GET: ({ request }) => auth.handler(request),
	POST: ({ request }) => auth.handler(request)
} } });
var IndexRoute = Route$26.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$27
});
var AccountRoute = Route$25.update({
	id: "/account",
	path: "/account",
	getParentRoute: () => Route$27
});
var AdminRoute = Route$24.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$27
});
var CartRoute = Route$23.update({
	id: "/cart",
	path: "/cart",
	getParentRoute: () => Route$27
});
var CheckoutRoute = Route$22.update({
	id: "/checkout",
	path: "/checkout",
	getParentRoute: () => Route$27
});
var ContactRoute = Route$21.update({
	id: "/contact",
	path: "/contact",
	getParentRoute: () => Route$27
});
var LoginRoute = Route$20.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$27
});
var SearchRoute = Route$19.update({
	id: "/search",
	path: "/search",
	getParentRoute: () => Route$27
});
var WishlistRoute = Route$18.update({
	id: "/wishlist",
	path: "/wishlist",
	getParentRoute: () => Route$27
});
var AccountIndexRoute = Route$17.update({
	id: "/",
	path: "/",
	getParentRoute: () => AccountRoute
});
var AccountAddressesRoute = Route$16.update({
	id: "/addresses",
	path: "/addresses",
	getParentRoute: () => AccountRoute
});
var AccountOrdersRoute = Route$15.update({
	id: "/orders",
	path: "/orders",
	getParentRoute: () => AccountRoute
});
var AccountProfileRoute = Route$14.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => AccountRoute
});
var AdminIndexRoute = Route$13.update({
	id: "/",
	path: "/",
	getParentRoute: () => AdminRoute
});
var AdminBannersRoute = Route$12.update({
	id: "/banners",
	path: "/banners",
	getParentRoute: () => AdminRoute
});
var AdminCategoriesRoute = Route$11.update({
	id: "/categories",
	path: "/categories",
	getParentRoute: () => AdminRoute
});
var AdminCustomersRoute = Route$10.update({
	id: "/customers",
	path: "/customers",
	getParentRoute: () => AdminRoute
});
var AdminInventoryRoute = Route$9.update({
	id: "/inventory",
	path: "/inventory",
	getParentRoute: () => AdminRoute
});
var AdminOrdersRoute = Route$8.update({
	id: "/orders",
	path: "/orders",
	getParentRoute: () => AdminRoute
});
var AdminProductsRoute = Route$7.update({
	id: "/products",
	path: "/products",
	getParentRoute: () => AdminRoute
});
var CategoriesIndexRoute = Route$6.update({
	id: "/categories/",
	path: "/categories/",
	getParentRoute: () => Route$27
});
var CategoriesSlugRoute = Route$5.update({
	id: "/categories/$slug",
	path: "/categories/$slug",
	getParentRoute: () => Route$27
});
var ProductSlugRoute = Route$4.update({
	id: "/product/$slug",
	path: "/product/$slug",
	getParentRoute: () => Route$27
});
var AccountOrdersIdRoute = Route$3.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => AccountOrdersRoute
});
var AdminOrdersIdRoute = Route$2.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => AdminOrdersRoute
});
var AdminProductsIdRoute = Route$1.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => AdminProductsRoute
});
var ApiAuthSplatRoute = Route.update({
	id: "/api/auth/$",
	path: "/api/auth/$",
	getParentRoute: () => Route$27
});
var AccountOrdersRouteChildren = { AccountOrdersIdRoute };
var AccountRouteChildren = {
	AccountAddressesRoute,
	AccountOrdersRoute: AccountOrdersRoute._addFileChildren(AccountOrdersRouteChildren),
	AccountProfileRoute,
	AccountIndexRoute
};
var AccountRouteWithChildren = AccountRoute._addFileChildren(AccountRouteChildren);
var AdminOrdersRouteChildren = { AdminOrdersIdRoute };
var AdminOrdersRouteWithChildren = AdminOrdersRoute._addFileChildren(AdminOrdersRouteChildren);
var AdminProductsRouteChildren = { AdminProductsIdRoute };
var AdminRouteChildren = {
	AdminBannersRoute,
	AdminCategoriesRoute,
	AdminCustomersRoute,
	AdminInventoryRoute,
	AdminOrdersRoute: AdminOrdersRouteWithChildren,
	AdminProductsRoute: AdminProductsRoute._addFileChildren(AdminProductsRouteChildren),
	AdminIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AccountRoute: AccountRouteWithChildren,
	AdminRoute: AdminRoute._addFileChildren(AdminRouteChildren),
	CartRoute,
	CheckoutRoute,
	ContactRoute,
	LoginRoute,
	SearchRoute,
	WishlistRoute,
	CategoriesSlugRoute,
	ProductSlugRoute,
	CategoriesIndexRoute,
	ApiAuthSplatRoute
};
var routeTree = Route$27._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent,
		defaultPreload: "intent",
		scrollRestoration: true
	});
}
//#endregion
export { listProducts as _, Route$4 as a, Route$20 as c, useRecent as d, useWishlistLocal as f, listCategories as g, getProduct as h, Route$3 as i, Route$26 as l, useCurrentUserState as m, Route$1 as n, Route$5 as o, useCurrentUser as p, Route$2 as r, Route$19 as s, router_exports as t, useCart as u, relatedProducts as v };
