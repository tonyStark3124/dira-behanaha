import type { Metadata } from "next";
import Link from "next/link";
import { Cookie } from "lucide-react";

export const metadata: Metadata = {
  title: "מדיניות עוגיות — הנחה מושכלת",
};

type CookieRow = { name: string; type: string; purpose: string; duration: string };

const COOKIES: CookieRow[] = [
  {
    name: "theme",
    type: "טכנית הכרחית",
    purpose: "שמירת העדפת מצב תצוגה (כהה / בהיר) — מאוחסן ב-localStorage, לא עוגייה",
    duration: "ללא תפוגה (ניתן לניקוי ידני)",
  },
  {
    name: "__session",
    type: "טכנית הכרחית",
    purpose: "ניהול סשן בסיסי — מאפשר תפקוד תקין של האפליקציה",
    duration: "סיום הסשן",
  },
];

function Row({ c }: { c: CookieRow }) {
  return (
    <tr className="border-t" style={{ borderColor: "var(--border)" }}>
      <td className="py-3 pe-4">
        <code className="rounded px-1.5 py-0.5 text-xs font-mono" style={{ background: "var(--muted)" }}>
          {c.name}
        </code>
      </td>
      <td className="py-3 pe-4 text-xs" style={{ color: "var(--muted-foreground)" }}>{c.type}</td>
      <td className="py-3 pe-4 text-xs" style={{ color: "var(--muted-foreground)" }}>{c.purpose}</td>
      <td className="py-3 text-xs" style={{ color: "var(--muted-foreground)" }}>{c.duration}</td>
    </tr>
  );
}

export default function CookiesPage() {
  return (
    <article className="mx-auto max-w-2xl space-y-8 px-4 py-12 sm:px-6">

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span
            className="flex size-10 items-center justify-center rounded-2xl"
            style={{ background: "color-mix(in oklch, var(--primary) 13%, transparent)", color: "var(--primary)" }}
          >
            <Cookie className="size-5" />
          </span>
          <h1 className="text-2xl font-black tracking-tight">מדיניות עוגיות</h1>
        </div>
        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
          עודכן לאחרונה: 1 בינואר 2025
        </p>
      </div>

      <div className="h-px" style={{ backgroundColor: "var(--border)" }} />

      <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
        קצר ולעניין: יש כאן עוגייה אחת שזוכרת אם בחרתם מצב כהה או בהיר. זהו.
        אין פרסומות, אין מעקב, אין צד-שלישי.
      </p>

      <section className="space-y-3">
        <h2 className="text-base font-bold">מהן עוגיות?</h2>
        <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
          עוגיות הן קבצי טקסט קטנים שמאוחסנים במכשירכם בעת גלישה באתר.
          הן מאפשרות לאתר לזכור מידע בין בקשות שונות ולספק חווית שימוש עקבית.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold">העוגיות שבשימוש</h2>
        <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: "var(--border)" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "color-mix(in oklch, var(--muted) 55%, transparent)" }}>
                <th className="py-3 pe-4 text-start text-xs font-semibold">שם</th>
                <th className="py-3 pe-4 text-start text-xs font-semibold">סוג</th>
                <th className="py-3 pe-4 text-start text-xs font-semibold">מטרה</th>
                <th className="py-3 text-start text-xs font-semibold">תקופה</th>
              </tr>
            </thead>
            <tbody>
              {COOKIES.map((c) => <Row key={c.name} c={c} />)}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold">ניהול עוגיות</h2>
        <div className="space-y-2 text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
          <p>
            ניתן לנהל ולמחוק עוגיות דרך הגדרות הדפדפן. שימו לב כי מחיקת
            עוגיות טכניות הכרחיות עלולה לפגוע בתפקוד האתר.
          </p>
          <p>
            הפעלת &quot;מצב גלישה פרטית&quot; (Incognito) מונעת שמירת עוגיות
            לאחר סגירת הדפדפן.
          </p>
          <p>
            לאחר מחיקת העוגיות, העדפות כגון מצב כהה יתאפסו.
          </p>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-bold">שאלות</h2>
        <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
          לשאלות בנושא עוגיות ופרטיות:{" "}
          <a href="mailto:tuviahefets@gmail.com" className="underline underline-offset-2" style={{ color: "var(--primary)" }}>
            tuviahefets@gmail.com
          </a>
        </p>
      </section>

      <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70" style={{ color: "var(--primary)" }}>
        → חזרה לדשבורד
      </Link>
    </article>
  );
}
