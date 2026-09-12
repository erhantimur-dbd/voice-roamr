import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { LocaleProvider } from "@/lib/locale";
import { META, SITE } from "@/lib/site";
import { LOCALES } from "@/lib/product";
import appCss from "../styles.css?url";

const fetchSessionUser = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const { getSessionUser } = await import("@/lib/auth/verify.server");
    const u = await getSessionUser();
    return u ? { id: u.id, email: u.email } : null;
  } catch (err) {
    console.error("[roamr] session lookup failed", err);
    return null;
  }
});

const queryClient = new QueryClient();

function jsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: SITE.name,
        legalName: SITE.product,
        url: SITE.url,
        email: SITE.emails.hello,
        slogan: SITE.tagline,
        sameAs: [SITE.social.x],
      },
      {
        "@type": "SoftwareApplication",
        name: SITE.product,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        description: META.description,
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "USD",
          lowPrice: "49",
          highPrice: "399",
        },
      },
      {
        "@type": "WebSite",
        name: SITE.product,
        url: SITE.url,
        inLanguage: LOCALES.map((l) => l.code),
      },
    ],
  };
}

export const Route = createRootRoute({
  beforeLoad: async ({ location }) => {
    if (location.pathname.startsWith("/api/")) {
      return { sessionUser: null };
    }
    try {
      return { sessionUser: await fetchSessionUser() };
    } catch (err) {
      console.error("[roamr] beforeLoad session failed", err);
      return { sessionUser: null };
    }
  },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: META.title },
      { name: "description", content: META.description },
      { name: "theme-color", content: "#0A0A0A" },
      { property: "og:title", content: META.title },
      { property: "og:description", content: META.description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE.url },
      { property: "og:site_name", content: SITE.product },
      { property: "og:image", content: `${SITE.url}/og.jpg` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: META.title },
      { name: "twitter:description", content: META.description },
      { name: "twitter:image", content: `${SITE.url}/og.jpg` },
      { name: "author", content: SITE.name },
      { name: "robots", content: "index,follow,max-image-preview:large" },
      { name: "keywords", content: META.keywords },
      { name: "apple-mobile-web-app-title", content: SITE.product },
      { name: "application-name", content: SITE.product },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
      },
      { rel: "canonical", href: SITE.url },
      { rel: "alternate", type: "text/plain", href: "/llms.txt", title: "LLM brief" },
      ...LOCALES.map((l) => ({
        rel: "alternate",
        hrefLang: l.code,
        href: `${SITE.url}/?hl=${l.code}`,
      })),
      { rel: "alternate", hrefLang: "x-default", href: SITE.url },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(jsonLd()),
      },
    ],
  }),
  component: RootDocument,
});

function RootDocument() {
  return (
    <html lang="en" suppressHydrationWarning className="antialiased">
      <head>
        <HeadContent />
      </head>
      <body className="bg-bg text-fg">
        <PreviewHostBridge />
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <LocaleProvider>
              <Outlet />
              <Toaster
                theme="light"
                position="bottom-right"
                toastOptions={{
                  style: {
                    background: "#FFFFFF",
                    border: "1px solid #E4E4E7",
                    color: "#0A0A0A",
                  },
                }}
              />
            </LocaleProvider>
          </AuthProvider>
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  );
}
