export default {
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
        fontFamily: {
            sans: ["var(--font-sans)"],
            heading: ["var(--font-heading)"]
        },
        extend: {
            fontWeight: {
                book: "300",
                medium: "500"
            },
            fontSize: {
                "brand-h1": ["2.25rem", { lineHeight: "1.08", letterSpacing: "-0.03em", fontWeight: "300" }],
                "brand-h2": ["1.9375rem", { lineHeight: "1.1", letterSpacing: "-0.035em", fontWeight: "400" }],
                "brand-h3": ["1.8125rem", { lineHeight: "1.1", letterSpacing: "-0.02875em", fontWeight: "300" }],
                "brand-h4": ["1.75rem", { lineHeight: "1.1", letterSpacing: "-0.05em", fontWeight: "300" }]
            },
            borderRadius: {
                brand: "var(--radius-md)"
            },
            colors: {
                accent: {
                    500: "var(--gs-accent-500)",
                    600: "var(--gs-accent-600)"
                },
                gs: {
                    "primary-900": "var(--gs-primary-900)",
                    "primary-700": "var(--gs-primary-700)",
                    neon: "var(--gs-neon)",
                    bg: "var(--gs-bg)",
                    surface: "var(--gs-surface)",
                    muted: "var(--gs-muted)",
                    border: "var(--gs-border)",
                    text: "var(--gs-text)",
                    "text-muted": "var(--gs-text-muted)",
                    success: "var(--gs-success)",
                    warning: "var(--gs-warning)",
                    error: "var(--gs-error)"
                },
                pmg: {
                    bg: "var(--pmg-bg)",
                    surface: "var(--pmg-surface)"
                }
            },
            boxShadow: {
                soft: "0 12px 40px rgba(15, 23, 42, 0.08)",
                card: "0 15px 30px -8px rgba(0, 0, 0, 0.08)"
            }
        }
    },
    plugins: []
};
