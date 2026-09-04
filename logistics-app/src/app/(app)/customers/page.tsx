"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  IconSearch,
  IconPlus,
  IconChevronLeft,
  IconChevronRight,
  IconDotsVertical,
  IconEye,
  IconPencil,
  IconTrash,
  IconUsers,
} from "@tabler/icons-react";

import { PageHeader } from "@/components/page-header";
import { DeleteDialog } from "@/components/delete-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const PAGE_SIZE = 10;

type CustomerStatus = "Active" | "Inactive" | "Pending";

type LogisticsCustomer = {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  address: string;
  totalOrders: number;
  status: CustomerStatus;
};

const initialCustomers: LogisticsCustomer[] = [
  {
    id: "CUS-001",
    name: "Amit Shah",
    company: "ABC International Logistics",
    phone: "+91 98765 43210",
    email: "amit@abcinternational.com",
    address: "Satellite Road, Ahmedabad",
    totalOrders: 24,
    status: "Active",
  },
  {
    id: "CUS-002",
    name: "Rajesh Mehta",
    company: "Shree Logistics Pvt Ltd",
    phone: "+91 98250 12345",
    email: "rajesh@shreelogistics.com",
    address: "Andheri East, Mumbai",
    totalOrders: 18,
    status: "Active",
  },
  {
    id: "CUS-003",
    name: "Neha Patel",
    company: "Apex Industries",
    phone: "+91 98980 45678",
    email: "neha@apexindustries.com",
    address: "Sector 18, Noida",
    totalOrders: 31,
    status: "Active",
  },
  {
    id: "CUS-004",
    name: "Vikram Joshi",
    company: "Metro Wholesale",
    phone: "+91 98190 34567",
    email: "vikram@metrowholesale.com",
    address: "Ring Road, Surat",
    totalOrders: 12,
    status: "Active",
  },
  {
    id: "CUS-005",
    name: "Suresh Reddy",
    company: "BlueLine Foods",
    phone: "+91 98490 56789",
    email: "suresh@bluelinefoods.com",
    address: "Whitefield Main Road, Bengaluru",
    totalOrders: 27,
    status: "Active",
  },
  {
    id: "CUS-006",
    name: "Kiran Rao",
    company: "Prime Hardware",
    phone: "+91 99850 11223",
    email: "kiran@primehardware.com",
    address: "Banjara Hills, Hyderabad",
    totalOrders: 9,
    status: "Pending",
  },
  {
    id: "CUS-007",
    name: "Manoj Patil",
    company: "Evergreen Pharma",
    phone: "+91 97660 33445",
    email: "manoj@evergreenpharma.com",
    address: "Baner Road, Pune",
    totalOrders: 22,
    status: "Active",
  },
  {
    id: "CUS-008",
    name: "Arjun Das",
    company: "Northstar Retail",
    phone: "+91 98310 77889",
    email: "arjun@northstarretail.com",
    address: "Salt Lake, Kolkata",
    totalOrders: 15,
    status: "Active",
  },
  {
    id: "CUS-009",
    name: "Rohit Verma",
    company: "Urban Mart",
    phone: "+91 98100 55667",
    email: "rohit@urbanmart.com",
    address: "Sector 62, Noida",
    totalOrders: 7,
    status: "Inactive",
  },
  {
    id: "CUS-010",
    name: "Vijay Singh",
    company: "Global Electronics",
    phone: "+91 99090 88990",
    email: "vijay@globalelectronics.com",
    address: "SG Highway, Ahmedabad",
    totalOrders: 35,
    status: "Active",
  },
  {
    id: "CUS-011",
    name: "Anil Yadav",
    company: "FreshKart Distribution",
    phone: "+91 98710 22334",
    email: "anil@freshkart.com",
    address: "Connaught Place, New Delhi",
    totalOrders: 19,
    status: "Active",
  },
  {
    id: "CUS-012",
    name: "Deepak Shah",
    company: "Sunrise Traders",
    phone: "+91 98255 66778",
    email: "deepak@sunrisetraders.com",
    address: "Adajan, Surat",
    totalOrders: 14,
    status: "Pending",
  },
];

