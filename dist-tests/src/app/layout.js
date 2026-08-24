"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
exports.default = RootLayout;
const jsx_runtime_1 = require("react/jsx-runtime");
const google_1 = require("next/font/google");
require("./globals.css");
const theme_provider_1 = require("@/components/providers/theme-provider");
const sonner_1 = require("sonner");
const spaceGrotesk = (0, google_1.Space_Grotesk)({
    subsets: ["latin"],
    variable: "--font-heading",
    display: "swap",
});
const plusJakartaSans = (0, google_1.Plus_Jakarta_Sans)({
    subsets: ["latin"],
    variable: "--font-body",
    display: "swap",
});
exports.metadata = {
    title: {
        default: "Flowra — Automate without limits.",
        template: "%s — Flowra",
    },
    description: "Flowra connects your business tools, understands your workflows, and turns repetitive work into automation — without the complexity.",
    metadataBase: new URL("https://flowra.app"),
    openGraph: {
        title: "Flowra — Automate without limits.",
        description: "Business automation for modern teams.",
        siteName: "Flowra",
    },
};
function RootLayout({ children, }) {
    return ((0, jsx_runtime_1.jsx)("html", { lang: "en", suppressHydrationWarning: true, "data-scroll-behavior": "smooth", children: (0, jsx_runtime_1.jsx)("body", { className: `${spaceGrotesk.variable} ${plusJakartaSans.variable} font-sans antialiased bg-[var(--background)] text-[var(--foreground)]`, children: (0, jsx_runtime_1.jsxs)(theme_provider_1.ThemeProvider, { children: [children, (0, jsx_runtime_1.jsx)(sonner_1.Toaster, { position: "bottom-right", toastOptions: {
                            style: {
                                background: "var(--surface-elevated)",
                                border: "1px solid var(--border-strong)",
                                color: "var(--foreground)",
                            },
                        } })] }) }) }));
}
