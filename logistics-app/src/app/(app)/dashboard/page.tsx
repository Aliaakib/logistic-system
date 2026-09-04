"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  IconArrowUpRight,
  IconDownload,
  IconPlus,
  IconDotsVertical,
  IconRefresh,
  IconPhoto,
  IconReportAnalytics,
} from "@tabler/icons-react";

import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { RevenueAreaChart } from "@/components/charts/revenue-area-chart";
import { TrafficDonutChart } from "@/components/charts/traffic-donut-chart";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  overviewStats,
  trafficSources,
  orders,
} from "@/data";

function ChartMenu({ title }: { title: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <IconDotsVertical className="size-4" />
          <span className="sr-only">{title} options</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onSelect={() =>
            toast.success(`${title} refreshed`, {
              description: "Showing the latest available data.",
            })
          }
        >
          <IconRefresh className="size-4" />
          Refresh
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={() =>
            toast.success("Chart exported", {
              description: `${title} was saved as a PNG image.`,
            })
          }
        >
          <IconPhoto className="size-4" />
          Download PNG
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={() =>
            toast("Opening full report", {
              description: `Preparing a detailed ${title.toLowerCase()} report.`,
            })
          }
        >
          <IconReportAnalytics className="size-4" />
          View full report
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Safely reads optional logistics fields from the existing
 * order data without causing TypeScript errors if the current
 * data type does not contain them yet.
 */
function getOrderField(
  order: unknown,
  field: string,
  fallback = "—"
): string {
  if (!order || typeof order !== "object") {
    return fallback;
  }

  const value = (order as Record<string, unknown>)[field];

  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  return String(value);
}

export default function DashboardPage() {
  const [addOpen, setAddOpen] = useState(false);

  function handleExport() {
    toast.success("Exported to CSV", {
      description: "Your logistics dashboard summary is downloading.",
    });
  }

  function handleAddWidget(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = new FormData(e.currentTarget);

    const name =
      (data.get("name") as string)?.trim() || "New widget";

    setAddOpen(false);

    toast.success("Widget added", {
      description: `“${name}” was pinned to your dashboard.`,
    });
  }

  return (
    <div className="space-y-6">
      {/* =========================
          PAGE HEADER
      ========================== */}
      <PageHeader
        title="Welcome back, Alex 👋"
        description="Here's what's happening with your logistics operations today."
      >
        <Button variant="outline" onClick={handleExport}>
          <IconDownload className="size-4" />
          Export
        </Button>

        <Button onClick={() => setAddOpen(true)}>
          <IconPlus className="size-4" />
          Add widget
        </Button>
      </PageHeader>

      {/* =========================
          KPI CARDS
      ========================== */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {overviewStats.map((stat) => (
          <StatCard
            key={stat.label}
            stat={stat}
          />
        ))}
      </div>

      {/* =========================
          CHARTS
      ========================== */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Operations Overview</CardTitle>

            <CardDescription>
              Monthly logistics performance for the past year
            </CardDescription>

            <CardAction>
              <ChartMenu title="Operations Overview" />
            </CardAction>
          </CardHeader>

          <CardContent>
            <RevenueAreaChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>

            <CardDescription>
              Sources contributing to your business
            </CardDescription>
          </CardHeader>

          <CardContent>
            <TrafficDonutChart />
          </CardContent>

          <CardFooter className="flex-col items-stretch gap-2">
            {trafficSources.map((source) => (
              <div
                key={source.source}
                className="flex items-center gap-2 text-sm"
              >
                <span
                  className="size-2.5 rounded-full"
                  style={{ background: source.fill }}
                />

                <span className="text-muted-foreground">
                  {source.source}
                </span>

                <span className="ml-auto font-medium tabular-nums">
                  {source.value.toLocaleString()}
                </span>
              </div>
            ))}
          </CardFooter>
        </Card>
      </div>

      {/* =========================
          ACTIVE SHIPMENTS
      ========================== */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Active Shipments</CardTitle>

            <CardDescription>
              Shipments currently in operation
            </CardDescription>

            <CardAction>
              <Button
                variant="ghost"
                size="sm"
                asChild
              >
                <Link href="/orders">
                  View all
                  <IconArrowUpRight className="size-4" />
                </Link>
              </Button>
            </CardAction>
          </CardHeader>

          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">
                    Shipment
                  </TableHead>

                  <TableHead>
                    Route
                  </TableHead>

                  <TableHead>
                    Driver
                  </TableHead>

                  <TableHead>
                    Status
                  </TableHead>

                  <TableHead className="pr-6 text-right">
                    ETA
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {orders
                  .filter((order) => {
                    const status = getOrderField(
                      order,
                      "status"
                    );

                    return (
                      status !== "Delivered" &&
                      status !== "Cancelled"
                    );
                  })
                  .slice(0, 6)
                  .map((order) => {
                    const customer = getOrderField(
                      order,
                      "customer",
                      "Unknown Customer"
                    );

                    const shipmentId = getOrderField(
                      order,
                      "id",
                      "—"
                    );

                    const pickup = getOrderField(
                      order,
                      "pickup"
                    );

                    const delivery = getOrderField(
                      order,
                      "delivery"
                    );

                    const driver = getOrderField(
                      order,
                      "driver"
                    );

                    const eta = getOrderField(
                      order,
                      "eta"
                    );

                    const status = getOrderField(
                      order,
                      "status",
                      "Pending"
                    );

                    const avatar = getOrderField(
                      order,
                      "avatar",
                      ""
                    );

                    return (
                      <TableRow key={shipmentId}>
                        {/* Shipment */}
                        <TableCell className="pl-6">
                          <div className="flex items-center gap-2.5">
                            <Avatar className="size-7">
                              <AvatarImage
                                src={avatar}
                                alt={customer}
                              />

                              <AvatarFallback>
                                {customer
                                  .slice(0, 2)
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>

                            <div className="min-w-0">
                              <p className="font-medium">
                                {shipmentId}
                              </p>

                              <p className="truncate text-xs text-muted-foreground">
                                {customer}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        {/* Route */}
                        <TableCell className="text-muted-foreground">
                          {pickup} → {delivery}
                        </TableCell>

                        {/* Driver */}
                        <TableCell>
                          {driver}
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                          <StatusBadge status={status} />
                        </TableCell>

                        {/* ETA */}
                        <TableCell className="pr-6 text-right font-medium tabular-nums">
                          {eta}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* =========================
            TOP ROUTES
        ========================== */}
        <Card>
          <CardHeader>
            <CardTitle>Top Routes</CardTitle>

            <CardDescription>
              Most active routes this month
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-1">
            {[
              {
                id: 1,
                from: "Mumbai",
                to: "Pune",
                orders: 48,
                trend: 18.2,
              },
              {
                id: 2,
                from: "Delhi",
                to: "Jaipur",
                orders: 42,
                trend: 12.4,
              },
              {
                id: 3,
                from: "Ahmedabad",
                to: "Surat",
                orders: 36,
                trend: 9.6,
              },
              {
                id: 4,
                from: "Bengaluru",
                to: "Chennai",
                orders: 31,
                trend: 6.1,
              },
              {
                id: 5,
                from: "Hyderabad",
                to: "Vijayawada",
                orders: 24,
                trend: 4.3,
              },
            ].map((route) => (
              <div
                key={route.id}
                className="-mx-2 flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-muted/50"
              >
                <span className="w-4 shrink-0 text-center text-sm font-medium text-muted-foreground tabular-nums">
                  {route.id}
                </span>

                <div className="flex size-10 shrink-0 items-center justify-center rounded-md border bg-muted text-xs font-semibold">
                  {route.from.slice(0, 2).toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {route.from} → {route.to}
                  </p>

                  <p className="truncate text-xs text-muted-foreground">
                    {route.orders.toLocaleString()} shipments
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-sm font-medium tabular-nums">
                    {route.orders}
                  </p>

                  <p className="text-xs font-medium text-emerald-600 tabular-nums dark:text-emerald-400">
                    +{route.trend}%
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* =========================
          ADD WIDGET DIALOG
      ========================== */}
      <Dialog
        open={addOpen}
        onOpenChange={setAddOpen}
      >
        <DialogContent>
          <form onSubmit={handleAddWidget}>
            <DialogHeader>
              <DialogTitle>
                Add a widget
              </DialogTitle>

              <DialogDescription>
                Choose a widget to pin to your logistics dashboard.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="widget-name">
                  Widget name
                </Label>

                <Input
                  id="widget-name"
                  name="name"
                  placeholder="e.g. Active Shipments"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="widget-type">
                  Type
                </Label>

                <Select
                  name="type"
                  defaultValue="metric"
                >
                  <SelectTrigger
                    id="widget-type"
                    className="w-full"
                  >
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="metric">
                      Metric card
                    </SelectItem>

                    <SelectItem value="line">
                      Line chart
                    </SelectItem>

                    <SelectItem value="bar">
                      Bar chart
                    </SelectItem>

                    <SelectItem value="table">
                      Table
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                >
                  Cancel
                </Button>
              </DialogClose>

              <Button type="submit">
                <IconPlus className="size-4" />
                Add widget
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* =========================
   STATUS BADGE
========================= */

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const map: Record<string, string> = {
    Pending:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400",

    Assigned:
      "bg-blue-500/10 text-blue-600 dark:text-blue-400",

    "Picked Up":
      "bg-violet-500/10 text-violet-600 dark:text-violet-400",

    "In Transit":
      "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",

    Delivered:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",

    Cancelled:
      "bg-rose-500/10 text-rose-600 dark:text-rose-400",

    // Fallback for old data
    Paid:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",

    Refunded:
      "bg-slate-500/10 text-slate-600 dark:text-slate-400",

    Failed:
      "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  };

  return (
    <Badge
      variant="secondary"
      className={
        map[status] ??
        "bg-slate-500/10 text-slate-600 dark:text-slate-400"
      }
    >
      {status}
    </Badge>
  );
}