"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { Input, Label, FieldError } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
});

type FormValues = z.infer<typeof schema>;

const dashboardHref: Record<string, string> = {
  CUSTOMER: "/dashboard/customer",
  PROVIDER: "/dashboard/provider",
  ADMIN: "/dashboard/admin",
};

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const user = await login(values.email, values.password);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}`);
      const next = params.get("next");
      router.push(next || dashboardHref[user.role] || "/");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Login failed. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 py-16">
      <p className="tag-label text-rust mb-2">Welcome back</p>
      <h1 className="font-display text-3xl text-forest mb-8">Log in</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Label>Email</Label>
          <Input type="email" {...register("email")} placeholder="you@example.com" />
          <FieldError>{errors.email?.message}</FieldError>
        </div>
        <div>
          <Label>Password</Label>
          <Input type="password" {...register("password")} placeholder="••••••••" />
          <FieldError>{errors.password?.message}</FieldError>
        </div>
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Logging in…" : "Log in"}
        </Button>
      </form>

      <p className="text-sm text-ink-soft mt-6 text-center">
        Need an account?{" "}
        <Link href="/auth/register" className="text-rust font-medium">
          Create one
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
