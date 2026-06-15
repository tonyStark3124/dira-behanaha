import type { Metadata } from "next";
import Link from "next/link";
import { Accessibility, CheckCircle, AlertCircle, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "הצהרת נגישות — הנחה מושכלת",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-base font-bold">{title}</h2>
      <div className="space-y-2 text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
        {children}
      </div>
    </section>
  );
}

function Item({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      {ok
        ? <CheckCircle className="mt-0.5 size-4 shrink-0" style={{ color: "var(--score-high)" }} />
        : <AlertCircle className="mt-0.5 size-4 shrink-0" style={{ color: "var(--chart-4)" }} />
      }
      <span>{children}</span>
    </li>
  );
}

export default function AccessibilityPage() {
  return (
    <article className="mx-auto max-w-2xl space-y-10 px-4 py-12 sm:px-6">

      {/* Hero */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span
            className="flex size-10 items-center justify-center rounded-2xl"
            style={{
              background: "color-mix(in oklch, var(--primary) 13%, transparent)",
              color: "var(--primary)",
            }}
          >
            <Accessibility className="size-5" />
          </span>
          <h1 className="text-2xl font-black tracking-tight">הצהרת נגישות</h1>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
          עודכן לאחרונה: 1 בינואר 2025
        </p>
      </div>

      {/* Divider */}
      <div className="h-px" style={{ backgroundColor: "var(--border)" }} />

      <Section title="מחויבותנו לנגישות">
        <p>
          אנו ב<strong style={{ color: "var(--foreground)" }}>הנחה מושכלת</strong> מחויבים להנגשת
          השירות לכלל המשתמשים, לרבות אנשים עם מוגבלות. אנו פועלים בהתאם לחוק שוויון זכויות
          לאנשים עם מוגבלות, תשנ״ח-1998, ותקנות שוויון זכויות לאנשים עם מוגבלות (התאמות
          נגישות לשירות), תשע״ג-2013.
        </p>
        <p>
          רמת ההנגשה המוצהרת: <strong style={{ color: "var(--foreground)" }}>WCAG 2.1 — רמה AA</strong>.
          הבדיקה בוצעה בדפדפנים Chrome, Firefox ו-Safari וכן בקורא מסך NVDA.
        </p>
      </Section>

      <Section title="מאפייני נגישות באתר">
        <ul className="space-y-2">
          <Item ok>שפה עברית מלאה עם כיווניות RTL תקנית</Item>
          <Item ok>ניגודיות צבעים עומדת בתקן WCAG 2.1 AA (יחס 4.5:1 לפחות לטקסט רגיל)</Item>
          <Item ok>כל הפקדים הניתנים לפעולה נגישים דרך מקלדת בלבד</Item>
          <Item ok>אלמנטים אינטראקטיביים מכילים תיאורי ARIA ו-aria-label מתאימים</Item>
          <Item ok>גופן ניתן להגדלה ללא שבירת פריסת הדף עד 200%</Item>
          <Item ok>תמיכה מלאה ב-prefers-reduced-motion</Item>
          <Item ok>מצב כהה (Dark Mode) מופעל לפי העדפת המשתמש</Item>
          <Item ok>אין מידע המוצג בצבע בלבד — כל מידע חזותי מלווה בטקסט</Item>
          <Item ok={false}>גרפים ותרשימים — חלופות טקסטואליות מלאות בפיתוח</Item>
          <Item ok={false}>תמיכה מלאה ב-VoiceOver (iOS) — בשלבי בדיקה</Item>
        </ul>
      </Section>

      <Section title="טכנולוגיות תומכות">
        <p>האתר נבנה עם Next.js, React ו-Tailwind CSS. נבדק עם:</p>
        <ul className="list-disc space-y-1 ps-5">
          <li>NVDA + Chrome (Windows)</li>
          <li>VoiceOver + Safari (macOS / iOS)</li>
          <li>TalkBack + Chrome (Android)</li>
          <li>Lighthouse Accessibility Audit</li>
          <li>axe DevTools</li>
        </ul>
      </Section>

      <Section title="יצירת קשר בנושא נגישות">
        <p>
          נתקלתם בבעיית נגישות? אנו מתחייבים לטפל בפניות נגישות בתוך <strong style={{ color: "var(--foreground)" }}>5 ימי עסקים</strong>.
        </p>
        <div
          className="mt-4 flex items-center gap-3 rounded-2xl p-4"
          style={{ background: "color-mix(in oklch, var(--muted) 50%, transparent)", border: "1px solid var(--border)" }}
        >
          <Mail className="size-5 shrink-0" style={{ color: "var(--primary)" }} />
          <div>
            <p className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>רכז הנגישות</p>
            <a
              href="mailto:tuviahefets@gmail.com"
              className="text-xs underline underline-offset-2"
              style={{ color: "var(--primary)" }}
            >
              tuviahefets@gmail.com
            </a>
          </div>
        </div>
      </Section>

      {/* Back */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70"
        style={{ color: "var(--primary)" }}
      >
        → חזרה לדשבורד
      </Link>
    </article>
  );
}
