import { apiRequest } from "@/features/auth/lib/api-client";

import type { ReliefReport, ReliefUser } from "./types";

const DEFAULT_AUTH_API_BASE_URL = "https://vietflood-app.azurewebsites.net";

const AUTH_API_BASE_URL =
  process.env.NEXT_PUBLIC_AUTH_API_BASE_URL ?? DEFAULT_AUTH_API_BASE_URL;

function extractErrorMessage(data: unknown, fallbackMessage: string): string {
  if (typeof data === "object" && data !== null && "message" in data) {
    const message = (data as { message?: unknown }).message;

    if (Array.isArray(message)) {
      const firstMessage = message.find(
        (item) => typeof item === "string" && item.trim().length > 0,
      );

      if (typeof firstMessage === "string") {
        return firstMessage;
      }
    }

    if (typeof message === "string" && message.trim().length > 0) {
      return message;
    }
  }

  return fallbackMessage;
}

function normalizeCollection<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (typeof payload === "object" && payload !== null) {
    const collection = payload as {
      data?: unknown;
      items?: unknown;
      reports?: unknown;
      users?: unknown;
      result?: unknown;
    };
    for (const source of [
      collection.data,
      collection.items,
      collection.reports,
      collection.users,
      collection.result,
    ]) {
      if (Array.isArray(source)) {
        return source as T[];
      }
    }
  }

  return [];
}

export async function fetchReliefUsers(): Promise<ReliefUser[]> {
  const response = await apiRequest(`${AUTH_API_BASE_URL}/auth/relief/users`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      extractErrorMessage(data, "Không thể tải danh sách người dùng."),
    );
  }

  return normalizeCollection<ReliefUser>(data);
}

export async function fetchReliefReports(): Promise<ReliefReport[]> {
  const response = await apiRequest(`${AUTH_API_BASE_URL}/reports/relief`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      extractErrorMessage(data, "Không thể tải danh sách báo cáo."),
    );
  }

  return normalizeCollection<ReliefReport>(data);
}

export async function fetchReportsByUserId(
  userId: number,
): Promise<ReliefReport[]> {
  const response = await apiRequest(`${AUTH_API_BASE_URL}/reports/${userId}`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      extractErrorMessage(data, `Không thể tải báo cáo của người dùng.`),
    );
  }

  return normalizeCollection<ReliefReport>(data);
}
