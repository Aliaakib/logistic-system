"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  IconArrowLeft,
  IconDeviceFloppy,
} from "@tabler/icons-react";

import { PageHeader } from "@/components/page-header";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type DriverStatus =
  | "Available"
  | "Assigned"
  | "On Delivery"
  | "Offline";

type VehicleType =
  | "Van"
  | "Truck"
  | "Pickup Truck"
  | "Mini Truck"
  | "Trailer";

type DriverFormData = {
  name: string;
  phone: string;
  email: string;
  vehicleType: VehicleType;
  vehicleNumber: string;
  licenseNumber: string;
  status: DriverStatus;
};

const defaultDriver: DriverFormData = {
  name: "John Smith",
  phone: "+1 415 555 0142",
  email: "john.smith@logistics.com",
  vehicleType: "Van",
  vehicleNumber: "VAN-1024",
  licenseNumber: "DL-458921",
  status: "Available",
};

export default function NewDriverPage() {
  const router = useRouter();

  const [saving, setSaving] =
    useState(false);

  const [formData, setFormData] =
    useState<DriverFormData>({
      name: "",
      phone: "",
      email: "",
      vehicleType: "Van",
      vehicleNumber: "",
      licenseNumber: "",
      status: "Available",
    });

  function updateField<
    K extends keyof DriverFormData
  >(
    field: K,
    value: DriverFormData[K]
  ) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.email.trim() ||
      !formData.vehicleNumber.trim() ||
      !formData.licenseNumber.trim()
    ) {
      toast.error(
        "Please fill in all driver details."
      );

      return;
    }

    setSaving(true);

    const existingDrivers = JSON.parse(
      localStorage.getItem(
        "logistics-drivers"
      ) || "[]"
    );

    const newDriver = {
      id: `DRV-${String(
        existingDrivers.length + 1
      ).padStart(3, "0")}`,

      name: formData.name.trim(),

      phone: formData.phone.trim(),

      email: formData.email.trim(),

      vehicleType:
        formData.vehicleType,

      vehicleNumber:
        formData.vehicleNumber.trim(),

      licenseNumber:
        formData.licenseNumber.trim(),

      status: formData.status,

      assignedOrders: 0,
    };

    localStorage.setItem(
      "logistics-drivers",
      JSON.stringify([
        ...existingDrivers,
        newDriver,
      ])
    );

    toast.success("Driver created", {
      description: `${newDriver.name} has been added to the driver list.`,
    });

    router.push("/drivers");
  }

  function handleDemoDriver() {
    setFormData(defaultDriver);

    toast.success(
      "Demo driver loaded",
      {
        description:
          "John Smith — Delivery Driver — Van — Available",
      }
    );
  }

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link
        href="/drivers"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <IconArrowLeft className="size-4" />

        Back to drivers
      </Link>

      <form
        id="driver-form"
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Header */}
        <PageHeader
          title="Add Driver"
          description="Create a new driver record and assign vehicle details."
        >
          <Button
            type="button"
            variant="outline"
            onClick={handleDemoDriver}
          >
            Load Demo Driver
          </Button>

          <Button
            type="button"
            variant="outline"
            asChild
          >
            <Link href="/drivers">
              Cancel
            </Link>
          </Button>

          <Button
            type="submit"
            disabled={saving}
          >
            <IconDeviceFloppy className="size-4" />

            {saving
              ? "Saving..."
              : "Save Driver"}
          </Button>
        </PageHeader>

        {/* Driver Information */}
        <Card>
          <CardHeader>
            <CardTitle>
              Driver Information
            </CardTitle>

            <CardDescription>
              Enter the driver's personal and contact information.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Driver Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Driver Name
                </Label>

                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={(event) =>
                    updateField(
                      "name",
                      event.target.value
                    )
                  }
                  placeholder="John Smith"
                  required
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">
                  Phone
                </Label>

                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(event) =>
                    updateField(
                      "phone",
                      event.target.value
                    )
                  }
                  placeholder="+1 415 555 0142"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="email">
                  Email
                </Label>

                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(event) =>
                    updateField(
                      "email",
                      event.target.value
                    )
                  }
                  placeholder="john.smith@logistics.com"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Information */}
        <Card>
          <CardHeader>
            <CardTitle>
              Vehicle Information
            </CardTitle>

            <CardDescription>
              Add the vehicle assigned to this driver.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Vehicle Type */}
              <div className="space-y-2">
                <Label htmlFor="vehicleType">
                  Vehicle Type
                </Label>

                <Select
                  value={
                    formData.vehicleType
                  }
                  onValueChange={(value) =>
                    updateField(
                      "vehicleType",
                      value as VehicleType
                    )
                  }
                >
                  <SelectTrigger
                    id="vehicleType"
                    className="w-full"
                  >
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="Van">
                      Van
                    </SelectItem>

                    <SelectItem value="Truck">
                      Truck
                    </SelectItem>

                    <SelectItem value="Pickup Truck">
                      Pickup Truck
                    </SelectItem>

                    <SelectItem value="Mini Truck">
                      Mini Truck
                    </SelectItem>

                    <SelectItem value="Trailer">
                      Trailer
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Vehicle Number */}
              <div className="space-y-2">
                <Label htmlFor="vehicleNumber">
                  Vehicle Number
                </Label>

                <Input
                  id="vehicleNumber"
                  name="vehicleNumber"
                  value={
                    formData.vehicleNumber
                  }
                  onChange={(event) =>
                    updateField(
                      "vehicleNumber",
                      event.target.value
                    )
                  }
                  placeholder="VAN-1024"
                  required
                />
              </div>

              {/* License Number */}
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="licenseNumber">
                  License Number
                </Label>

                <Input
                  id="licenseNumber"
                  name="licenseNumber"
                  value={
                    formData.licenseNumber
                  }
                  onChange={(event) =>
                    updateField(
                      "licenseNumber",
                      event.target.value
                    )
                  }
                  placeholder="DL-458921"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Driver Status */}
        <Card>
          <CardHeader>
            <CardTitle>
              Driver Status
            </CardTitle>

            <CardDescription>
              Set the driver's current availability status.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="max-w-md space-y-2">
              <Label htmlFor="status">
                Current Status
              </Label>

              <Select
                value={formData.status}
                onValueChange={(value) =>
                  updateField(
                    "status",
                    value as DriverStatus
                  )
                }
              >
                <SelectTrigger
                  id="status"
                  className="w-full"
                >
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>

                <SelectContent>
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
          </CardContent>
        </Card>

        {/* Bottom Actions */}
        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            asChild
          >
            <Link href="/drivers">
              Cancel
            </Link>
          </Button>

          <Button
            type="submit"
            disabled={saving}
          >
            <IconDeviceFloppy className="size-4" />

            {saving
              ? "Saving..."
              : "Save Driver"}
          </Button>
        </div>
      </form>
    </div>
  );
}