import Link from "next/link";
import {
  IconBrandGoogle,
  IconBrandGithub,
  IconArrowRight,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export const metadata = {
  title: "Sign in | OrbynAdmin",
  description: "Sign in to your logistics ERP dashboard.",
};

export default function LoginPage() {
  return (
    <div className="space-y-6">
      {/* ==============================
          HEADER
      ============================== */}
      <div className="space-y-2">
        <div className="mb-5 inline-flex rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
          Logistics ERP
        </div>

        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome back
        </h1>

        <p className="text-sm leading-6 text-muted-foreground">
          Sign in to manage your fleet, shipments and deliveries.
        </p>
      </div>

      {/* ==============================
          SOCIAL LOGIN
      ============================== */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          className="h-10 w-full font-medium"
          type="button"
        >
          <IconBrandGoogle className="size-4" />
          Google
        </Button>

        <Button
          variant="outline"
          className="h-10 w-full font-medium"
          type="button"
        >
          <IconBrandGithub className="size-4" />
          GitHub
        </Button>
      </div>

      {/* ==============================
          DIVIDER
      ============================== */}
      <div className="relative text-center text-xs text-muted-foreground">
        <span className="relative z-10 bg-background px-2">
          or continue with email
        </span>

        <span className="absolute inset-y-1/2 left-0 h-px w-full bg-border" />
      </div>

      {/* ==============================
          LOGIN FORM
      ============================== */}
      <form className="space-y-5">
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">
            Email address
          </Label>

          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            defaultValue="alex@company.com"
            className="h-10"
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">
              Password
            </Label>

            <Link
              href="/forgot-password"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Forgot password?
            </Link>
          </div>

          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            defaultValue="password"
            className="h-10"
          />
        </div>

        {/* Remember */}
        <div className="flex items-center gap-2">
          <Checkbox
            id="remember"
            name="remember"
            defaultChecked
          />

          <Label
            htmlFor="remember"
            className="cursor-pointer text-sm font-normal text-muted-foreground"
          >
            Remember me for 30 days
          </Label>
        </div>

        {/* Submit */}
        <Button
          asChild
          className="h-10 w-full font-medium"
        >
          <Link href="/dashboard">
            Sign in
            <IconArrowRight className="size-4" />
          </Link>
        </Button>
      </form>

      {/* ==============================
          REGISTER
      ============================== */}
      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-foreground hover:underline"
        >
          Create account
        </Link>
      </p>

      {/* ==============================
          SECURITY NOTE
      ============================== */}
      <p className="text-center text-[11px] leading-5 text-muted-foreground/70">
        Your logistics data is securely protected.
      </p>
    </div>
  );
}