const statusStyles: Record<CustomerStatus, string> = {
  Active:
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Inactive:
    "bg-slate-500/10 text-slate-600 dark:text-slate-400",
  Pending:
    "bg-amber-500/10 text-amber-600 dark:text-amber-400",
};

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

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const [rows, setRows] =
    useState<LogisticsCustomer[]>(initialCustomers);

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const deleting =
    rows.find((customer) => customer.id === deleteId) ?? null;

  const stats = useMemo(() => {
    const total = rows.length;

    const active = rows.filter(
      (customer) => customer.status === "Active"
    ).length;

    const pending = rows.filter(
      (customer) => customer.status === "Pending"
    ).length;

    const totalOrders = rows.reduce(
      (sum, customer) => sum + customer.totalOrders,
      0
    );

    return {
      total,
      active,
      pending,
      totalOrders,
    };
  }, [rows]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return rows.filter((customer) => {
      const matchesSearch =
        !query ||
        customer.id.toLowerCase().includes(query) ||
        customer.name.toLowerCase().includes(query) ||
        customer.company.toLowerCase().includes(query) ||
        customer.phone.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.address.toLowerCase().includes(query);

      const matchesStatus =
        status === "all" || customer.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [rows, search, status]);

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE)
  );

  const currentPage = Math.min(page, totalPages);

  const start = (currentPage - 1) * PAGE_SIZE;

  const pageRows = filtered.slice(
    start,
    start + PAGE_SIZE
  );

  const showingFrom =
    filtered.length === 0 ? 0 : start + 1;

  const showingTo = Math.min(
    start + PAGE_SIZE,
    filtered.length
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Manage all customers using the logistics service."
      >
        <Button size="sm" asChild>
          <Link href="/customers/new">
            <IconPlus className="size-4" />
            Add Customer
          </Link>
        </Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryTile
          label="Total Customers"
          value={stats.total.toLocaleString()}
        />

        <SummaryTile
          label="Active"
          value={stats.active.toLocaleString()}
        />

        <SummaryTile
          label="Pending"
          value={stats.pending.toLocaleString()}
        />

        <SummaryTile
          label="Total Orders"
          value={stats.totalOrders.toLocaleString()}
        />
      </div>

      <Card>
        <CardContent className="space-y-4 px-0">
          <div className="flex flex-col gap-3 px-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative w-full sm:max-w-xs">
                <IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Search customers..."
                  className="pl-9"
                />
              </div>

              <Select
                value={status}
                onValueChange={(value) => {
                  setStatus(value);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">
                    All statuses
                  </SelectItem>

                  <SelectItem value="Active">
                    Active
                  </SelectItem>

                  <SelectItem value="Inactive">
                    Inactive
                  </SelectItem>

                  <SelectItem value="Pending">
                    Pending
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <p className="text-sm text-muted-foreground">
              {filtered.length} customer
              {filtered.length === 1 ? "" : "s"}
            </p>
          </div>

          <div className="overflow-x-auto">
            <Table className="min-w-[1100px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">
                    Customer ID
                  </TableHead>

                  <TableHead>
                    Customer Name
                  </TableHead>

                  <TableHead>
                    Company
                  </TableHead>

                  <TableHead>
                    Phone
                  </TableHead>

                  <TableHead>
                    Email
                  </TableHead>

                  <TableHead>
                    Address
                  </TableHead>

                  <TableHead className="text-center">
                    Total Orders
                  </TableHead>

                  <TableHead>
                    Status
                  </TableHead>

                  <TableHead className="w-10 pr-6">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {pageRows.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="pl-6 font-medium tabular-nums">
                      <Link
                        href={`/customers/${customer.id}`}
                        className="text-primary hover:underline"
                      >
                        {customer.id}
                      </Link>
                    </TableCell>

                    <TableCell className="font-medium">
                      {customer.name}
                    </TableCell>

                    <TableCell>
                      {customer.company}
                    </TableCell>

                    <TableCell className="text-muted-foreground tabular-nums">
                      {customer.phone}
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      {customer.email}
                    </TableCell>

                    <TableCell className="max-w-[240px] text-muted-foreground">
                      <div className="truncate">
                        {customer.address}
                      </div>
                    </TableCell>

                    <TableCell className="text-center font-medium tabular-nums">
                      {customer.totalOrders}
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={statusStyles[customer.status]}
                      >
                        {customer.status}
                      </Badge>
                    </TableCell>

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
                              Customer actions
                            </span>
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/customers/${customer.id}`}
                            >
                              <IconEye className="size-4" />
                              View
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuItem asChild>
                            <Link
                              href={`/customers/${customer.id}/edit`}
                            >
                              <IconPencil className="size-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            variant="destructive"
                            onSelect={() =>
                              setDeleteId(customer.id)
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

                {pageRows.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="py-12 text-center text-muted-foreground"
                    >
                      <IconUsers className="mx-auto mb-2 size-6 opacity-50" />

                      <p>
                        No customers match your filters.
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

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
                  setPage((p) => Math.max(1, p - 1))
                }
              >
                <IconChevronLeft className="size-4" />
                Prev
              </Button>

              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() =>
                  setPage((p) =>
                    Math.min(totalPages, p + 1)
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

      <DeleteDialog
        open={!!deleteId}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteId(null);
          }
        }}
        name={deleting?.company ?? "customer"}
        description={
          deleting
            ? `This will permanently remove ${deleting.company} and its customer record. This action cannot be undone.`
            : undefined
        }
        onConfirm={() => {
          setRows((prev) =>
            prev.filter(
              (customer) => customer.id !== deleteId
            )
          );

          setDeleteId(null);
        }}
      />
    </div>
  );
}