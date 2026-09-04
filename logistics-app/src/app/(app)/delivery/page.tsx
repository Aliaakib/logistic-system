"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  IconArrowLeft,
  IconBox,
  IconCalendar,
  IconCheck,
  IconCircleCheck,
  IconClock,
  IconMap,
  IconMapPin,
  IconNavigation,
  IconPackage,
  IconPhone,
  IconSearch,
  IconTruck,
  IconUser,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

/* =========================================================
   TYPES
========================================================= */

type DeliveryStatus =
  | "Pending"
  | "Assigned"
  | "Picked Up"
  | "In Transit"
  | "Delivered";

type TrackingOrder = {
  id: string;
  customer: string;
  customerPhone: string;
  pickup: string;
  pickupAddress: string;
  delivery: string;
  deliveryAddress: string;
  driver: string;
  driverPhone: string;
  vehicle: string;
  status: DeliveryStatus;
  expectedDelivery: string;
  orderDate: string;
  packageCount: number;
  weight: string;
  currentLocation: string;
  estimatedArrival: string;
  progress: number;
};

/* =========================================================
   DEMO DATA
========================================================= */

const demoOrders: TrackingOrder[] = [
  {
    id: "ORD-10248",
    customer: "ABC International Logistics",
    customerPhone: "+91 98765 11223",
    pickup: "Ahmedabad",
    pickupAddress: "Naroda GIDC, Ahmedabad, Gujarat",
    delivery: "Mumbai",
    deliveryAddress: "Andheri East, Mumbai, Maharashtra",
    driver: "John Smith",
    driverPhone: "+91 98765 43210",
    vehicle: "Truck • GJ-01-AB-4587",
    status: "In Transit",
    expectedDelivery: "Sep 06, 2026",
    orderDate: "Sep 04, 2026",
    packageCount: 18,
    weight: "420 kg",
    currentLocation: "Vadodara, Gujarat",
    estimatedArrival: "Sep 06, 2026 • 11:30 AM",
    progress: 68,
  },
  {
    id: "ORD-10247",
    customer: "Shree Logistics Pvt Ltd",
    customerPhone: "+91 98250 11223",
    pickup: "Mumbai",
    pickupAddress: "Bhiwandi Logistics Park, Mumbai",
    delivery: "Pune",
    deliveryAddress: "Hadapsar, Pune, Maharashtra",
    driver: "Rajesh Kumar",
    driverPhone: "+91 99123 45678",
    vehicle: "Truck • MH-04-CD-2189",
    status: "Picked Up",
    expectedDelivery: "Sep 07, 2026",
    orderDate: "Sep 04, 2026",
    packageCount: 12,
    weight: "280 kg",
    currentLocation: "Mumbai, Maharashtra",
    estimatedArrival: "Sep 07, 2026 • 3:00 PM",
    progress: 35,
  },
  {
    id: "ORD-10246",
    customer: "Apex Industries",
    customerPhone: "+91 98980 33445",
    pickup: "Delhi",
    pickupAddress: "Okhla Industrial Area, Delhi",
    delivery: "Jaipur",
    deliveryAddress: "Sitapura Industrial Area, Jaipur",
    driver: "Amit Sharma",
    driverPhone: "+91 97654 32109",
    vehicle: "Truck • DL-01-EF-9012",
    status: "Assigned",
    expectedDelivery: "Sep 07, 2026",
    orderDate: "Sep 04, 2026",
    packageCount: 9,
    weight: "190 kg",
    currentLocation: "Delhi, India",
    estimatedArrival: "Sep 07, 2026 • 2:00 PM",
    progress: 20,
  },
  {
    id: "ORD-10245",
    customer: "Metro Wholesale",
    customerPhone: "+91 98980 55443",
    pickup: "Ahmedabad",
    pickupAddress: "Changodar GIDC, Ahmedabad",
    delivery: "Surat",
    deliveryAddress: "Sachin GIDC, Surat",
    driver: "Vikram Patel",
    driverPhone: "+91 99887 66554",
    vehicle: "Truck • GJ-05-GH-3321",
    status: "Delivered",
    expectedDelivery: "Sep 03, 2026",
    orderDate: "Sep 03, 2026",
    packageCount: 14,
    weight: "320 kg",
    currentLocation: "Surat, Gujarat",
    estimatedArrival: "Delivered",
    progress: 100,
  },
];

/* =========================================================
   STATUS
========================================================= */

