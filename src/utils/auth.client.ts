"use client";

import { signIn } from "next-auth/react";

export async function authenticate(username: string, password: string) {
  const res = await signIn("credentials", {
    username,
    password,
    redirect: false,
  });

  if (!res || res.error) {
    return {
      ok: false,
      error: res?.error ?? "Login failed",
      code: res?.error ? 1 : 0,
    };
  }

  return { ok: true };
}