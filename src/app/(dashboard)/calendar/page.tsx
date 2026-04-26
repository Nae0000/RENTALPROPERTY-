import { CalendarEventForm } from "@/components/forms/calendar-event-form";
import { Card } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { getLang } from "@/i18n/server";
import { t } from "@/i18n/translations";
import { getCalendarEventsFeedFiltered } from "@/server/queries/operations";

export const dynamic = "force-dynamic";

type CalendarPageProps = {
  searchParams?: {
    type?: string;
    query?: string;
    sort?: string;
    page?: string;
  };
};

export default async function CalendarPage({ searchParams }: CalendarPageProps) {
  const lang = getLang();
  const type = searchParams?.type ?? "ALL";
  const query = searchParams?.query ?? "";
  const sort = searchParams?.sort ?? "dateAsc";
  const page = Number(searchParams?.page ?? "1");
  const data = await getCalendarEventsFeedFiltered({
    type,
    query,
    sort,
    page: Number.isFinite(page) ? page : 1
  });
  const events = data.items;
  return (
    <div className="space-y-4">
      <Card>
        <h2 className="mb-3 text-lg font-semibold">{t(lang, "calendar.title")}</h2>
        <form className="mt-3 grid gap-2 md:grid-cols-5">
          <select
            name="type"
            defaultValue={type}
            className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
          >
            <option value="ALL">{t(lang, "calendar.filterAll")}</option>
            <option value="RENT_DUE">RENT_DUE</option>
            <option value="LEASE_EXPIRY">LEASE_EXPIRY</option>
            <option value="PAYMENT_RECEIVED">PAYMENT_RECEIVED</option>
            <option value="MAINTENANCE">MAINTENANCE</option>
          </select>
          <input
            name="query"
            defaultValue={query}
            placeholder={t(lang, "calendar.search")}
            className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm md:col-span-2"
          />
          <select
            name="sort"
            defaultValue={sort}
            className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
          >
            <option value="dateAsc">{t(lang, "calendar.dateOldest")}</option>
            <option value="dateDesc">{t(lang, "calendar.dateNewest")}</option>
          </select>
          <button className="rounded-lg bg-accent px-3 py-2 text-sm text-accent-foreground">{t(lang, "common.apply")}</button>
        </form>
      </Card>
      <CalendarEventForm lang={lang} />
      <Card>
        <div className="space-y-2">
          {events.length === 0 ? <p className="text-sm text-muted-foreground">{t(lang, "calendar.empty")}</p> : null}
          {events.map((event) => (
            <div key={event.id} className="rounded-lg border border-border p-3">
              <p className="font-medium">{event.title}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(event.eventDate).toLocaleDateString()} | {event.eventType}
              </p>
              <p className="text-sm">
                {event.status} {event.room ? `| ${event.room.roomNumber}` : ""}
              </p>
            </div>
          ))}
        </div>
        <Pagination
          page={data.page}
          total={data.total}
          pageSize={data.pageSize}
          lang={lang}
          buildHref={(targetPage) =>
            `?type=${encodeURIComponent(type)}&query=${encodeURIComponent(query)}&sort=${encodeURIComponent(sort)}&page=${targetPage}`
          }
        />
      </Card>
    </div>
  );
}
