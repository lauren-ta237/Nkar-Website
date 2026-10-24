import type { ComponentProps, ReactNode } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EmptyState from "@/components/ui/empty-state";
import { ErrorStateArt } from "@/components/illustrations";
import { cn } from "@/lib/utils";

export type Column = {
  key: string;
  header: ReactNode;
  className?: string;
  /** Hide below the given breakpoint, e.g. "md". */
  hideBelow?: "sm" | "md" | "lg";
};

const hideClass: Record<NonNullable<Column["hideBelow"]>, string> = {
  sm: "hidden sm:table-cell",
  md: "hidden md:table-cell",
  lg: "hidden lg:table-cell",
};

type Props = {
  columns: Column[];
  children: ReactNode;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  /** True when there is no data and no error. */
  isEmpty?: boolean;
  empty?: ReactNode;
  skeletonRows?: number;
  className?: string;
};

/**
 * Sunken sticky header, row hover, and skeleton / empty / error parity for
 * every table in the product. See DESIGN.md section 11.
 */
export default function DataTableShell({
  columns,
  children,
  isLoading = false,
  isError = false,
  errorMessage = "We could not load this data.",
  onRetry,
  isEmpty = false,
  empty,
  skeletonRows = 6,
  className,
}: Props) {
  const showState = isLoading || isError || isEmpty;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border/60 bg-surface-raised shadow-e2",
        className,
      )}>
      <Table>
        <TableHeader>
          <TableRow className="border-border/60 bg-surface-sunken hover:bg-surface-sunken">
            {columns.map((column) => (
              <TableHead
                key={column.key}
                className={cn(
                  "h-11 px-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
                  column.hideBelow && hideClass[column.hideBelow],
                  column.className,
                )}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading &&
            Array.from({ length: skeletonRows }).map((_, rowIndex) => (
              <TableRow key={`skeleton-${rowIndex}`} className="border-border/50">
                {columns.map((column, cellIndex) => (
                  <TableCell
                    key={column.key}
                    className={cn(
                      "px-4 py-3.5",
                      column.hideBelow && hideClass[column.hideBelow],
                    )}>
                    <Skeleton
                      className={cn(
                        "h-4 rounded-md",
                        cellIndex === 0 ? "w-40" : "w-20",
                      )}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}

          {!isLoading && isError && (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={columns.length} className="p-0">
                <EmptyState
                  illustration={ErrorStateArt}
                  title="Something went wrong"
                  description={errorMessage}
                  action={
                    onRetry ? (
                      <Button variant="outline" size="sm" onClick={onRetry}>
                        <RefreshCw className="size-4" aria-hidden="true" />
                        Try again
                      </Button>
                    ) : undefined
                  }
                />
              </TableCell>
            </TableRow>
          )}

          {!isLoading && !isError && isEmpty && (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={columns.length} className="p-0">
                {empty}
              </TableCell>
            </TableRow>
          )}

          {!showState && children}
        </TableBody>
      </Table>
    </div>
  );
}

/** Row helper so pages get consistent padding and hover without repeating classes. */
export function DataRow({ className, ...props }: ComponentProps<"tr">) {
  return (
    <TableRow
      className={cn(
        "border-border/50 transition-colors hover:bg-surface-sunken/70",
        className,
      )}
      {...props}
    />
  );
}

export function DataCell({ className, ...props }: ComponentProps<"td">) {
  return <TableCell className={cn("px-4 py-3.5", className)} {...props} />;
}
