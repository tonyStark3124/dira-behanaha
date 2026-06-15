import type { Metadata } from "next";
import Link from "next/link";
import { Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "מדיניות פרטיות — הנחה מושכלת",
};

function Section({ num, title, children }: { num: number; title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="flex items-baseline gap-2 text-base font-bold">
        <span
          className="flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-black"
          style={{ background: "color-mix(in oklch, var(--primary) 14%, transparent)", color: "var(--primary)" }}
        >
          {num}
        </span>
        {title}
      </h2>
      <div className="space-y-2 ps-8 text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
        {children}
      </div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-2xl space-y-8 px-4 py-12 sm:px-6">

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span
            className="flex size-10 items-center justify-center rounded-2xl"
            style={{ background: "color-mix(in oklch, var(--primary) 13%, transparent)", color: "var(--primary)" }}
          >
            <Shield className="size-5" />
          </span>
          <h1 className="text-2xl font-black tracking-tight">מדיניות פרטיות</h1>
        </div>
        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
          עודכן לאחרונה: 1 בינואר 2025
        </p>
      </div>

      <div className="h-px" style={{ backgroundColor: "var(--border)" }} />

      <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
        מדיניות זו מסבירה כיצד <strong style={{ color: "var(--foreground)" }}>הנחה מושכלת</strong> אוסף,
        משתמש ומגן על המידע שלכם, בהתאם לחוק הגנת הפרטיות, תשמ״א-1981
        ותקנותיו, וכן לתקנות הגנת הפרטיות (אבטחת מידע), תשע״ז-2017.
      </p>

      <Section num={1} title="מידע שאנו אוספים">
        <p>האתר אינו דורש הרשמה ואינו אוסף מידע אישי מזהה כגון שם, מייל או מספר טלפון.</p>
        <p>המידע הטכני שנאסף אוטומטית:</p>
        <ul className="list-disc space-y-1 ps-4">
          <li>נתוני גלישה אנונימיים (דפדפן, מערכת הפעלה, רזולוציה)</li>
          <li>כתובת IP — לצורך אבטחה ומניעת שימוש לרעה בלבד</li>
          <li>העדפות תצוגה (מצב כהה/בהיר) — נשמרות ב-localStorage מקומי במכשיר שלכם בלבד</li>
        </ul>
      </Section>

      <Section num={2} title="שימוש במידע">
        <p>המידע הטכני משמש אך ורק לצורך:</p>
        <ul className="list-disc space-y-1 ps-4">
          <li>שיפור ביצועי האתר וחווית המשתמש</li>
          <li>ניתוח תקלות ובאגים</li>
          <li>אבטחת האתר ומניעת תקיפות</li>
        </ul>
        <p>אין אנו מוכרים, מעבירים או משתפים מידע אישי עם גורמי צד-שלישי לצרכים מסחריים.</p>
      </Section>

      <Section num={3} title="אחסון מקומי (localStorage)">
        <p>
          האתר משתמש ב-<code className="rounded px-1 text-xs font-mono" style={{ background: "var(--muted)" }}>localStorage</code> של הדפדפן
          לשמירת העדפת מצב התצוגה (כהה/בהיר) בלבד. מידע זה מאוחסן
          <strong style={{ color: "var(--foreground)" }}> במכשיר שלכם בלבד</strong> ואינו נשלח לשרת.
        </p>
        <p>ניתן לנקות נתונים אלה בכל עת דרך הגדרות הדפדפן.</p>
      </Section>

      <Section num={4} title="עוגיות (Cookies)">
        <p>
          האתר עשוי להשתמש בעוגיות טכניות הכרחיות לתפקוד בסיסי.
          לפרטים ראו את <Link href="/cookies" className="underline underline-offset-2" style={{ color: "var(--primary)" }}>מדיניות העוגיות</Link> שלנו.
        </p>
      </Section>

      <Section num={5} title="אבטחת מידע">
        <p>
          אנו נוקטים באמצעי אבטחה טכניים וארגוניים סבירים להגנה על המידע
          בהתאם לתקנות הגנת הפרטיות (אבטחת מידע), תשע״ז-2017.
          כל התקשורת עם האתר מוצפנת ב-HTTPS (TLS 1.3).
        </p>
      </Section>

      <Section num={6} title="זכויות הנושאים">
        <p>בהתאם לחוק הגנת הפרטיות, יש לכם זכות:</p>
        <ul className="list-disc space-y-1 ps-4">
          <li>לעיין במידע המוחזק אודותיכם</li>
          <li>לדרוש תיקון מידע שגוי</li>
          <li>לדרוש מחיקת מידע</li>
        </ul>
        <p>
          לממש זכויות אלו או לכל שאלת פרטיות פנו אל:{" "}
          <a href="mailto:tuviahefets@gmail.com" className="underline underline-offset-2" style={{ color: "var(--primary)" }}>
            tuviahefets@gmail.com
          </a>
        </p>
      </Section>

      <Section num={7} title="שינויים במדיניות">
        <p>
          אנו עשויים לעדכן מדיניות זו מעת לעת. שינויים מהותיים יפורסמו באתר
          עם עדכון תאריך &quot;עודכן לאחרונה&quot;. המשך השימוש באתר לאחר הפרסום מהווה הסכמה.
        </p>
      </Section>

      <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70" style={{ color: "var(--primary)" }}>
        → חזרה לדשבורד
      </Link>
    </article>
  );
}
