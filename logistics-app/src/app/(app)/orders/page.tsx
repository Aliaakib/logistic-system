"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  IconSearch,
  IconPlus,
  IconChevronLeft,
  IconChevronRight,
  IconTruckDelivery,
  IconDotsVertical,
  IconEye,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";

import { PageHeader } from "@/components/page-header";
import { DeleteDialog } from "@/components/delete-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/* =========================================================
   TYPES
========================================================= */

type OrderStatus =
  | "Pending"
  | "Assigned"
  | "Picked Up"
  | "In Transit"
  | "Delivered"
  | "Cancelled";

type LogisticsOrder = {
  id: string;
  customer: string;
  pickup: string;
  delivery: string;
  driver: string;
  date: string;
  status: OrderStatus;
};

/* =========================================================
   DUMMY LOGISTICS DATA
========================================================= */

const initialOrders: LogisticsOrder[] = [
  {
    id: "ORD-10248",
    customer: "ABC International Logistics",
    pickup: "Ahmedabad",
    delivery: "Mumbai",
    driver: "John Smith",
    date: "Sep 04, 2026",
    status: "Pending",
  },
  {
    id: "ORD-10247",
    customer: "Shree Logistics Pvt Ltd",
    pickup: "Mumbai",
    delivery: "Pune",
    driver: "Rajesh Kumar",
    date: "Sep 04, 2026",
    status: "In Transit",
  },
  {
    id: "ORD-10246",
    customer: "Apex Industries",
    pickup: "Delhi",
    delivery: "Jaipur",
    driver: "Amit Sharma",
    date: "Sep 04, 2026",
    status: "Assigned",
  },
  {
    id: "ORD-10245",
    customer: "Metro Wholesale",
    pickup: "Ahmedabad",
    delivery: "Surat",
    driver: "Vikram Patel",
    date: "Sep 03, 2026",
    status: "Delivered",
  },
  {
    id: "ORD-10244",
    customer: "BlueLine Foods",
    pickup: "Bengaluru",
    delivery: "Chennai",
    driver: "Suresh Reddy",
    date: "Sep 03, 2026",
    status: "Picked Up",
  },
  {
    id: "ORD-10243",
    customer: "Prime Hardware",
    pickup: "Hyderabad",
    delivery: "Vijayawada",
    driver: "Kiran Rao",
    date: "Sep 03, 2026",
    status: "Pending",
  },
  {
    id: "ORD-10242",
    customer: "Evergreen Pharma",
    pickup: "Pune",
    delivery: "Nashik",
    driver: "Manoj Patil",
    date: "Sep 02, 2026",
    status: "Delivered",
  },
  {
    id: "ORD-10241",
    customer: "Northstar Retail",
    pickup: "Kolkata",
    delivery: "Bhubaneswar",
    driver: "Arjun Das",
    date: "Sep 02, 2026",
    status: "In Transit",
  },
  {
    id: "ORD-10240",
    customer: "Urban Mart",
    pickup: "Noida",
    delivery: "Lucknow",
    driver: "Rohit Verma",
    date: "Sep 01, 2026",
    status: "Cancelled",
  },
  {
    id: "ORD-10239",
    customer: "Global Electronics",
    pickup: "Ahmedabad",
    delivery: "Mumbai",
    driver: "Vijay Singh",
    date: "Sep 01, 2026",
    status: "Delivered",
  },
  {
    id: "ORD-10238",
    customer: "FreshKart Distribution",
    pickup: "Delhi",
    delivery: "Gurugram",
    driver: "Anil Yadav",
    date: "Aug 31, 2026",
    status: "Assigned",
  },
  {
    id: "ORD-10237",
    customer: "Sunrise Traders",
    pickup: "Surat",
    delivery: "Vadodara",
    driver: "Deepak Shah",
    date: "Aug 31, 2026",
    status: "In Transit",
  },
  {
    id: "ORD-10236",
    customer: "Techno Supply Co.",
    pickup: "Chennai",
    delivery: "Coimbatore",
    driver: "Prakash Kumar",
    date: "Aug 30, 2026",
    status: "Delivered",
  },
  {
    id: "ORD-10235",
    customer: "National Distributors",
    pickup: "Pune",
    delivery: "Mumbai",
    driver: "Sachin More",
    date: "Aug 30, 2026",
    status: "Picked Up",
  },
  {
    id: "ORD-10234",
    customer: "Reliable Imports",
    pickup: "Mumbai",
    delivery: "Nashik",
    driver: "Sameer Khan",
    date: "Aug 29, 2026",
    status: "Delivered",
  },
];

