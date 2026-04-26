"use client";

import { useRouter } from "next/navigation";
import type { Lang } from "@/i18n/translations";
import { t } from "@/i18n/translations";

export function LanguageSwitcher({ lang }: { lang: Lang }) {
  const router = useRouter();

  function setLang(next: Lang) {
    document.cookie = `lang=${next}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setLang("en")}
        className={`rounded-md px-2 py-1 text-xs ${lang === "en" ? "bg-accent text-accent-foreground" : "border border-border"}`}
      >
        {t(lang, "lang.en")}
      </button>
      <button
        onClick={() => setLang("th")}
        className={`rounded-md px-2 py-1 text-xs ${lang === "th" ? "bg-accent text-accent-foreground" : "border border-border"}`}
      >
        {t(lang, "lang.th")}
      </button>
    </div>
  );
}