const statusOrder: DeliveryStatus[] = [
  "Pending",
  "Assigned",
  "Picked Up",
  "In Transit",
  "Delivered",
];

const timeline = [
  {
    title: "Order Created",
    description: "Delivery order was created",
    status: "Pending" as DeliveryStatus,
  },
  {
    title: "Driver Assigned",
    description: "Driver was assigned to the order",
    status: "Assigned" as DeliveryStatus,
  },
  {
    title: "Package Picked Up",
    description: "Package collected from pickup location",
    status: "Picked Up" as DeliveryStatus,
  },
  {
    title: "In Transit",
    description: "Shipment is currently on the way",
    status: "In Transit" as DeliveryStatus,
  },
  {
    title: "Delivered",
    description: "Package successfully delivered",
    status: "Delivered" as DeliveryStatus,
  },
];

function getStatusIndex(status: DeliveryStatus) {
  return statusOrder.indexOf(status);
}

function getStatusClasses(status: DeliveryStatus) {
  switch (status) {
    case "Delivered":
      return "bg-teal-500/10 text-teal-600 dark:text-teal-400";

    case "In Transit":
      return "bg-sky-500/10 text-sky-600 dark:text-sky-400";

    case "Picked Up":
      return "bg-purple-500/10 text-purple-600 dark:text-purple-400";

    case "Assigned":
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400";

    default:
      return "bg-muted text-muted-foreground";
  }
}

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({
  label,
  value,
  icon,
  iconClass,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  iconClass: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {label}
            </p>

            <p className="mt-2 truncate text-lg font-semibold">
              {value}
            </p>
          </div>

          <div
            className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${iconClass}`}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function DeliveryPage() {
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] =
    useState<TrackingOrder | null>(demoOrders[0]);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return demoOrders;
    }

    return demoOrders.filter(
      (order) =>
        order.id.toLowerCase().includes(query) ||
        order.customer.toLowerCase().includes(query)
    );
  }, [search]);

  function handleSearch() {
    const query = search.trim().toLowerCase();

    if (!query) {
      setSelectedOrder(demoOrders[0]);
      return;
    }

    const found = demoOrders.find(
      (order) =>
        order.id.toLowerCase() === query ||
        order.customer.toLowerCase().includes(query)
    );

    setSelectedOrder(found ?? null);
  }

  return (
    <div className="space-y-6">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="size-9"
          >
            <Link href="/orders">
              <IconArrowLeft className="size-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>

          <div>
            <div className="flex items-center gap-2">
              <IconNavigation className="size-5 text-sky-500" />

              <h1 className="text-2xl font-semibold tracking-tight">
                Delivery Tracking
              </h1>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              Track delivery progress by order status and location.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400"
          >
            <span className="mr-2 size-1.5 rounded-full bg-sky-500" />
            Status-based tracking
          </Badge>

          <Badge
            variant="outline"
            className="border-border"
          >
            GPS Demo
          </Badge>
        </div>
      </div>

      {/* =====================================================
          SEARCH
      ===================================================== */}

      <Card>
        <CardContent className="p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="mb-2 block text-sm font-medium">
                Search Order
              </label>

              <div className="relative">
                <IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleSearch();
                    }
                  }}
                  placeholder="Enter Order ID, e.g. ORD-10248"
                  className="pl-9"
                />
              </div>
            </div>

            <Button
              onClick={handleSearch}
              className="sm:min-w-[140px]"
            >
              <IconSearch className="size-4" />
              Track Order
            </Button>
          </div>

          {search && filteredOrders.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">
                Demo orders:
              </span>

              {filteredOrders.map((order) => (
                <button
                  key={order.id}
                  onClick={() => {
                    setSelectedOrder(order);
                    setSearch(order.id);
                  }}
                  className="rounded-md border border-border bg-muted/40 px-3 py-1.5 text-xs font-medium transition hover:bg-muted"
                >
                  {order.id}
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* =====================================================
          NOT FOUND
      ===================================================== */}

      {!selectedOrder ? (
        <Card>
          <CardContent className="flex min-h-[300px] flex-col items-center justify-center text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
              <IconPackage className="size-7 text-muted-foreground" />
            </div>

            <h2 className="text-lg font-semibold">
              Order not found
            </h2>

            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              No delivery was found for the entered Order ID.
              Try ORD-10248.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* =================================================
              SUMMARY
          ================================================= */}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              label="Order ID"
              value={selectedOrder.id}
              icon={
                <IconBox className="size-5 text-sky-600 dark:text-sky-400" />
              }
              iconClass="bg-sky-500/10"
            />

            <SummaryCard
              label="Customer"
              value={selectedOrder.customer}
              icon={
                <IconUser className="size-5 text-purple-600 dark:text-purple-400" />
              }
              iconClass="bg-purple-500/10"
            />

            <SummaryCard
              label="Driver"
              value={selectedOrder.driver}
              icon={
                <IconTruck className="size-5 text-amber-600 dark:text-amber-400" />
              }
              iconClass="bg-amber-500/10"
            />

            <SummaryCard
              label="Expected Delivery"
              value={selectedOrder.expectedDelivery}
              icon={
                <IconCalendar className="size-5 text-teal-600 dark:text-teal-400" />
              }
              iconClass="bg-teal-500/10"
            />
          </div>

          {/* =================================================
              STATUS
          ================================================= */}

          <div className="flex flex-wrap items-center gap-3">
            <Badge
              variant="secondary"
              className={getStatusClasses(
                selectedOrder.status
              )}
            >
              {selectedOrder.status}
            </Badge>

            <span className="text-sm text-muted-foreground">
              ETA: {selectedOrder.estimatedArrival}
            </span>
          </div>

          {/* =================================================
              ROUTE + GPS
          ================================================= */}

          <div className="grid gap-6 xl:grid-cols-[0.9fr_1.5fr]">
            {/* ROUTE */}

            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Delivery Route
                </CardTitle>

                <CardDescription>
                  Pickup, current location and delivery
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-1">
                  {/* PICKUP */}

                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex size-9 items-center justify-center rounded-full bg-teal-500/10">
                        <IconMapPin className="size-5 text-teal-600 dark:text-teal-400" />
                      </div>

                      <div className="h-14 border-l border-dashed border-border" />
                    </div>

                    <div className="pb-5">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Pickup
                      </p>

                      <p className="mt-1 font-semibold">
                        {selectedOrder.pickup}
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {selectedOrder.pickupAddress}
                      </p>
                    </div>
                  </div>

                  {/* CURRENT */}

                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="relative flex size-9 items-center justify-center rounded-full bg-sky-500/10">
                        <span className="absolute size-9 animate-ping rounded-full bg-sky-500/10" />

                        <IconTruck className="relative size-5 text-sky-600 dark:text-sky-400" />
                      </div>

                      <div className="h-14 border-l border-dashed border-border" />
                    </div>

                    <div className="pb-5">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Current Location
                      </p>

                      <p className="mt-1 font-semibold">
                        {selectedOrder.currentLocation}
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        Static GPS demonstration point
                      </p>
                    </div>
                  </div>

                  {/* DELIVERY */}

                  <div className="flex gap-4">
                    <div className="flex size-9 items-center justify-center rounded-full bg-orange-500/10">
                      <IconMapPin className="size-5 text-orange-600 dark:text-orange-400" />
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Delivery
                      </p>

                      <p className="mt-1 font-semibold">
                        {selectedOrder.delivery}
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {selectedOrder.deliveryAddress}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Packages
                    </p>

                    <p className="mt-1 font-semibold">
                      {selectedOrder.packageCount}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Weight
                    </p>

                    <p className="mt-1 font-semibold">
                      {selectedOrder.weight}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* GPS */}

            <Card className="overflow-hidden">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <IconMap className="size-5 text-sky-500" />
                      GPS Location
                    </CardTitle>

                    <CardDescription>
                      Static location demo — live GPS not connected
                    </CardDescription>
                  </div>

                  <Badge
                    variant="outline"
                    className="border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400"
                  >
                    Demo
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                {/* =================================================
                    STATIC MAP
                ================================================= */}

                <div className="relative h-[390px] overflow-hidden bg-muted/50">
                  {/* Map grid */}

                  <div className="absolute inset-0 opacity-40">
                    <div className="absolute left-[12%] top-[-10%] h-[130%] w-px rotate-[24deg] bg-background" />

                    <div className="absolute left-[34%] top-[-20%] h-[150%] w-0.5 rotate-[65deg] bg-background" />

                    <div className="absolute left-[62%] top-[-15%] h-[150%] w-0.5 rotate-[102deg] bg-background" />

                    <div className="absolute left-[82%] top-[-20%] h-[150%] w-px rotate-[145deg] bg-background" />

                    <div className="absolute left-0 top-[25%] h-px w-full rotate-[-8deg] bg-background" />

                    <div className="absolute left-0 top-[53%] h-0.5 w-full rotate-[5deg] bg-background" />

                    <div className="absolute left-0 top-[78%] h-px w-full rotate-[-4deg] bg-background" />
                  </div>

                  {/* Main Roads */}

                  <div className="absolute left-[-10%] top-[45%] h-5 w-[120%] rotate-[18deg] rounded-full bg-background/90 shadow-sm" />

                  <div className="absolute left-[47%] top-[-10%] h-[120%] w-6 rotate-[35deg] rounded-full bg-background/90 shadow-sm" />

                  <div className="absolute left-[15%] top-[60%] h-4 w-[85%] rotate-[-22deg] rounded-full bg-background/90 shadow-sm" />

                  {/* Route */}

                  <div className="absolute left-[19%] top-[65%] h-0 w-[61%] rotate-[-23deg] border-t-2 border-dashed border-sky-500" />

                  {/* Pickup */}

                  <div className="absolute left-[14%] top-[71%]">
                    <div className="relative">
                      <div className="flex size-10 items-center justify-center rounded-full bg-teal-600 text-white shadow-lg ring-4 ring-background">
                        <IconMapPin className="size-5" />
                      </div>

                      <div className="absolute left-1/2 top-11 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-card px-2 py-1 text-[11px] font-semibold shadow-sm">
                        Pickup
                      </div>
                    </div>
                  </div>

                  {/* Driver */}

                  <div className="absolute left-[48%] top-[48%]">
                    <div className="relative">
                      <div className="absolute -inset-3 animate-pulse rounded-full bg-sky-500/20" />

                      <div className="relative flex size-12 items-center justify-center rounded-full bg-sky-600 text-white shadow-lg ring-4 ring-background">
                        <IconTruck className="size-6" />
                      </div>

                      <div className="absolute left-1/2 top-14 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-card px-3 py-1.5 text-[11px] font-semibold shadow-md">
                        Driver Location
                      </div>
                    </div>
                  </div>

                  {/* Delivery */}

                  <div className="absolute right-[14%] top-[24%]">
                    <div className="relative">
                      <div className="flex size-10 items-center justify-center rounded-full bg-orange-600 text-white shadow-lg ring-4 ring-background">
                        <IconMapPin className="size-5" />
                      </div>

                      <div className="absolute left-1/2 top-11 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-card px-2 py-1 text-[11px] font-semibold shadow-sm">
                        Delivery
                      </div>
                    </div>
                  </div>

                  {/* Current Location */}

                  <div className="absolute left-5 top-5 rounded-lg border border-border bg-card/95 px-3 py-2 shadow-sm backdrop-blur">
                    <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                      Current Location
                    </p>

                    <p className="mt-0.5 text-sm font-semibold">
                      {selectedOrder.currentLocation}
                    </p>
                  </div>

                  {/* Zoom */}

                  <div className="absolute bottom-5 right-5 flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm">
                    <button
                      type="button"
                      className="flex size-9 items-center justify-center text-lg transition hover:bg-muted"
                    >
                      +
                    </button>

                    <Separator />

                    <button
                      type="button"
                      className="flex size-9 items-center justify-center text-lg transition hover:bg-muted"
                    >
                      −
                    </button>
                  </div>
                </div>

                {/* MAP LEGEND */}

                <div className="grid grid-cols-3 divide-x divide-border border-t bg-card">
                  <div className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="size-2.5 rounded-full bg-teal-500" />
                      <span className="text-xs font-medium">
                        Pickup
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="size-2.5 rounded-full bg-sky-500" />
                      <span className="text-xs font-medium">
                        Driver
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="size-2.5 rounded-full bg-orange-500" />
                      <span className="text-xs font-medium">
                        Delivery
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* =================================================
              PROGRESS
          ================================================= */}

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-base">
                    Delivery Progress
                  </CardTitle>

                  <CardDescription>
                    Current status of {selectedOrder.id}
                  </CardDescription>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold tabular-nums">
                    {selectedOrder.progress}%
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Complete
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-sky-500 transition-all duration-500"
                  style={{
                    width: `${selectedOrder.progress}%`,
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* =================================================
              TIMELINE + DRIVER
          ================================================= */}

          <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            {/* TIMELINE */}

            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Tracking Timeline
                </CardTitle>

                <CardDescription>
                  Delivery activity for this order
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div>
                  {timeline.map((item, index) => {
                    const currentIndex = getStatusIndex(
                      selectedOrder.status
                    );

                    const itemIndex = getStatusIndex(
                      item.status
                    );

                    const isCompleted =
                      itemIndex <= currentIndex;

                    const isCurrent =
                      itemIndex === currentIndex;

                    return (
                      <div
                        key={item.title}
                        className="flex gap-4"
                      >
                        <div className="flex flex-col items-center">
                          <div
                            className={`flex size-9 shrink-0 items-center justify-center rounded-full border-2 ${
                              isCompleted
                                ? "border-sky-500 bg-sky-500 text-white"
                                : "border-border bg-muted text-muted-foreground"
                            }`}
                          >
                            {isCompleted ? (
                              <IconCheck className="size-4" />
                            ) : (
                              <span className="size-2 rounded-full bg-current" />
                            )}
                          </div>

                          {index < timeline.length - 1 && (
                            <div
                              className={`h-14 w-0.5 ${
                                itemIndex < currentIndex
                                  ? "bg-sky-500"
                                  : "bg-border"
                              }`}
                            />
                          )}
                        </div>

                        <div className="pb-8">
                          <div className="flex flex-wrap items-center gap-2">
                            <p
                              className={`font-medium ${
                                isCurrent
                                  ? "text-sky-600 dark:text-sky-400"
                                  : isCompleted
                                  ? "text-foreground"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {item.title}
                            </p>

                            {isCurrent && (
                              <Badge
                                variant="secondary"
                                className="bg-sky-500/10 text-sky-600 dark:text-sky-400"
                              >
                                Current
                              </Badge>
                            )}
                          </div>

                          <p className="mt-1 text-sm text-muted-foreground">
                            {item.description}
                          </p>

                          {isCurrent && (
                            <div className="mt-2 flex items-center gap-1.5 text-xs text-sky-600 dark:text-sky-400">
                              <IconClock className="size-3.5" />
                              Updated just now
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* DRIVER */}

            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Driver Information
                </CardTitle>

                <CardDescription>
                  Assigned delivery driver
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex size-14 items-center justify-center rounded-full bg-muted">
                    <IconUser className="size-7 text-muted-foreground" />
                  </div>

                  <div>
                    <p className="font-semibold">
                      {selectedOrder.driver}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      Professional Driver
                    </p>
                  </div>
                </div>

                <Separator className="my-5" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <IconTruck className="size-4 text-muted-foreground" />

                      <span className="text-sm">
                        Vehicle
                      </span>
                    </div>

                    <span className="text-right text-sm font-medium">
                      {selectedOrder.vehicle}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <IconPhone className="size-4 text-muted-foreground" />

                      <span className="text-sm">
                        Contact
                      </span>
                    </div>

                    <span className="text-right text-sm font-medium">
                      {selectedOrder.driverPhone}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <IconNavigation className="size-4 text-muted-foreground" />

                      <span className="text-sm">
                        Location
                      </span>
                    </div>

                    <span className="text-right text-sm font-medium">
                      {selectedOrder.currentLocation}
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="mt-6 w-full"
                >
                  <IconPhone className="size-4" />
                  Contact Driver
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* =================================================
              DETAILS
          ================================================= */}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Delivery Details
              </CardTitle>

              <CardDescription>
                Additional information for this shipment
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Order Date
                  </p>

                  <p className="mt-2 font-medium">
                    {selectedOrder.orderDate}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Packages
                  </p>

                  <p className="mt-2 font-medium">
                    {selectedOrder.packageCount} Packages
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Weight
                  </p>

                  <p className="mt-2 font-medium">
                    {selectedOrder.weight}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Expected Arrival
                  </p>

                  <p className="mt-2 font-medium">
                    {selectedOrder.estimatedArrival}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* =================================================
              DEMO NOTICE
          ================================================= */}

          <div className="rounded-lg border border-sky-500/20 bg-sky-500/5 p-4">
            <div className="flex gap-3">
              <IconCircleCheck className="mt-0.5 size-5 shrink-0 text-sky-500" />

              <div>
                <p className="text-sm font-semibold text-sky-700 dark:text-sky-400">
                  Demo GPS Tracking
                </p>

                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  The map above is a static GPS demonstration.
                  Live GPS is not connected. In production, this
                  area can be connected to the client&apos;s actual
                  GPS or vehicle tracking provider while the
                  status-based tracking remains independent.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}