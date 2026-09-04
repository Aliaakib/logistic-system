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
  IconTruck,
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

import { toast } from "sonner";

const PAGE_SIZE = 10;

type DriverStatus =
  | "Available"
  | "Assigned"
  | "On Delivery"
  | "Offline";

type Driver = {
  id: string;
  name: string;
  phone: string;
  email: string;
  vehicleType: string;
  vehicleNumber: string;
  licenseNumber: string;
  status: DriverStatus;
  assignedOrders: number;
};

const initialDrivers: Driver[] = [
  {
    id: "DRV-001",
    name: "John Smith",
    phone: "+1 415 555 0142",
    email: "john.smith@logistics.com",
    vehicleType: "Van",
    vehicleNumber: "VAN-1024",
    licenseNumber: "DL-458921",
    status: "Available",
    assignedOrders: 0,
  },
  {
    id: "DRV-002",
    name: "Michael Brown",
    phone: "+1 415 555 0188",
    email: "michael.brown@logistics.com",
    vehicleType: "Truck",
    vehicleNumber: "TRK-2045",
    licenseNumber: "DL-673821",
    status: "Assigned",
    assignedOrders: 3,
  },
  {
    id: "DRV-003",
    name: "David Wilson",
    phone: "+1 415 555 0127",
    email: "david.wilson@logistics.com",
    vehicleType: "Pickup Truck",
    vehicleNumber: "PUP-3088",
    licenseNumber: "DL-781245",
    status: "On Delivery",
    assignedOrders: 2,
  },
  {
    id: "DRV-004",
    name: "Robert Taylor",
    phone: "+1 415 555 0199",
    email: "robert.taylor@logistics.com",
    vehicleType: "Van",
    vehicleNumber: "VAN-4122",
    licenseNumber: "DL-552187",
    status: "Available",
    assignedOrders: 0,
  },
  {
    id: "DRV-005",
    name: "James Anderson",
    phone: "+1 415 555 0165",
    email: "james.anderson@logistics.com",
    vehicleType: "Mini Truck",
    vehicleNumber: "MTR-5102",
    licenseNumber: "DL-924615",
    status: "Assigned",
    assignedOrders: 4,
  },
  {
    id: "DRV-006",
    name: "William Thomas",
    phone: "+1 415 555 0134",
    email: "william.thomas@logistics.com",
    vehicleType: "Truck",
    vehicleNumber: "TRK-6234",
    licenseNumber: "DL-348921",
    status: "Offline",
    assignedOrders: 0,
  },
  {
    id: "DRV-007",
    name: "Daniel Jackson",
    phone: "+1 415 555 0176",
    email: "daniel.jackson@logistics.com",
    vehicleType: "Van",
    vehicleNumber: "VAN-7351",
    licenseNumber: "DL-615823",
    status: "Available",
    assignedOrders: 0,
  },
  {
    id: "DRV-008",
    name: "Christopher White",
    phone: "+1 415 555 0119",
    email: "christopher.white@logistics.com",
    vehicleType: "Trailer",
    vehicleNumber: "TRL-8462",
    licenseNumber: "DL-731954",
    status: "On Delivery",
    assignedOrders: 1,
  },
  {
    id: "DRV-009",
    name: "Matthew Harris",
    phone: "+1 415 555 0158",
    email: "matthew.harris@logistics.com",
    vehicleType: "Pickup Truck",
    vehicleNumber: "PUP-9124",
    licenseNumber: "DL-492761",
    status: "Available",
    assignedOrders: 0,
  },
  {
    id: "DRV-010",
    name: "Joseph Martin",
    phone: "+1 415 555 0108",
    email: "joseph.martin@logistics.com",
    vehicleType: "Truck",
    vehicleNumber: "TRK-1033",
    licenseNumber: "DL-827341",
    status: "Assigned",
    assignedOrders: 2,
  },
  {
    id: "DRV-011",
    name: "Charles Thompson",
    phone: "+1 415 555 0149",
    email: "charles.thompson@logistics.com",
    vehicleType: "Van",
    vehicleNumber: "VAN-1147",
    licenseNumber: "DL-671823",
    status: "Offline",
    assignedOrders: 0,
  },
  {
    id: "DRV-012",
    name: "Steven Garcia",
    phone: "+1 415 555 0192",
    email: "steven.garcia@logistics.com",
    vehicleType: "Mini Truck",
    vehicleNumber: "MTR-1258",
    licenseNumber: "DL-384721",
    status: "Available",
    assignedOrders: 0,
  },
];