/* =========================================================
   CONSTANTS
========================================================= */

const PAGE_SIZE = 10;

const tabs = [
  "All",
  "Pending",
  "Assigned",
  "Picked Up",
  "In Transit",
  "Delivered",
  "Cancelled",
] as const;

/* =========================================================
   STATUS STYLES
========================================================= */

const statusStyles: Record<OrderStatus, string> = {
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
};

/* =========================================================
   SUMMARY TILE
========================================================= */

function SummaryTile({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <Card>
      <CardContent className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">
          {label}
        </p>

        <p className="text-3xl font-semibold tracking-tight tabular-nums">
          {value}
        </p>
      </CardContent>
    </Card>
  );
}

/* =========================================================
   CUSTOMER AVATAR
========================================================= */

function CustomerAvatar({
  customer,
}: {
  customer: string;
}) {
  const initials = customer
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <Avatar className="size-7">
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}

/* =========================================================
   ORDERS PAGE
========================================================= */

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<string>("All");
  const [page, setPage] = useState(1);

  const [rows, setRows] =
    useState<LogisticsOrder[]>(initialOrders);

  const [deleteId, setDeleteId] =
    useState<string | null>(null);

  /* =======================================================
     DASHBOARD / ORDER STATS
  ======================================================= */

  const stats = useMemo(() => {
    const total = rows.length;

    const pending = rows.filter(
      (order) => order.status === "Pending"
    ).length;

    const assigned = rows.filter(
      (order) => order.status === "Assigned"
    ).length;

    const pickedUp = rows.filter(
      (order) => order.status === "Picked Up"
    ).length;

    const inTransit = rows.filter(
      (order) => order.status === "In Transit"
    ).length;

    const delivered = rows.filter(
      (order) => order.status === "Delivered"
    ).length;

    const cancelled = rows.filter(
      (order) => order.status === "Cancelled"
    ).length;

    return {
      total,
      pending,
      assigned,
      pickedUp,
      inTransit,
      delivered,
      cancelled,
    };
  }, [rows]);

  /* =======================================================
     SEARCH + FILTER
  ======================================================= */

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return rows.filter((order) => {
      const matchesTab =
        tab === "All" ||
        order.status === tab;

      const matchesSearch =
        !q ||
        order.id.toLowerCase().includes(q) ||
        order.customer.toLowerCase().includes(q) ||
        order.pickup.toLowerCase().includes(q) ||
        order.delivery.toLowerCase().includes(q) ||
        order.driver.toLowerCase().includes(q);

      return matchesTab && matchesSearch;
    });
  }, [search, tab, rows]);

  /* =======================================================
     PAGINATION
  ======================================================= */

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE)
  );

  const currentPage = Math.min(
    page,
    totalPages
  );

  const start =
    (currentPage - 1) * PAGE_SIZE;

  const pageRows = filtered.slice(
    start,
    start + PAGE_SIZE
  );

  const showingFrom =
    filtered.length === 0
      ? 0
      : start + 1;

  const showingTo = Math.min(
    start + PAGE_SIZE,
    filtered.length
  );

  /* =======================================================
     DELETE ORDER
  ======================================================= */

  function handleDelete() {
    if (!deleteId) return;

    setRows((previous) =>
      previous.filter(
        (order) => order.id !== deleteId
      )
    );

    setDeleteId(null);
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="space-y-6">
      {/* ===================================================
          PAGE HEADER
      ================================================== */}

      <PageHeader
        title="Orders"
        description="Create, assign, track and manage logistics orders."
      >
        <Button size="sm" asChild>
          <Link href="/orders/new">
            <IconPlus className="size-4" />
            Create order
          </Link>
        </Button>
      </PageHeader>

      {/* ===================================================
          SUMMARY
      ================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryTile
          label="Total Orders"
          value={stats.total.toLocaleString()}
        />

        <SummaryTile
          label="Pending Orders"
          value={stats.pending.toLocaleString()}
        />

        <SummaryTile
          label="In Transit"
          value={stats.inTransit.toLocaleString()}
        />

        <SummaryTile
          label="Delivered"
          value={stats.delivered.toLocaleString()}
        />
      </div>

      {/* ===================================================
          ORDERS TABLE
      ================================================== */}

      <Card>
        <CardContent className="space-y-4 px-0">
          {/* FILTER BAR */}

          <div className="flex flex-col gap-3 px-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="overflow-x-auto sm:overflow-visible">
              <Tabs
                value={tab}
                onValueChange={(value) => {
                  setTab(value);
                  setPage(1);
                }}
              >
                <TabsList>
                  {tabs.map((status) => (
                    <TabsTrigger
                      key={status}
                      value={status}
                    >
                      {status}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            {/* SEARCH */}

            <div className="relative w-full sm:max-w-xs">
              <IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search orders..."
                className="pl-9"
              />
            </div>
          </div>

          {/* TABLE */}

          <div className="overflow-x-auto">
            <Table className="min-w-[950px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">
                    Order ID
                  </TableHead>

                  <TableHead>
                    Customer
                  </TableHead>

                  <TableHead>
                    Pickup
                  </TableHead>

                  <TableHead>
                    Delivery
                  </TableHead>

                  <TableHead>
                    Driver
                  </TableHead>

                  <TableHead>
                    Date
                  </TableHead>

                  <TableHead>
                    Status
                  </TableHead>

                  <TableHead className="w-10 pr-6" />
                </TableRow>
              </TableHeader>

              <TableBody>
                {pageRows.map((order) => (
                  <TableRow key={order.id}>
                    {/* ORDER ID */}

                    <TableCell className="pl-6 font-medium tabular-nums">
                      <Link
                        href={`/orders/${order.id}`}
                        className="text-primary hover:underline"
                      >
                        {order.id}
                      </Link>
                    </TableCell>

                    {/* CUSTOMER */}

                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <CustomerAvatar
                          customer={order.customer}
                        />

                        <span className="font-medium">
                          {order.customer}
                        </span>
                      </div>
                    </TableCell>

                    {/* PICKUP */}

                    <TableCell className="text-muted-foreground">
                      {order.pickup}
                    </TableCell>

                    {/* DELIVERY */}

                    <TableCell className="text-muted-foreground">
                      {order.delivery}
                    </TableCell>

                    {/* DRIVER */}

                    <TableCell>
                      {order.driver}
                    </TableCell>

                    {/* DATE */}

                    <TableCell className="text-muted-foreground tabular-nums">
                      {order.date}
                    </TableCell>

                    {/* STATUS */}

                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          statusStyles[order.status]
                        }
                      >
                        {order.status}
                      </Badge>
                    </TableCell>

                    {/* ACTIONS */}

                    <TableCell className="pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                          >
                            <IconDotsVertical className="size-4" />

                            <span className="sr-only">
                              Order actions
                            </span>
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          {/* VIEW */}

                          <DropdownMenuItem asChild>
                            <Link
                              href={`/orders/${order.id}`}
                            >
                              <IconEye className="size-4" />
                              View
                            </Link>
                          </DropdownMenuItem>

                          {/* EDIT */}

                          <DropdownMenuItem asChild>
                            <Link
                              href={`/orders/${order.id}/edit`}
                            >
                              <IconPencil className="size-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          {/* DELETE */}

                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() =>
                              setDeleteId(order.id)
                            }
                          >
                            <IconTrash className="size-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}

                {/* EMPTY STATE */}

                {pageRows.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="py-12 text-center text-muted-foreground"
                    >
                      <IconTruckDelivery className="mx-auto mb-2 size-6 opacity-50" />

                      <p>
                        No orders match your filters.
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* =================================================
              PAGINATION
          ================================================= */}

          <div className="flex flex-col gap-3 px-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {showingFrom}–{showingTo} of{" "}
              {filtered.length}
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() =>
                  setPage((previous) =>
                    Math.max(
                      1,
                      previous - 1
                    )
                  )
                }
              >
                <IconChevronLeft className="size-4" />
                Prev
              </Button>

              <span className="text-sm text-muted-foreground">
                Page {currentPage} of{" "}
                {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={
                  currentPage >= totalPages
                }
                onClick={() =>
                  setPage((previous) =>
                    Math.min(
                      totalPages,
                      previous + 1
                    )
                  )
                }
              >
                Next
                <IconChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* =====================================================
          DELETE DIALOG
      ===================================================== */}

      <DeleteDialog
        open={deleteId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteId(null);
          }
        }}
        name={deleteId ?? "order"}
        description={`This will permanently remove order ${
          deleteId ?? ""
        }. This action cannot be undone.`}
        onConfirm={handleDelete}
      />
    </div>
  );
}