import type { Metadata } from "next";
import Link from "next/link";
import { FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "תנאי שימוש — הנחה מושכלת",
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

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-2xl space-y-8 px-4 py-12 sm:px-6">

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span
            className="flex size-10 items-center justify-center rounded-2xl"
            style={{ background: "color-mix(in oklch, var(--primary) 13%, transparent)", color: "var(--primary)" }}
          >
            <FileText className="size-5" />
          </span>
          <h1 className="text-2xl font-black tracking-tight">תנאי שימוש</h1>
        </div>
        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
          עודכן לאחרונה: 1 בינואר 2025
        </p>
      </div>

      <div className="h-px" style={{ backgroundColor: "var(--border)" }} />

      <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
        <strong style={{ color: "var(--foreground)" }}>הנחה מושכלת</strong> הוא פרויקט חינמי לגמרי — בלי מסחר, בלי פרסומות.
        יש כמה כללים פשוטים שכדאי לדעת. קצר ולעניין:
      </p>

      <Section num={1} title="מטרת השירות">
        <p>
          האתר מציג ניתוח סטטיסטי של נתוני הגרלות דיור בהנחה, ומאפשר השוואה בין ערים
          ולוטריות על בסיס מחירים ונתוני רישום. המידע מוצג לצורכי מידע כללי בלבד.
        </p>
        <p>
          <strong style={{ color: "var(--foreground)" }}>האתר אינו מהווה ייעוץ פיננסי, משפטי, מיסויי או השקעתי</strong> מכל
          סוג שהוא. כל החלטה הנוגעת לרישום להגרלה, לרכישת נכס או לעניין כלכלי אחר
          צריכה להתבסס על ייעוץ מקצועי מוסמך.
        </p>
      </Section>

      <Section num={2} title="שימוש מורשה">
        <p>מותר להשתמש באתר לצורכים אישיים, לא מסחריים בלבד.</p>
        <ul className="list-disc space-y-1 ps-4">
          <li>אין להעתיק, לשכפל או להפיץ את תכני האתר ללא אישור בכתב</li>
          <li>אין לבצע גרידת נתונים (scraping) אוטומטית מהאתר</li>
          <li>אין לעשות שימוש לרעה בשירות באופן העלול לפגוע בתפקוד האתר</li>
          <li>אין להתחזות לגורם אחר בעת שימוש בשירות</li>
        </ul>
      </Section>

      <Section num={3} title="דיוק הנתונים">
        <p>
          הנתונים מבוססים על מידע ציבורי שפורסם על-ידי משרד הבינוי והשיכון ומקורות
          ציבוריים נוספים. אנו עושים מאמץ לשמור על דיוק הנתונים, אך <strong style={{ color: "var(--foreground)" }}>אין אנו
          אחראים לשגיאות, השמטות או אי-דיוקים</strong> שעלולים להופיע.
        </p>
        <p>מחירי שוק מוצגים כאומדן בלבד ואינם מחירים מחייבים.</p>
      </Section>

      <Section num={4} title="הגבלת אחריות">
        <p>
          בשימוש באתר אתם מאשרים כי הבנתם שהאתר מסופק &quot;כפי שהוא&quot; ללא
          אחריות מכל סוג. בעלי האתר לא יהיו אחראים לכל נזק ישיר, עקיף, תוצאתי
          או מקרי הנובע מהסתמכות על המידע המוצג.
        </p>
      </Section>

      <Section num={5} title="קניין רוחני">
        <p>
          כל זכויות הקניין הרוחני באתר, לרבות העיצוב, הקוד, הלוגו והטקסטים,
          שייכים לבעלי האתר ומוגנים על-פי חוקי זכויות יוצרים ישראליים ובינלאומיים.
        </p>
      </Section>

      <Section num={6} title="שינויים בתנאים">
        <p>
          אנו שומרים לעצמנו את הזכות לשנות תנאים אלה בכל עת. שינויים מהותיים
          יפורסמו באתר עם עדכון תאריך &quot;עודכן לאחרונה&quot; בראש העמוד.
          המשך השימוש באתר לאחר פרסום השינויים מהווה הסכמה להם.
        </p>
      </Section>

      <Section num={7} title="דין וסמכות שיפוט">
        <p>
          תנאים אלה כפופים לדיני מדינת ישראל. סמכות השיפוט הבלעדית לכל סכסוך
          הנובע מתנאים אלה נתונה לבתי המשפט המוסמכים במחוז תל-אביב.
        </p>
      </Section>

      <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70" style={{ color: "var(--primary)" }}>
        → חזרה לדשבורד
      </Link>
    </article>
  );
}