const statusStyles: Record<DriverStatus, string> = {
  Available:
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",

  Assigned:
    "bg-blue-500/10 text-blue-600 dark:text-blue-400",

  "On Delivery":
    "bg-amber-500/10 text-amber-600 dark:text-amber-400",

  Offline:
    "bg-slate-500/10 text-slate-600 dark:text-slate-400",
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

export default function DriversPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const [rows, setRows] =
    useState<Driver[]>(initialDrivers);

  const [deleteId, setDeleteId] =
    useState<string | null>(null);

  const deleting =
    rows.find((driver) => driver.id === deleteId) ??
    null;

  const stats = useMemo(() => {
    const total = rows.length;

    const available = rows.filter(
      (driver) => driver.status === "Available"
    ).length;

    const assigned = rows.filter(
      (driver) => driver.status === "Assigned"
    ).length;

    const onDelivery = rows.filter(
      (driver) => driver.status === "On Delivery"
    ).length;

    return {
      total,
      available,
      assigned,
      onDelivery,
    };
  }, [rows]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return rows.filter((driver) => {
      const matchesSearch =
        !query ||
        driver.id.toLowerCase().includes(query) ||
        driver.name.toLowerCase().includes(query) ||
        driver.phone.toLowerCase().includes(query) ||
        driver.email.toLowerCase().includes(query) ||
        driver.vehicleType
          .toLowerCase()
          .includes(query) ||
        driver.vehicleNumber
          .toLowerCase()
          .includes(query) ||
        driver.licenseNumber
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        status === "all" ||
        driver.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [rows, search, status]);

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
    filtered.length === 0 ? 0 : start + 1;

  const showingTo = Math.min(
    start + PAGE_SIZE,
    filtered.length
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Drivers"
        description="Manage drivers and their assigned vehicles."
      >
        <Button size="sm" asChild>
          <Link href="/drivers/new">
            <IconPlus className="size-4" />
            Add Driver
          </Link>
        </Button>
      </PageHeader>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryTile
          label="Total Drivers"
          value={stats.total.toLocaleString()}
        />

        <SummaryTile
          label="Available"
          value={stats.available.toLocaleString()}
        />

        <SummaryTile
          label="Assigned"
          value={stats.assigned.toLocaleString()}
        />

        <SummaryTile
          label="On Delivery"
          value={stats.onDelivery.toLocaleString()}
        />
      </div>

      {/* Driver Table */}
      <Card>
        <CardContent className="space-y-4 px-0">
          {/* Filters */}
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
                  placeholder="Search drivers..."
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
                <SelectTrigger className="w-full sm:w-44">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">
                    All statuses
                  </SelectItem>

                  <SelectItem value="Available">
                    Available
                  </SelectItem>

                  <SelectItem value="Assigned">
                    Assigned
                  </SelectItem>

                  <SelectItem value="On Delivery">
                    On Delivery
                  </SelectItem>

                  <SelectItem value="Offline">
                    Offline
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <p className="text-sm text-muted-foreground">
              {filtered.length} driver
              {filtered.length === 1 ? "" : "s"}
            </p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <Table className="min-w-[1250px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">
                    Driver ID
                  </TableHead>

                  <TableHead>
                    Driver Name
                  </TableHead>

                  <TableHead>
                    Phone
                  </TableHead>

                  <TableHead>
                    Vehicle
                  </TableHead>

                  <TableHead>
                    Vehicle Number
                  </TableHead>

                  <TableHead>
                    Vehicle Type
                  </TableHead>

                  <TableHead>
                    Current Status
                  </TableHead>

                  <TableHead className="text-center">
                    Assigned Orders
                  </TableHead>

                  <TableHead className="w-10 pr-6">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {pageRows.map((driver) => (
                  <TableRow key={driver.id}>
                    {/* Driver ID */}
                    <TableCell className="pl-6 font-medium tabular-nums">
                      <span className="text-primary">
                        {driver.id}
                      </span>
                    </TableCell>

                    {/* Driver Name */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-full bg-muted">
                          <IconUsers className="size-4 text-muted-foreground" />
                        </div>

                        <div>
                          <p className="font-medium">
                            {driver.name}
                          </p>

                          <p className="text-xs text-muted-foreground">
                            {driver.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Phone */}
                    <TableCell className="text-muted-foreground tabular-nums">
                      {driver.phone}
                    </TableCell>

                    {/* Vehicle */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <IconTruck className="size-4 text-muted-foreground" />

                        <span>
                          {driver.vehicleType}
                        </span>
                      </div>
                    </TableCell>

                    {/* Vehicle Number */}
                    <TableCell className="font-medium tabular-nums">
                      {driver.vehicleNumber}
                    </TableCell>

                    {/* Vehicle Type */}
                    <TableCell>
                      {driver.vehicleType}
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          statusStyles[driver.status]
                        }
                      >
                        {driver.status}
                      </Badge>
                    </TableCell>

                    {/* Assigned Orders */}
                    <TableCell className="text-center font-medium tabular-nums">
                      {driver.assignedOrders}
                    </TableCell>

                    {/* Actions */}
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
                              Driver actions
                            </span>
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              toast.info(
                                "Driver details",
                                {
                                  description: `${driver.name} — ${driver.vehicleType} — ${driver.vehicleNumber}`,
                                }
                              )
                            }
                          >
                            <IconEye className="size-4" />
                            View
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() =>
                              toast.info(
                                "Edit Driver",
                                {
                                  description:
                                    "Driver editing will be available here.",
                                }
                              )
                            }
                          >
                            <IconPencil className="size-4" />
                            Edit
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            variant="destructive"
                            onSelect={() =>
                              setDeleteId(
                                driver.id
                              )
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
                      <IconTruck className="mx-auto mb-2 size-6 opacity-50" />

                      <p>
                        No drivers match your filters.
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
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
                  setPage((p) =>
                    Math.max(1, p - 1)
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
                  setPage((p) =>
                    Math.min(
                      totalPages,
                      p + 1
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

      {/* Delete */}
      <DeleteDialog
        open={!!deleteId}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteId(null);
          }
        }}
        name={deleting?.name ?? "driver"}
        description={
          deleting
            ? `This will permanently remove ${deleting.name} and their driver record. This action cannot be undone.`
            : undefined
        }
        onConfirm={() => {
          setRows((prev) =>
            prev.filter(
              (driver) =>
                driver.id !== deleteId
            )
          );

          toast.success("Driver deleted");

          setDeleteId(null);
        }}
      />
    </div>
  );
}