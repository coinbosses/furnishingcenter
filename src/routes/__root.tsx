import { createRootRoute, HeadContent, Outlet, Scripts, useRouterState } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { Providers } from "@/components/providers";
import { StoreShell } from "@/components/layout/store-shell";
import appCss from "../styles.css?url";

const APP_NAME = "Furnishing Center";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: APP_NAME },
      { name: "theme-color", content: "#C0B7AE" },
      {
        name: "description",
        content:
          "Furnishing Center — furniture, appliances and electronics in Karu, Abuja. Showroom on Sen George Akume Way.",
      },
    ],
    links: [
      { rel: "icon", type: "image/png", href: "/logo.png" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Outfit:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  component: RootDocument,
});

function RootDocument() {
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="bg-bg text-ink">
        <PreviewHostBridge />
        <AuthProvider>
          <Providers>
            <RootChrome />
          </Providers>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}

function RootChrome() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const bare = pathname === "/login" || pathname.startsWith("/admin");
  if (bare) return <Outlet />;
  return <StoreShell />;
}
