import Link from "next/link";
import { cn } from "@/lib/utils";

type PaginationProps = {
  page: number;
  total: number;
  pageSize: number;
  buildHref: (targetPage: number) => string;
};

export function Pagination({ page, total, pageSize, buildHref }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const prevPage = Math.max(1, page - 1);
  const nextPage = Math.min(totalPages, page + 1);
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
      <span>
        Page {page} / {totalPages}
      </span>
      <div className="flex gap-2">
        <Link
          href={buildHref(prevPage)}
          aria-disabled={!canPrev}
          className={cn(
            "rounded border border-border px-2 py-1",
            !canPrev && "pointer-events-none opacity-40"
          )}
        >
          Prev
        </Link>
        <Link
          href={buildHref(nextPage)}
          aria-disabled={!canNext}
          className={cn(
            "rounded border border-border px-2 py-1",
            !canNext && "pointer-events-none opacity-40"
          )}
        >
          Next
        </Link>
      </div>
    </div>
  );
}
