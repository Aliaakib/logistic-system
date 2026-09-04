"use client";

import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Pie,
  PieChart,
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Label as ChartLabel,
} from "recharts";

import {
  IconPlus,
  IconDownload,
  IconTruck,
  IconTruckDelivery,
  IconDotsVertical,
  IconArrowNarrowRight,
  IconCurrentLocation,
  IconRefresh,
  IconPackage,
  IconUsers,
  IconUser,
  IconClock,
  IconCircleCheck,
  IconAlertCircle,
  IconX,
} from "@tabler/icons-react";

import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Separator } from "@/components/ui/separator";

// ============================================================
// TYPES
// ============================================================

type OrderStatus =
  | "Pending"
  | "Assigned"
  | "Picked Up"
  | "In Transit"
  | "Delivered"
  | "Cancelled";

type Order = {
  id: string;
  customer: string;
  pickup: string;
  delivery: string;
  driver: string;
  driverSeed: number;
  date: string;
  status: OrderStatus;
};

// ============================================================
// DRIVERS
// ============================================================

const DRIVERS = [
  { name: "Marcus Bennett", seed: 11 },
  { name: "Priya Nair", seed: 24 },
  { name: "Diego Alvarez", seed: 32 },
  { name: "Sofia Rossi", seed: 41 },
  { name: "Chen Wei", seed: 8 },
  { name: "Amara Okafor", seed: 15 },
  { name: "Liam Nguyen", seed: 12 },
  { name: "Hannah Schmidt", seed: 47 },
];

function getDriverSeed(name: string) {
  return DRIVERS.find((driver) => driver.name === name)?.seed ?? 1;
}

// ============================================================
// INITIAL ORDERS
// ============================================================

const INITIAL_ORDERS: Order[] = [
  {
    id: "ORD-1001",
    customer: "Acme Industries",
    pickup: "Chicago",
    delivery: "Denver",
    driver: "Marcus Bennett",
    driverSeed: 11,
    date: "Sep 04, 2026",
    status: "In Transit",
  },
  {
    id: "ORD-1002",
    customer: "NorthStar Retail",
    pickup: "Seattle",
    delivery: "Portland",
    driver: "Priya Nair",
    driverSeed: 24,
    date: "Sep 04, 2026",
    status: "Delivered",
  },
  {
    id: "ORD-1003",
    customer: "BlueLine Logistics",
    pickup: "Austin",
    delivery: "Houston",
    driver: "Diego Alvarez",
    driverSeed: 32,
    date: "Sep 04, 2026",
    status: "Picked Up",
  },
  {
    id: "ORD-1004",
    customer: "Metro Wholesale",
    pickup: "Miami",
    delivery: "Atlanta",
    driver: "Sofia Rossi",
    driverSeed: 41,
    date: "Sep 03, 2026",
    status: "In Transit",
  },
  {
    id: "ORD-1005",
    customer: "Prime Distributors",
    pickup: "Boston",
    delivery: "New York",
    driver: "Chen Wei",
    driverSeed: 8,
    date: "Sep 03, 2026",
    status: "Pending",
  },
  {
    id: "ORD-1006",
    customer: "Vertex Supply Co.",
    pickup: "Phoenix",
    delivery: "Las Vegas",
    driver: "Amara Okafor",
    driverSeed: 15,
    date: "Sep 03, 2026",
    status: "Assigned",
  },
  {
    id: "ORD-1007",
    customer: "Evergreen Foods",
    pickup: "Dallas",
    delivery: "Oklahoma City",
    driver: "Liam Nguyen",
    driverSeed: 12,
    date: "Sep 02, 2026",
    status: "Cancelled",
  },
  {
    id: "ORD-1008",
    customer: "Cleveland Auto",
    pickup: "Detroit",
    delivery: "Cleveland",
    driver: "Hannah Schmidt",
    driverSeed: 47,
    date: "Sep 02, 2026",
    status: "Delivered",
  },
];

// ============================================================
// STATUS CONFIG
// ============================================================

const STATUS_ORDER: OrderStatus[] = [
  "Pending",
  "Assigned",
  "Picked Up",
  "In Transit",
  "Delivered",
  "Cancelled",
];

const STATUS_COLORS: Record<OrderStatus, string> = {
  Pending: "var(--chart-4)",
  Assigned: "var(--chart-1)",
  "Picked Up": "var(--chart-2)",
  "In Transit": "var(--chart-3)",
  Delivered: "var(--chart-5)",
  Cancelled: "var(--chart-3)",
};

