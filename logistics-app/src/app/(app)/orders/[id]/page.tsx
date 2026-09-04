import Link from "next/link";
import {
  IconArrowLeft,
  IconCalendar,
  IconCheck,
  IconClock,
  IconMapPin,
  IconPackage,
  IconPhone,
  IconMail,
  IconTruck,
  IconUser,
  IconWeight,
  IconBox,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { OrderActions } from "./order-actions";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type LogisticsStatus =
  | "Pending"
  | "Assigned"
  | "Picked Up"
  | "In Transit"
  | "Delivered"
  | "Cancelled";

type LogisticsOrder = {
  id: string;
  customer: string;
  phone: string;
  email: string;
  address: string;
  pickup: string;
  delivery: string;
  driver: string;
  driverPhone: string;
  vehicle: string;
  vehicleNumber: string;
  date: string;
  status: LogisticsStatus;
  packageType: string;
  quantity: number;
  weight: number;
  expectedDelivery: string;
};

/* -------------------------------------------------------------------------- */
/* Demo Logistics Orders                                                      */
/* -------------------------------------------------------------------------- */

/*
 * These records match the logistics order table.
 *
 * ORD-10248 is the order shown in your screenshot:
 * ABC International Logistics
 * Ahmedabad -> Mumbai
 * John Smith
 */

const orders: LogisticsOrder[] = [
  {
    id: "ORD-10248",
    customer: "ABC International Logistics",
    phone: "+91 98765 43210",
    email: "amit@abcinternational.com",
    address: "Satellite Road, Ahmedabad, Gujarat",
    pickup: "Ahmedabad",
    delivery: "Mumbai",
    driver: "John Smith",
    driverPhone: "+91 98765 10001",
    vehicle: "Tata Prima 5530",
    vehicleNumber: "GJ-01-AB-1024",
    date: "2026-09-04",
    status: "Pending",
    packageType: "General Freight",
    quantity: 4,
    weight: 420,
    expectedDelivery: "2026-09-07",
  },
  {
    id: "ORD-10247",
    customer: "Shree Logistics Pvt Ltd",
    phone: "+91 98250 12345",
    email: "rajesh@shreelogistics.com",
    address: "Andheri East, Mumbai, Maharashtra",
    pickup: "Mumbai",
    delivery: "Pune",
    driver: "Rajesh Kumar",
    driverPhone: "+91 98250 10002",
    vehicle: "Ashok Leyland 4220",
    vehicleNumber: "MH-02-CD-2471",
    date: "2026-09-04",
    status: "In Transit",
    packageType: "Industrial Equipment",
    quantity: 3,
    weight: 680,
    expectedDelivery: "2026-09-06",
  },
  {
    id: "ORD-10246",
    customer: "Apex Industries",
    phone: "+91 98980 45678",
    email: "neha@apexindustries.com",
    address: "Sector 18, Noida, Uttar Pradesh",
    pickup: "Delhi",
    delivery: "Jaipur",
    driver: "Amit Sharma",
    driverPhone: "+91 98980 10003",
    vehicle: "BharatBenz 2823",
    vehicleNumber: "DL-01-EF-2462",
    date: "2026-09-04",
    status: "Assigned",
    packageType: "Industrial Equipment",
    quantity: 5,
    weight: 750,
    expectedDelivery: "2026-09-07",
  },
  {
    id: "ORD-10245",
    customer: "Metro Wholesale",
    phone: "+91 98190 34567",
    email: "vikram@metrowholesale.com",
    address: "Ring Road, Surat, Gujarat",
    pickup: "Ahmedabad",
    delivery: "Surat",
    driver: "Vikram Patel",
    driverPhone: "+91 98190 10004",
    vehicle: "Tata Signa 4018",
    vehicleNumber: "GJ-05-GH-2455",
    date: "2026-09-03",
    status: "Delivered",
    packageType: "Retail Goods",
    quantity: 6,
    weight: 310,
    expectedDelivery: "2026-09-06",
  },
  {
    id: "ORD-10244",
    customer: "BlueLine Foods",
    phone: "+91 98490 56789",
    email: "suresh@bluelinefoods.com",
    address: "Whitefield Main Road, Bengaluru, Karnataka",
    pickup: "Bengaluru",
    delivery: "Chennai",
    driver: "Suresh Reddy",
    driverPhone: "+91 98490 10005",
    vehicle: "Eicher Pro 6042",
    vehicleNumber: "KA-01-IJ-2444",
    date: "2026-09-03",
    status: "Picked Up",
    packageType: "Food Products",
    quantity: 8,
    weight: 520,
    expectedDelivery: "2026-09-06",
  },
  {
    id: "ORD-10243",
    customer: "Prime Hardware",
    phone: "+91 99850 11223",
    email: "kiran@primehardware.com",
    address: "Banjara Hills, Hyderabad, Telangana",
    pickup: "Hyderabad",
    delivery: "Vijayawada",
    driver: "Kiran Rao",
    driverPhone: "+91 99850 10006",
    vehicle: "Tata Ultra 1918",
    vehicleNumber: "TS-09-KL-2433",
    date: "2026-09-03",
    status: "Pending",
    packageType: "Hardware",
    quantity: 7,
    weight: 390,
    expectedDelivery: "2026-09-06",
  },
  {
    id: "ORD-10242",
    customer: "Evergreen Pharma",
    phone: "+91 97660 33445",
    email: "manoj@evergreenpharma.com",
    address: "Baner Road, Pune, Maharashtra",
    pickup: "Pune",
    delivery: "Nashik",
    driver: "Manoj Patil",
    driverPhone: "+91 97660 10007",
    vehicle: "Tata 1612",
    vehicleNumber: "MH-12-MN-2422",
    date: "2026-09-02",
    status: "Delivered",
    packageType: "Pharmaceuticals",
    quantity: 5,
    weight: 280,
    expectedDelivery: "2026-09-05",
  },
  {
    id: "ORD-10241",
    customer: "Northstar Retail",
    phone: "+91 98310 77889",
    email: "arjun@northstarretail.com",
    address: "Salt Lake, Kolkata, West Bengal",
    pickup: "Kolkata",
    delivery: "Bhubaneswar",
    driver: "Arjun Das",
    driverPhone: "+91 98310 10008",
    vehicle: "Ashok Leyland 1920",
    vehicleNumber: "WB-02-OP-2411",
    date: "2026-09-02",
    status: "In Transit",
    packageType: "Retail Goods",
    quantity: 9,
    weight: 610,
    expectedDelivery: "2026-09-05",
  },
  {
    id: "ORD-10240",
    customer: "Urban Mart",
    phone: "+91 98100 55667",
    email: "rohit@urbanmart.com",
    address: "Sector 62, Noida, Uttar Pradesh",
    pickup: "Noida",
    delivery: "Lucknow",
    driver: "Rohit Verma",
    driverPhone: "+91 98100 10009",
    vehicle: "Tata 709",
    vehicleNumber: "UP-16-QR-2400",
    date: "2026-09-02",
    status: "Delivered",
    packageType: "Consumer Products",
    quantity: 4,
    weight: 250,
    expectedDelivery: "2026-09-05",
  },
  {
    id: "ORD-10239",
    customer: "Global Electronics",
    phone: "+91 99090 88990",
    email: "vijay@globalelectronics.com",
    address: "SG Highway, Ahmedabad, Gujarat",
    pickup: "Ahmedabad",
    delivery: "Vadodara",
    driver: "Vijay Singh",
    driverPhone: "+91 99090 10010",
    vehicle: "Eicher Pro 3015",
    vehicleNumber: "GJ-01-ST-2399",
    date: "2026-09-01",
    status: "Assigned",
    packageType: "Electronics",
    quantity: 6,
    weight: 360,
    expectedDelivery: "2026-09-04",
  },
  {
    id: "ORD-10238",
    customer: "Reliance Distributors",
    phone: "+91 98240 12345",
    email: "operations@reliancedistributors.com",
    address: "Naroda, Ahmedabad, Gujarat",
    pickup: "Ahmedabad",
    delivery: "Rajkot",
    driver: "Sanjay Mehta",
    driverPhone: "+91 98240 10011",
    vehicle: "Tata Prima 4625",
    vehicleNumber: "GJ-03-UV-2388",
    date: "2026-09-01",
    status: "In Transit",
    packageType: "General Freight",
    quantity: 8,
    weight: 720,
    expectedDelivery: "2026-09-05",
  },
  {
    id: "ORD-10237",
    customer: "Sunrise Textiles",
    phone: "+91 98790 54321",
    email: "admin@sunrisetextiles.com",
    address: "Ring Road, Surat, Gujarat",
    pickup: "Surat",
    delivery: "Mumbai",
    driver: "Deepak Shah",
    driverPhone: "+91 98790 10012",
    vehicle: "BharatBenz 3128",
    vehicleNumber: "GJ-05-WX-2377",
    date: "2026-08-31",
    status: "Delivered",
    packageType: "Textiles",
    quantity: 12,
    weight: 840,
    expectedDelivery: "2026-09-03",
  },
  {
    id: "ORD-10236",
    customer: "Western Auto Parts",
    phone: "+91 99099 11223",
    email: "logistics@westernauto.com",
    address: "Makarpura, Vadodara, Gujarat",
    pickup: "Vadodara",
    delivery: "Ahmedabad",
    driver: "Nilesh Patel",
    driverPhone: "+91 99099 10013",
    vehicle: "Tata 1815",
    vehicleNumber: "GJ-06-YZ-2366",
    date: "2026-08-31",
    status: "Picked Up",
    packageType: "Auto Parts",
    quantity: 5,
    weight: 470,
    expectedDelivery: "2026-09-03",
  },
  {
    id: "ORD-10235",
    customer: "National Supplies",
    phone: "+91 98111 22334",
    email: "dispatch@nationalsupplies.com",
    address: "Okhla Industrial Area, New Delhi",
    pickup: "Delhi",
    delivery: "Chandigarh",
    driver: "Harish Kumar",
    driverPhone: "+91 98111 10014",
    vehicle: "Ashok Leyland 2820",
    vehicleNumber: "DL-01-AB-2355",
    date: "2026-08-30",
    status: "Delivered",
    packageType: "General Freight",
    quantity: 7,
    weight: 560,
    expectedDelivery: "2026-09-02",
  },
];

/* -------------------------------------------------------------------------- */
/* Timeline                                                                   */
/* -------------------------------------------------------------------------- */

const timeline = [
  {
    label: "Created",
    description: "Order was created",
    icon: IconPackage,
  },
  {
    label: "Assigned",
    description: "Driver was assigned",
    icon: IconUser,
  },
  {
    label: "Picked Up",
    description: "Shipment picked up",
    icon: IconBox,
  },
  {
    label: "In Transit",
    description: "Shipment is on the way",
    icon: IconTruck,
  },
  {
    label: "Delivered",
    description: "Shipment delivered",
    icon: IconCheck,
  },
] as const;

/* -------------------------------------------------------------------------- */
/* Status Helpers                                                             */
/* -------------------------------------------------------------------------- */

const statusStage: Record<LogisticsStatus, number> = {
  Pending: 0,
  Assigned: 1,
  "Picked Up": 2,
  "In Transit": 3,
  Delivered: 4,
  Cancelled: 0,
};

const statusStyles: Record<LogisticsStatus, string> = {
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

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatShortDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}

function findOrder(id: string) {
  const normalizedId = decodeURIComponent(id)
    .replace(/^#/, "")
    .trim()
    .toLowerCase();

  return orders.find(
    (order) =>
      order.id.toLowerCase() === normalizedId
  );
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = findOrder(id);

  /*
   * We intentionally don't use notFound().
   *
   * The Orders page and this page now use the same logistics
   * order dataset, so ORD-10248 resolves correctly.
   */
  if (!order) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-xl items-center justify-center">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle>
              Order not found
            </CardTitle>

            <CardDescription>
              We couldn't find order{" "}
              <span className="font-medium text-foreground">
                {id}
              </span>
              .
            </CardDescription>
          </CardHeader>

          <CardContent className="flex justify-center">
            <Button asChild>
              <Link href="/orders">
                <IconArrowLeft className="size-4" />
                Back to orders
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentStage =
    statusStage[order.status];

  const customerInitials = order.customer
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const driverInitials = order.driver
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const timelineDates = [
    order.date,
    order.date,
    order.date,
    order.date,
    order.expectedDelivery,
  ];

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-start gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="mt-0.5 size-9 shrink-0"
            asChild
          >
            <Link href="/orders">
              <IconArrowLeft className="size-4" />
              <span className="sr-only">
                Back to orders
              </span>
            </Link>
          </Button>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-semibold tracking-tight">
                {order.id}
              </h1>

              <Badge
                variant="secondary"
                className={statusStyles[order.status]}
              >
                {order.status}
              </Badge>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              Order details · {order.pickup} →{" "}
              {order.delivery}
            </p>
          </div>
        </div>

        <OrderActions
          slug={order.id}
          orderId={order.id}
          customerEmail={order.email}
        />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Overview                                                           */}
      {/* ------------------------------------------------------------------ */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Order date
              </p>

              <IconCalendar className="size-4 text-muted-foreground" />
            </div>

            <p className="mt-2 text-xl font-semibold">
              {formatDate(order.date)}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Created date
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Package
              </p>

              <IconPackage className="size-4 text-muted-foreground" />
            </div>

            <p className="mt-2 text-xl font-semibold">
              {order.quantity}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {order.packageType}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Weight
              </p>

              <IconWeight className="size-4 text-muted-foreground" />
            </div>

            <p className="mt-2 text-xl font-semibold">
              {order.weight.toLocaleString("en-IN")} kg
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Total shipment weight
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Expected delivery
              </p>

              <IconTruck className="size-4 text-muted-foreground" />
            </div>

            <p className="mt-2 text-xl font-semibold">
              {formatDate(
                order.expectedDelivery
              )}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Estimated delivery date
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Main Grid                                                          */}
      {/* ------------------------------------------------------------------ */}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ================================================================= */}
        {/* LEFT                                                              */}
        {/* ================================================================= */}

        <div className="space-y-6 lg:col-span-2">
          {/* ---------------------------------------------------------------- */}
          {/* Shipment Details                                                 */}
          {/* ---------------------------------------------------------------- */}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <IconTruck className="size-4" />
                Shipment Details
              </CardTitle>

              <CardDescription>
                Pickup, delivery and package information
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Route */}

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border bg-muted/30 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-md border bg-background">
                      <IconMapPin className="size-4" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">
                        Pickup location
                      </p>

                      <p className="mt-1 font-medium">
                        {order.pickup}
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        Shipment origin
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border bg-muted/30 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-md border bg-background">
                      <IconMapPin className="size-4" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">
                        Delivery location
                      </p>

                      <p className="mt-1 font-medium">
                        {order.delivery}
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        Shipment destination
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Package */}

              <div>
                <h3 className="mb-4 text-sm font-medium">
                  Package information
                </h3>

                <div className="grid gap-5 sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Package type
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      {order.packageType}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Quantity
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      {order.quantity}{" "}
                      {order.quantity === 1
                        ? "package"
                        : "packages"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Weight
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      {order.weight.toLocaleString(
                        "en-IN"
                      )}{" "}
                      kg
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Expected Delivery */}

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Expected delivery date
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {formatDate(
                      order.expectedDelivery
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Order number
                  </p>

                  <p className="mt-1 text-sm font-medium tabular-nums">
                    {order.id}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ---------------------------------------------------------------- */}
          {/* Customer Details                                                 */}
          {/* ---------------------------------------------------------------- */}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <IconUser className="size-4" />
                Customer Details
              </CardTitle>

              <CardDescription>
                Customer contact and delivery address
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="flex items-center gap-4">
                <Avatar className="size-12">
                  <AvatarFallback>
                    {customerInitials}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                  <p className="font-medium">
                    {order.customer}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    Customer
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <a
                  href={`tel:${order.phone}`}
                  className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/40"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
                    <IconPhone className="size-4" />
                  </span>

                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">
                      Phone
                    </p>

                    <p className="truncate text-sm font-medium">
                      {order.phone}
                    </p>
                  </div>
                </a>

                <a
                  href={`mailto:${order.email}`}
                  className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/40"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
                    <IconMail className="size-4" />
                  </span>

                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">
                      Email
                    </p>

                    <p className="truncate text-sm font-medium">
                      {order.email}
                    </p>
                  </div>
                </a>
              </div>

              <div className="flex items-start gap-3 rounded-lg border p-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
                  <IconMapPin className="size-4" />
                </span>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Address
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {order.address}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ---------------------------------------------------------------- */}
          {/* Driver Details                                                   */}
          {/* ---------------------------------------------------------------- */}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <IconTruck className="size-4" />
                Driver Details
              </CardTitle>

              <CardDescription>
                Assigned driver and vehicle
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="flex items-center gap-4">
                <Avatar className="size-12">
                  <AvatarFallback>
                    {driverInitials}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <p className="font-medium">
                    {order.driver}
                  </p>

                  <a
                    href={`tel:${order.driverPhone}`}
                    className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <IconPhone className="size-3.5" />
                    {order.driverPhone}
                  </a>
                </div>

                <Badge variant="outline">
                  Assigned
                </Badge>
              </div>

              <Separator />

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Vehicle
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {order.vehicle}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Vehicle number
                  </p>

                  <p className="mt-1 text-sm font-medium tabular-nums">
                    {order.vehicleNumber}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ================================================================= */}
        {/* RIGHT                                                             */}
        {/* ================================================================= */}

        <div className="space-y-6">
          {/* ---------------------------------------------------------------- */}
          {/* Status Timeline                                                  */}
          {/* ---------------------------------------------------------------- */}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Status Timeline
              </CardTitle>

              <CardDescription>
                Shipment progress
              </CardDescription>
            </CardHeader>

            <CardContent>
              <ol>
                {timeline.map((step, index) => {
                  const isDone =
                    index < currentStage;

                  const isCurrent =
                    index === currentStage;

                  const StepIcon =
                    isDone
                      ? IconCheck
                      : step.icon;

                  return (
                    <li
                      key={step.label}
                      className="relative flex gap-4 pb-7 last:pb-0"
                    >
                      {index <
                        timeline.length - 1 && (
                        <span
                          className={cn(
                            "absolute left-[15px] top-8 bottom-0 w-px",
                            index < currentStage
                              ? "bg-emerald-500/40"
                              : "bg-border"
                          )}
                        />
                      )}

                      <div
                        className={cn(
                          "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border",
                          isDone
                            ? "border-transparent bg-emerald-500 text-white"
                            : isCurrent
                              ? "border-primary bg-background text-primary"
                              : "border-border bg-muted text-muted-foreground"
                        )}
                      >
                        <StepIcon className="size-4" />
                      </div>

                      <div className="flex min-w-0 flex-1 items-start justify-between gap-3 pt-1">
                        <div className="min-w-0">
                          <p
                            className={cn(
                              "text-sm font-medium",
                              !isDone &&
                                !isCurrent &&
                                "text-muted-foreground"
                            )}
                          >
                            {step.label}
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {step.description}
                          </p>
                        </div>

                        <div className="shrink-0 text-right">
                          {isDone || isCurrent ? (
                            <p className="text-xs text-muted-foreground">
                              {formatShortDate(
                                timelineDates[
                                  index
                                ]
                              )}
                            </p>
                          ) : (
                            <p className="flex items-center gap-1 text-xs text-muted-foreground">
                              <IconClock className="size-3" />
                              Pending
                            </p>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </CardContent>
          </Card>

          {/* ---------------------------------------------------------------- */}
          {/* Current Status                                                    */}
          {/* ---------------------------------------------------------------- */}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Current Status
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-full",
                    order.status === "Delivered"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : order.status === "In Transit"
                        ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                        : order.status === "Picked Up"
                          ? "bg-violet-500/10 text-violet-600 dark:text-violet-400"
                          : order.status === "Assigned"
                            ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  )}
                >
                  {order.status ===
                  "Delivered" ? (
                    <IconCheck className="size-5" />
                  ) : order.status ===
                    "In Transit" ? (
                    <IconTruck className="size-5" />
                  ) : (
                    <IconClock className="size-5" />
                  )}
                </div>

                <div>
                  <p className="font-medium">
                    {order.status}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {order.status ===
                    "Delivered"
                      ? "Shipment has been delivered successfully."
                      : order.status ===
                          "In Transit"
                        ? "Shipment is currently in transit."
                        : order.status ===
                            "Picked Up"
                          ? "Shipment has been picked up by the driver."
                          : order.status ===
                              "Assigned"
                            ? "Driver has been assigned to this shipment."
                            : "Order is waiting for the next shipment step."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ---------------------------------------------------------------- */}
          {/* Route                                                            */}
          {/* ---------------------------------------------------------------- */}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Route
              </CardTitle>

              <CardDescription>
                Shipment journey
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-0">
                {/* Pickup */}

                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="flex size-8 items-center justify-center rounded-full border bg-background">
                      <span className="size-2 rounded-full bg-primary" />
                    </div>

                    <div className="h-12 border-l border-dashed" />
                  </div>

                  <div className="pt-1">
                    <p className="text-xs text-muted-foreground">
                      Pickup
                    </p>

                    <p className="text-sm font-medium">
                      {order.pickup}
                    </p>
                  </div>
                </div>

                {/* Delivery */}

                <div className="flex gap-3">
                  <div className="flex size-8 items-center justify-center rounded-full border bg-background">
                    <IconMapPin className="size-3.5 text-muted-foreground" />
                  </div>

                  <div className="pt-1">
                    <p className="text-xs text-muted-foreground">
                      Delivery
                    </p>

                    <p className="text-sm font-medium">
                      {order.delivery}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}