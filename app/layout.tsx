import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";
import { DashboardProvider } from "@/components/providers/dashboard-provider";
import { SidebarProvider } from "@/components/sidebar/sidebar-provider";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Footer } from "@/components/footer";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-heebo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "הנחה מושכלת — ניתוח הגרלות דיור",
  description:
    "לא כל הגרלה שווה אותו דבר. כאן אפשר לבדוק לאיזו עיר כדאי להגיש בקשה — לפי סיכויים, מחירים, ורווח. חינמי לגמרי.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${heebo.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/*
         * Anti-FOUC: reads localStorage "theme" before React hydrates.
         * Prevents flash of wrong colour scheme on hard refresh.
         */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme'),d=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||(t===null&&d))document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full bg-background font-[family-name:var(--font-heebo)] text-foreground">
        {/* Skip-to-content for keyboard / screen-reader users */}
        <a href="#main-content" className="skip-link">
          דלג לתוכן הראשי
        </a>
        <DashboardProvider>
          <SidebarProvider>
            {/*
             * Root flex container.
             * dir="rtl" means flex-row is right-to-left:
             *   first child (AppSidebar) → RIGHT side
             *   second child (content)   → LEFT side
             */}
            <div className="flex min-h-dvh">
              <AppSidebar />

              {/* Main content column */}
              <div className="flex min-w-0 flex-1 flex-col">
                {children}
                <Footer />
              </div>
            </div>
          </SidebarProvider>
        </DashboardProvider>
      </body>
    </html>
  );
}