const STATUS_BADGES: Record<OrderStatus, string> = {
  Pending:
    "bg-amber-500/10 text-amber-600 dark:text-amber-400",

  Assigned:
    "bg-blue-500/10 text-blue-600 dark:text-blue-400",

  "Picked Up":
    "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",

  "In Transit":
    "bg-sky-500/10 text-sky-600 dark:text-sky-400",

  Delivered:
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",

  Cancelled:
    "bg-rose-500/10 text-rose-600 dark:text-rose-400",
};

// ============================================================
// HELPERS
// ============================================================

function initials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(date: string) {
  if (!date) return "";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

// ============================================================
// CHART CONFIG
// ============================================================

const statusConfig = {
  count: {
    label: "Orders",
  },

  Pending: {
    label: "Pending",
    color: "var(--chart-4)",
  },

  Assigned: {
    label: "Assigned",
    color: "var(--chart-1)",
  },

  "Picked Up": {
    label: "Picked Up",
    color: "var(--chart-2)",
  },

  "In Transit": {
    label: "In Transit",
    color: "var(--chart-3)",
  },

  Delivered: {
    label: "Delivered",
    color: "var(--chart-5)",
  },

  Cancelled: {
    label: "Cancelled",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

// ============================================================
// STATUS DONUT
// ============================================================

function StatusDonut({
  data,
  total,
}: {
  data: {
    status: string;
    count: number;
    fill: string;
  }[];
  total: number;
}) {
  return (
    <ChartContainer
      config={statusConfig}
      className="mx-auto aspect-square h-[240px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              hideLabel
              formatter={(value, name) =>
                `${name}  ${Number(value).toLocaleString()}`
              }
            />
          }
        />

        <Pie
          data={data}
          dataKey="count"
          nameKey="status"
          innerRadius={68}
          outerRadius={96}
          strokeWidth={4}
          paddingAngle={2}
        >
          <ChartLabel
            content={({ viewBox }) => {
              if (
                viewBox &&
                "cx" in viewBox &&
                "cy" in viewBox
              ) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-2xl font-semibold"
                    >
                      {total.toLocaleString()}
                    </tspan>

                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 22}
                      className="fill-muted-foreground text-xs"
                    >
                      Total Orders
                    </tspan>
                  </text>
                );
              }

              return null;
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}

// ============================================================
// DELIVERY ACTIVITY CHART
// ============================================================

function DeliveryActivityChart({
  orders,
}: {
  orders: Order[];
}) {
  const data = useMemo(() => {
    const dates = [
      "Sep 01",
      "Sep 02",
      "Sep 03",
      "Sep 04",
    ];

    return dates.map((day) => {
      const dayOrders = orders.filter(
        (order) => order.date.startsWith(day)
      );

      return {
        day,
        delivered: dayOrders.filter(
          (order) => order.status === "Delivered"
        ).length,
        active: dayOrders.filter(
          (order) =>
            order.status === "In Transit" ||
            order.status === "Picked Up"
        ).length,
      };
    });
  }, [orders]);

  const chartConfig = {
    delivered: {
      label: "Delivered",
      color: "var(--chart-2)",
    },

    active: {
      label: "Active",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-auto h-[260px] w-full"
    >
      <AreaChart
        data={data}
        margin={{
          left: 4,
          right: 8,
          top: 8,
        }}
      >
        <defs>
          <linearGradient
            id="fillDeliveredOrders"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="var(--chart-2)"
              stopOpacity={0.35}
            />

            <stop
              offset="100%"
              stopColor="var(--chart-2)"
              stopOpacity={0.02}
            />
          </linearGradient>

          <linearGradient
            id="fillActiveOrders"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="var(--chart-1)"
              stopOpacity={0.3}
            />

            <stop
              offset="100%"
              stopColor="var(--chart-1)"
              stopOpacity={0.02}
            />
          </linearGradient>
        </defs>

        <CartesianGrid
          vertical={false}
          strokeDasharray="3 3"
        />

        <XAxis
          dataKey="day"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
        />

        <YAxis
          allowDecimals={false}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          width={30}
        />

        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent indicator="dot" />
          }
        />

        <Area
          dataKey="delivered"
          type="monotone"
          fill="url(#fillDeliveredOrders)"
          stroke="var(--chart-2)"
          strokeWidth={2}
        />

        <Area
          dataKey="active"
          type="monotone"
          fill="url(#fillActiveOrders)"
          stroke="var(--chart-1)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  );
}

// ============================================================
// MAIN PAGE
// ============================================================

export default function LogisticsPage() {
  const [orders, setOrders] =
    useState<Order[]>(INITIAL_ORDERS);

  const [open, setOpen] = useState(false);

  const [customer, setCustomer] = useState("");
  const [pickup, setPickup] = useState("");
  const [delivery, setDelivery] = useState("");
  const [driver, setDriver] = useState("");
  const [date, setDate] = useState("2026-09-04");

  const nextOrderId = useRef(1009);

  // ============================================================
  // DYNAMIC KPI DATA
  // ============================================================

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const inTransitOrders = orders.filter(
    (order) => order.status === "In Transit"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered"
  ).length;

  const customers = new Set(
    orders.map((order) => order.customer)
  ).size;

  const drivers = new Set(
    orders
      .map((order) => order.driver)
      .filter(Boolean)
  ).size;

  // ============================================================
  // STATUS BREAKDOWN
  // ============================================================

  const statusBreakdown = useMemo(() => {
    return STATUS_ORDER.map((status) => ({
      status,
      count: orders.filter(
        (order) => order.status === status
      ).length,
      fill: STATUS_COLORS[status],
    }));
  }, [orders]);

  // ============================================================
  // RESET FORM
  // ============================================================

  function resetForm() {
    setCustomer("");
    setPickup("");
    setDelivery("");
    setDriver("");
    setDate("2026-09-04");
  }

  // ============================================================
  // CREATE ORDER
  // ============================================================

  function handleCreate(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const customerName = customer.trim();
    const pickupLocation = pickup.trim();
    const deliveryLocation = delivery.trim();

    if (!customerName) {
      toast.error("Enter customer name");
      return;
    }

    if (!pickupLocation) {
      toast.error("Enter pickup location");
      return;
    }

    if (!deliveryLocation) {
      toast.error("Enter delivery location");
      return;
    }

    if (!driver) {
      toast.error("Assign a driver");
      return;
    }

    const newOrder: Order = {
      id: `ORD-${nextOrderId.current++}`,
      customer: customerName,
      pickup: pickupLocation,
      delivery: deliveryLocation,
      driver,
      driverSeed: getDriverSeed(driver),
      date: formatDate(date),
      status: "Pending",
    };

    setOrders((previous) => [
      newOrder,
      ...previous,
    ]);

    setOpen(false);
    resetForm();

    toast.success("Order created", {
      description: `${newOrder.id} is now pending.`,
    });
  }

  // ============================================================
  // UPDATE ORDER STATUS
  // ============================================================

  function updateOrderStatus(
    orderId: string,
    status: OrderStatus
  ) {
    setOrders((previous) =>
      previous.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status,
            }
          : order
      )
    );

    toast.success("Order status updated", {
      description: `${orderId} is now ${status}.`,
    });
  }

  // ============================================================
  // EXPORT
  // ============================================================

  function handleExport() {
    const csvRows = [
      [
        "Order ID",
        "Customer",
        "Pickup",
        "Delivery",
        "Driver",
        "Date",
        "Status",
      ],
      ...orders.map((order) => [
        order.id,
        order.customer,
        order.pickup,
        order.delivery,
        order.driver,
        order.date,
        order.status,
      ]),
    ];

    const csv = csvRows
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "logistics-orders.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    toast.success("Orders exported", {
      description: `${orders.length} orders exported successfully.`,
    });
  }

  // ============================================================
  // KPI CARDS
  // ============================================================

  const KPI_STATS = [
    {
      label: "Total Orders",
      value: totalOrders.toLocaleString(),
      change: 0,
      trend: "up" as const,
      hint: "All orders in the system",
    },

    {
      label: "Pending Orders",
      value: pendingOrders.toLocaleString(),
      change: 0,
      trend: "up" as const,
      hint: "Waiting to be processed",
    },

    {
      label: "In Transit",
      value: inTransitOrders.toLocaleString(),
      change: 0,
      trend: "up" as const,
      hint: "Orders currently on route",
    },

    {
      label: "Delivered",
      value: deliveredOrders.toLocaleString(),
      change: 0,
      trend: "up" as const,
      hint: "Successfully delivered",
    },

    {
      label: "Customers",
      value: customers.toLocaleString(),
      change: 0,
      trend: "up" as const,
      hint: "Unique customers",
    },

    {
      label: "Drivers",
      value: drivers.toLocaleString(),
      change: 0,
      trend: "up" as const,
      hint: "Drivers assigned to orders",
    },
  ];

  return (
    <div className="space-y-6">

      {/* ======================================================
          PAGE HEADER
      ======================================================= */}

      <PageHeader
        title="Logistics Dashboard"
        description="Monitor daily orders, deliveries, customers and drivers."
      >
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
        >
          <IconDownload className="size-4" />
          Export
        </Button>

        <Button
          size="sm"
          onClick={() => setOpen(true)}
        >
          <IconPlus className="size-4" />
          New Order
        </Button>
      </PageHeader>

      {/* ======================================================
          KPI CARDS
      ======================================================= */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {KPI_STATS.map((stat) => (
          <StatCard
            key={stat.label}
            stat={stat}
          />
        ))}
      </div>

      {/* ======================================================
          OPERATION OVERVIEW
      ======================================================= */}

      <div className="grid gap-4 lg:grid-cols-3">

        {/* DELIVERY ACTIVITY */}

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Delivery Activity</CardTitle>

            <CardDescription>
              Order activity across recent days
            </CardDescription>

            <CardAction>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">

                <span className="flex items-center gap-1.5">
                  <span
                    className="size-2 rounded-full"
                    style={{
                      backgroundColor:
                        "var(--chart-2)",
                    }}
                  />
                  Delivered
                </span>

                <span className="flex items-center gap-1.5">
                  <span
                    className="size-2 rounded-full"
                    style={{
                      backgroundColor:
                        "var(--chart-1)",
                    }}
                  />
                  Active
                </span>

              </div>
            </CardAction>
          </CardHeader>

          <CardContent>
            <DeliveryActivityChart
              orders={orders}
            />
          </CardContent>
        </Card>

        {/* STATUS */}

        <Card>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>

            <CardDescription>
              Current order distribution
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">

            <StatusDonut
              data={statusBreakdown}
              total={totalOrders}
            />

            <div className="space-y-2.5">

              {statusBreakdown.map((item) => (
                <div
                  key={item.status}
                  className="flex items-center gap-2 text-sm"
                >
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{
                      backgroundColor:
                        item.fill,
                    }}
                  />

                  <span className="font-medium">
                    {item.status}
                  </span>

                  <span className="ms-auto text-muted-foreground tabular-nums">
                    {totalOrders
                      ? (
                          (item.count /
                            totalOrders) *
                          100
                        ).toFixed(0)
                      : 0}
                    %
                  </span>

                  <span className="w-8 text-right font-medium tabular-nums">
                    {item.count}
                  </span>
                </div>
              ))}

            </div>
          </CardContent>
        </Card>
      </div>

      {/* ======================================================
          RECENT ORDERS
      ======================================================= */}

      <Card>

        <CardHeader>

          <CardTitle>Recent Orders</CardTitle>

          <CardDescription>
            Latest logistics orders and delivery status
          </CardDescription>

          <CardAction>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                toast.success(
                  "Dashboard refreshed",
                  {
                    description:
                      "Showing the latest order data.",
                  }
                )
              }
            >
              <IconRefresh className="size-4" />
              Refresh
            </Button>
          </CardAction>

        </CardHeader>

        <CardContent className="px-0">

          <Table>

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

                <TableHead className="pr-6" />

              </TableRow>

            </TableHeader>

            <TableBody>

              {orders.slice(0, 10).map((order) => (

                <TableRow key={order.id}>

                  {/* ORDER ID */}

                  <TableCell className="pl-6 font-medium tabular-nums whitespace-nowrap">
                    {order.id}
                  </TableCell>

                  {/* CUSTOMER */}

                  <TableCell>
                    <div className="flex items-center gap-2">

                      <Avatar className="size-8">

                        <AvatarFallback>
                          {initials(order.customer)}
                        </AvatarFallback>

                      </Avatar>

                      <span className="font-medium whitespace-nowrap">
                        {order.customer}
                      </span>

                    </div>
                  </TableCell>

                  {/* PICKUP */}

                  <TableCell>
                    <span className="flex items-center gap-1.5 whitespace-nowrap">

                      <IconCurrentLocation className="size-4 text-muted-foreground" />

                      <span>
                        {order.pickup}
                      </span>

                    </span>
                  </TableCell>

                  {/* DELIVERY */}

                  <TableCell>

                    <span className="flex items-center gap-1.5 whitespace-nowrap">

                      <IconArrowNarrowRight className="size-4 text-muted-foreground" />

                      <span>
                        {order.delivery}
                      </span>

                    </span>

                  </TableCell>

                  {/* DRIVER */}

                  <TableCell>

                    <div className="flex items-center gap-2.5">

                      <Avatar className="size-8">

                        <AvatarImage
                          src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${order.driverSeed}`}
                          alt={order.driver}
                        />

                        <AvatarFallback>
                          {initials(order.driver)}
                        </AvatarFallback>

                      </Avatar>

                      <span className="whitespace-nowrap">
                        {order.driver}
                      </span>

                    </div>

                  </TableCell>

                  {/* DATE */}

                  <TableCell className="text-muted-foreground whitespace-nowrap">
                    {order.date}
                  </TableCell>

                  {/* STATUS */}

                  <TableCell>

                    <Badge
                      variant="secondary"
                      className={
                        STATUS_BADGES[
                          order.status
                        ]
                      }
                    >
                      {order.status}
                    </Badge>

                  </TableCell>

                  {/* ACTIONS */}

                  <TableCell className="pr-6 text-right">

                    <DropdownMenu>

                      <DropdownMenuTrigger asChild>

                        <Button
                          variant="ghost"
                          size="icon"
                        >
                          <IconDotsVertical className="size-4" />

                          <span className="sr-only">
                            {order.id} actions
                          </span>
                        </Button>

                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">

                        <DropdownMenuLabel>
                          {order.id}
                        </DropdownMenuLabel>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          onSelect={() =>
                            toast(
                              `Tracking ${order.id}`,
                              {
                                description:
                                  `${order.pickup} → ${order.delivery}`,
                              }
                            )
                          }
                        >
                          <IconCurrentLocation className="size-4" />
                          Track Order
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuLabel>
                          Update Status
                        </DropdownMenuLabel>

                        {STATUS_ORDER.map(
                          (status) => (
                            <DropdownMenuItem
                              key={status}
                              onSelect={() =>
                                updateOrderStatus(
                                  order.id,
                                  status
                                )
                              }
                            >
                              {status ===
                                "Delivered" && (
                                <IconCircleCheck className="size-4" />
                              )}

                              {status ===
                                "Cancelled" && (
                                <IconX className="size-4" />
                              )}

                              {status ===
                                "In Transit" && (
                                <IconTruck className="size-4" />
                              )}

                              {status ===
                                "Pending" && (
                                <IconClock className="size-4" />
                              )}

                              {status ===
                                "Assigned" && (
                                <IconUser className="size-4" />
                              )}

                              {status ===
                                "Picked Up" && (
                                <IconPackage className="size-4" />
                              )}

                              {status}
                            </DropdownMenuItem>
                          )
                        )}

                      </DropdownMenuContent>

                    </DropdownMenu>

                  </TableCell>

                </TableRow>

              ))}

            </TableBody>

          </Table>

        </CardContent>
      </Card>

      {/* ======================================================
          QUICK OPERATION CARDS
      ======================================================= */}

      <div className="grid gap-4 md:grid-cols-3">

        {/* CUSTOMERS */}

        <Card>

          <CardHeader>

            <CardTitle className="flex items-center gap-2">
              <IconUsers className="size-5 text-muted-foreground" />
              Customers
            </CardTitle>

            <CardDescription>
              Customers with active orders
            </CardDescription>

          </CardHeader>

          <CardContent>

            <div className="flex items-end justify-between">

              <div>
                <p className="text-3xl font-semibold tabular-nums">
                  {customers}
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Unique customers
                </p>
              </div>

              <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <IconUsers className="size-5" />
              </div>

            </div>

          </CardContent>

        </Card>

        {/* DRIVERS */}

        <Card>

          <CardHeader>

            <CardTitle className="flex items-center gap-2">
              <IconTruck className="size-5 text-muted-foreground" />
              Drivers
            </CardTitle>

            <CardDescription>
              Drivers currently handling orders
            </CardDescription>

          </CardHeader>

          <CardContent>

            <div className="flex items-end justify-between">

              <div>
                <p className="text-3xl font-semibold tabular-nums">
                  {drivers}
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Assigned drivers
                </p>
              </div>

              <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <IconTruckDelivery className="size-5" />
              </div>

            </div>

          </CardContent>

        </Card>

        {/* DELIVERY RATE */}

        <Card>

          <CardHeader>

            <CardTitle className="flex items-center gap-2">
              <IconCircleCheck className="size-5 text-muted-foreground" />
              Delivery Rate
            </CardTitle>

            <CardDescription>
              Successfully delivered orders
            </CardDescription>

          </CardHeader>

          <CardContent>

            <div className="flex items-end justify-between">

              <div>

                <p className="text-3xl font-semibold tabular-nums">

                  {totalOrders
                    ? (
                        (deliveredOrders /
                          totalOrders) *
                        100
                      ).toFixed(1)
                    : "0.0"}
                  %

                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {deliveredOrders} of{" "}
                  {totalOrders} orders
                </p>

              </div>

              <div className="flex size-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                <IconCircleCheck className="size-5" />
              </div>

            </div>

          </CardContent>

        </Card>

      </div>

      {/* ======================================================
          NEW ORDER DIALOG
      ======================================================= */}

      <Dialog
        open={open}
        onOpenChange={(value) => {
          setOpen(value);

          if (!value) {
            resetForm();
          }
        }}
      >

        <DialogContent className="sm:max-w-[560px]">

          <form onSubmit={handleCreate}>

            <DialogHeader>

              <DialogTitle>
                Create New Order
              </DialogTitle>

              <DialogDescription>
                Create a logistics order and assign it
                to a driver.
              </DialogDescription>

            </DialogHeader>

            <div className="grid gap-5 py-5">

              {/* CUSTOMER */}

              <div className="space-y-2">

                <Label htmlFor="customer">
                  Customer
                </Label>

                <Input
                  id="customer"
                  value={customer}
                  onChange={(e) =>
                    setCustomer(e.target.value)
                  }
                  placeholder="Acme Industries"
                />

              </div>

              {/* PICKUP / DELIVERY */}

              <div className="grid gap-4 sm:grid-cols-2">

                <div className="space-y-2">

                  <Label htmlFor="pickup">
                    Pickup Location
                  </Label>

                  <Input
                    id="pickup"
                    value={pickup}
                    onChange={(e) =>
                      setPickup(e.target.value)
                    }
                    placeholder="Chicago"
                  />

                </div>

                <div className="space-y-2">

                  <Label htmlFor="delivery">
                    Delivery Location
                  </Label>

                  <Input
                    id="delivery"
                    value={delivery}
                    onChange={(e) =>
                      setDelivery(e.target.value)
                    }
                    placeholder="Denver"
                  />

                </div>

              </div>

              {/* DRIVER */}

              <div className="space-y-2">

                <Label htmlFor="driver">
                  Driver
                </Label>

                <Select
                  value={driver}
                  onValueChange={setDriver}
                >

                  <SelectTrigger
                    id="driver"
                    className="w-full"
                  >
                    <SelectValue placeholder="Assign a driver" />
                  </SelectTrigger>

                  <SelectContent>

                    {DRIVERS.map((item) => (

                      <SelectItem
                        key={item.name}
                        value={item.name}
                      >

                        <div className="flex items-center gap-2">

                          <Avatar className="size-6">

                            <AvatarImage
                              src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${item.seed}`}
                              alt={item.name}
                            />

                            <AvatarFallback>
                              {initials(item.name)}
                            </AvatarFallback>

                          </Avatar>

                          {item.name}

                        </div>

                      </SelectItem>

                    ))}

                  </SelectContent>

                </Select>

              </div>

              {/* DATE */}

              <div className="space-y-2">

                <Label htmlFor="order-date">
                  Order Date
                </Label>

                <Input
                  id="order-date"
                  type="date"
                  value={date}
                  onChange={(e) =>
                    setDate(e.target.value)
                  }
                />

              </div>

              {/* DEFAULT STATUS */}

              <div className="rounded-lg border bg-muted/30 p-3">

                <div className="flex items-center gap-2">

                  <IconClock className="size-4 text-muted-foreground" />

                  <div>

                    <p className="text-sm font-medium">
                      Initial Status
                    </p>

                    <p className="text-xs text-muted-foreground">
                      New orders start as Pending.
                    </p>

                  </div>

                  <Badge
                    variant="secondary"
                    className="ml-auto bg-amber-500/10 text-amber-600"
                  >
                    Pending
                  </Badge>

                </div>

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

                Create Order

              </Button>

            </DialogFooter>

          </form>

        </DialogContent>

      </Dialog>

    </div>
  );
}