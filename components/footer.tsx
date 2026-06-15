import Link from "next/link";
import { Accessibility, FileText, Shield, Cookie, Mail } from "lucide-react";

const LEGAL = [
  { href: "/accessibility", label: "הצהרת נגישות",  icon: Accessibility },
  { href: "/terms",         label: "תנאי שימוש",     icon: FileText      },
  { href: "/privacy",       label: "מדיניות פרטיות", icon: Shield        },
  { href: "/cookies",       label: "מדיניות עוגיות", icon: Cookie        },
];

export function Footer() {
  return (
    <footer
      className="mt-16 border-t px-4 py-10 sm:px-6"
      style={{ backgroundColor: "color-mix(in oklch, var(--card) 60%, transparent)" }}
    >
      <div className="mx-auto max-w-screen-xl">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">

          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span
                className="flex size-8 items-center justify-center rounded-xl text-sm"
                style={{
                  background: "color-mix(in oklch, var(--primary) 14%, transparent)",
                  color: "var(--primary)",
                  boxShadow:
                    "0 0 0 1px color-mix(in oklch, var(--primary) 22%, transparent)",
                }}
              >
                🚀
              </span>
              <span className="text-sm font-bold">הנחה מושכלת</span>
            </div>
            <p
              className="text-xs leading-relaxed"
              style={{ color: "var(--muted-foreground)" }}
            >
              פרויקט חינמי שעוזר להחליט לאן להגיש בקשה לדיור.
              הנתונים ממשרד הבינוי והשיכון — בלי ייעוץ, בלי פרסומות.
            </p>
            <a
              href="mailto:tuviahefets@gmail.com"
              className="inline-flex items-center gap-1.5 text-xs transition-colors hover:text-foreground"
              style={{ color: "var(--muted-foreground)" }}
            >
              <Mail className="size-3" aria-hidden />
              tuviahefets@gmail.com
            </a>
          </div>

          {/* Legal links */}
          <div className="space-y-3">
            <h3
              className="text-[10px] font-semibold uppercase tracking-widest"
              style={{ color: "var(--muted-foreground)", opacity: 0.65 }}
            >
              קישורים משפטיים
            </h3>
            <ul className="space-y-2">
              {LEGAL.map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="inline-flex items-center gap-2 text-xs transition-colors hover:text-foreground"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    <Icon className="size-3.5 shrink-0" aria-hidden />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Accessibility commitment */}
          <div className="space-y-3">
            <h3
              className="text-[10px] font-semibold uppercase tracking-widest"
              style={{ color: "var(--muted-foreground)", opacity: 0.65 }}
            >
              מחויבות לנגישות
            </h3>
            <div
              className="space-y-2 rounded-2xl p-4"
              style={{
                background:
                  "color-mix(in oklch, var(--primary) 6%, transparent)",
                border:
                  "1px solid color-mix(in oklch, var(--primary) 18%, transparent)",
              }}
            >
              <div className="flex items-center gap-2">
                <Accessibility
                  className="size-4 shrink-0"
                  style={{ color: "var(--primary)" }}
                  aria-hidden
                />
                <span className="text-xs font-semibold">
                  תקן WCAG 2.1 — רמה AA
                </span>
              </div>
              <p
                className="text-[11px] leading-relaxed"
                style={{ color: "var(--muted-foreground)" }}
              >
                אתר זה עומד בדרישות תקנות שוויון זכויות לאנשים עם מוגבלות
                (התאמות נגישות לשירות), תשע״ג-2013.
              </p>
              <Link
                href="/accessibility"
                className="text-[11px] font-medium underline underline-offset-2 transition-opacity hover:opacity-80"
                style={{ color: "var(--primary)" }}
              >
                לקריאת הצהרת הנגישות המלאה ←
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t pt-5"
          style={{
            borderColor:
              "color-mix(in oklch, var(--border) 55%, transparent)",
          }}
        >
          <p className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>
            © 2025 הנחה מושכלת — כל הזכויות שמורות
          </p>
          <p
            className="text-[11px]"
            style={{ color: "var(--muted-foreground)", opacity: 0.6 }}
          >
            הנתונים מגיעים ממשרד הבינוי והשיכון — ייתכן שאינם מעודכנים לחלוטין
          </p>
        </div>
      </div>
    </footer>
  );
}
