import Link from "next/link";
import { IconTruckDelivery } from "@tabler/icons-react";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* ==============================
          LEFT — LOGIN AREA
      ============================== */}
      <div className="flex flex-col gap-4 bg-background p-6 md:p-10">
        {/* Logo */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold tracking-tight"
        >
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <IconTruckDelivery className="size-5" stroke={2} />
          </div>

          <span>OrbynAdmin</span>
        </Link>

        {/* Login Content */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            {children}
          </div>
        </div>
      </div>

      {/* ==============================
          RIGHT — LOGISTICS IMAGE
      ============================== */}
      <div className="relative hidden overflow-hidden bg-zinc-950 lg:block">
        {/* Truck Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1695222833131-54ee679ae8e5?q=80&w=1141&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          }}
        />

        {/* Dark overlay for professional ERP look */}
        <div className="absolute inset-0 bg-black/45" />

        {/* Bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

        {/* Subtle blue logistics glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/30 via-transparent to-transparent" />

        {/* Grid */}
        <div
          className="
            absolute inset-0
            opacity-[0.12]
            [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)]
            [background-size:44px_44px]
          "
        />

        {/* ==============================
            CONTENT OVER IMAGE
        ============================== */}
        <div className="relative flex h-full flex-col justify-between p-10 xl:p-12 text-white">
          {/* Top */}
          <div className="flex items-center justify-between">
            <div className="rounded-full border border-white/20 bg-black/20 px-3 py-1.5 text-xs font-medium backdrop-blur-md">
              LOGISTICS ERP
            </div>

            <div className="flex items-center gap-2 text-xs text-white/70">
              <span className="size-2 rounded-full bg-emerald-400" />
              Fleet operations online
            </div>
          </div>

          {/* Main Quote */}
          <div className="max-w-xl space-y-6">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                Move smarter. Deliver faster.
              </p>

              <h2 className="text-3xl font-semibold leading-tight tracking-tight xl:text-4xl">
                One system to manage your entire logistics operation.
              </h2>

              <p className="max-w-lg text-sm leading-6 text-white/70">
                Manage vehicles, drivers, shipments, routes and deliveries
                from one powerful logistics ERP platform.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-2">
              <div className="rounded-md border border-white/15 bg-white/10 px-3 py-2 text-xs backdrop-blur-md">
                Fleet Management
              </div>

              <div className="rounded-md border border-white/15 bg-white/10 px-3 py-2 text-xs backdrop-blur-md">
                Live Tracking
              </div>

              <div className="rounded-md border border-white/15 bg-white/10 px-3 py-2 text-xs backdrop-blur-md">
                Shipments
              </div>
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="grid max-w-xl grid-cols-3 border-t border-white/15 pt-6">
            <div>
              <div className="text-xl font-semibold tracking-tight">
                1,240+
              </div>
              <div className="mt-1 text-xs text-white/55">
                Active Vehicles
              </div>
            </div>

            <div className="border-l border-white/10 pl-6">
              <div className="text-xl font-semibold tracking-tight">
                8.6k+
              </div>
              <div className="mt-1 text-xs text-white/55">
                Deliveries
              </div>
            </div>

            <div className="border-l border-white/10 pl-6">
              <div className="text-xl font-semibold tracking-tight">
                99.2%
              </div>
              <div className="mt-1 text-xs text-white/55">
                On-time Rate
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}