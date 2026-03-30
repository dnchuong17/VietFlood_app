"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { apiRequest } from "@/features/auth/lib/api-client";
import { getAccessToken } from "@/features/auth/lib/auth-storage";

const DEFAULT_API_BASE_URL = "http://localhost:8081";
const API_BASE_URL =
    process.env.NEXT_PUBLIC_AUTH_API_BASE_URL ?? DEFAULT_API_BASE_URL;

type UserReport = {
    id?: number;
    userId?: number;
    user?: {
        username?: string;
    };
    category?: string[];
    description?: string;
    province?: string;
    ward?: string;
    addressLine?: string;
    status?: string;
    isUrgent?: boolean;
    severity?: number;
    createdAt?: string;
};

type ReportCollectionResponse = {
    data?: unknown;
    reports?: unknown;
    items?: unknown;
};

type AccessTokenPayload = {
    sub?: number;
    username?: string;
};

function extractErrorMessage(data: unknown, fallbackMessage: string): string {
    if (typeof data === "object" && data !== null && "message" in data) {
        const message = (data as { message?: unknown }).message;

        if (Array.isArray(message)) {
            const first = message.find(
                (item) => typeof item === "string" && item.trim().length > 0,
            );

            if (typeof first === "string") {
                return first;
            }
        }

        if (typeof message === "string" && message.trim().length > 0) {
            return message;
        }
    }

    if (typeof data === "object" && data !== null && "error" in data) {
        const error = (data as { error?: unknown }).error;

        if (typeof error === "string" && error.trim().length > 0) {
            return error;
        }
    }

    return fallbackMessage;
}

function formatDateTime(value?: string): string {
    if (!value) {
        return "Chưa cập nhật";
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

function formatReportCategory(category?: string[]): string {
    if (!Array.isArray(category) || category.length === 0) {
        return "Chưa phân loại";
    }

    const categoryMap: Record<string, string> = {
        flood: "Ngập lụt",
        incident: "Sự cố",
        infrastructure: "Hạ tầng",
        rescue: "Cứu hộ",
    };

    return category
        .map((item) => categoryMap[item] ?? item)
        .filter(Boolean)
        .join(" • ");
}

function formatReportStatus(status?: string): string {
    const normalized = status?.trim().toLowerCase();

    if (normalized === "pending") {
        return "Đang chờ";
    }
    if (normalized === "verified") {
        return "Đã xác minh";
    }
    if (normalized === "resolved") {
        return "Đã xử lý";
    }
    if (normalized === "rejected") {
        return "Đã từ chối";
    }

    return status?.trim() || "Không rõ";
}

function getReportStatusBadge(status?: string): string {
    const normalized = status?.trim().toLowerCase();

    if (normalized === "verified") {
        return "border-sky-200 bg-sky-50 text-sky-700";
    }
    if (normalized === "resolved") {
        return "border-emerald-200 bg-emerald-50 text-emerald-700";
    }
    if (normalized === "rejected") {
        return "border-rose-200 bg-rose-50 text-rose-700";
    }

    return "border-amber-200 bg-amber-50 text-amber-700";
}

function decodeAccessTokenPayload(token: string): AccessTokenPayload | null {
    const parts = token.split(".");

    if (parts.length < 2) {
        return null;
    }

    try {
        const normalizedBase64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const paddedBase64 = normalizedBase64.padEnd(
            Math.ceil(normalizedBase64.length / 4) * 4,
            "=",
        );
        const decoded = atob(paddedBase64);
        return JSON.parse(decoded) as AccessTokenPayload;
    } catch {
        return null;
    }
}

function normalizeReportsPayload(payload: unknown): UserReport[] {
    if (Array.isArray(payload)) {
        return payload as UserReport[];
    }

    if (typeof payload === "object" && payload !== null) {
        const collection = payload as ReportCollectionResponse;

        if (Array.isArray(collection.data)) {
            return collection.data as UserReport[];
        }

        if (Array.isArray(collection.reports)) {
            return collection.reports as UserReport[];
        }

        if (Array.isArray(collection.items)) {
            return collection.items as UserReport[];
        }
    }

    return [];
}

export function ReportHistoryView() {
    const [reportHistory, setReportHistory] = useState<UserReport[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const stats = useMemo(
        () => ({
            total: reportHistory.length,
            pending: reportHistory.filter(
                (item) => item.status?.toLowerCase() === "pending",
            ).length,
            resolved: reportHistory.filter(
                (item) => item.status?.toLowerCase() === "resolved",
            ).length,
        }),
        [reportHistory],
    );

    const loadReportHistory = useCallback(async () => {
        const accessToken = getAccessToken();
        if (!accessToken) {
            setReportHistory([]);
            setErrorMessage("Bạn chưa đăng nhập. Vui lòng đăng nhập để xem lịch sử báo cáo.");
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setErrorMessage(null);

            const userReportsResponse = await apiRequest(`${API_BASE_URL}/reports/user`, {
                method: "GET",
                credentials: "include",
                cache: "no-store",
            });
            const historyData: unknown = await userReportsResponse.json().catch(() => null);

            if (!userReportsResponse.ok) {
                if (userReportsResponse.status >= 500) {
                    setReportHistory([]);
                    setErrorMessage("Dịch vụ lịch sử báo cáo đang tạm gián đoạn. Vui lòng thử lại sau.");
                    return;
                }

                throw new Error(
                    extractErrorMessage(historyData, "Không thể tải lịch sử báo cáo."),
                );
            }

            let allReports = normalizeReportsPayload(historyData);

            const currentUser = decodeAccessTokenPayload(accessToken);
            const shouldFallbackToAllReports =
                allReports.length === 0 &&
                typeof currentUser?.username === "string" &&
                currentUser.username.trim().length > 0;

            if (shouldFallbackToAllReports) {
                const allReportsResponse = await apiRequest(`${API_BASE_URL}/reports`, {
                    method: "GET",
                    credentials: "include",
                    cache: "no-store",
                });

                if (allReportsResponse.ok) {
                    const allReportsPayload: unknown =
                        await allReportsResponse.json().catch(() => null);
                    const fallbackReports = normalizeReportsPayload(allReportsPayload);
                    const normalizedUsername = currentUser?.username?.trim().toLowerCase();

                    allReports = fallbackReports.filter((report) => {
                        const reportUsername = report.user?.username?.trim().toLowerCase();

                        if (
                            normalizedUsername &&
                            reportUsername &&
                            normalizedUsername === reportUsername
                        ) {
                            return true;
                        }

                        if (
                            typeof currentUser?.sub === "number" &&
                            typeof report.userId === "number" &&
                            currentUser.sub === report.userId
                        ) {
                            return true;
                        }

                        return false;
                    });
                }
            }

            const ownReports = allReports.sort((first, second) => {
                const firstTime = first.createdAt ? new Date(first.createdAt).getTime() : 0;
                const secondTime = second.createdAt ? new Date(second.createdAt).getTime() : 0;
                return secondTime - firstTime;
            });

            setReportHistory(ownReports);
        } catch (error) {
            setReportHistory([]);
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Không thể tải lịch sử báo cáo.",
            );
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadReportHistory();
    }, [loadReportHistory]);

    return (
        <section className="relative h-full overflow-y-auto bg-[radial-gradient(circle_at_top,rgba(14,116,144,0.18),transparent_48%),radial-gradient(circle_at_bottom_right,rgba(15,118,110,0.16),transparent_45%),linear-gradient(180deg,#f8fdff_0%,#f6f7ff_100%)] px-4 pb-24 pt-[calc(var(--navbar-height)+1.1rem)]">
            <div className="mx-auto w-full max-w-xl space-y-4">
                <div className="rounded-3xl border border-sky-100/90 bg-white/90 p-4 shadow-[0_24px_48px_-32px_rgba(8,47,73,0.45)] backdrop-blur-sm">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <h1 className="text-[1.2rem] font-extrabold leading-tight text-slate-900">
                                Lịch sử báo cáo
                            </h1>
                            <p className="mt-1 text-sm text-slate-600">
                                Theo dõi các báo cáo bạn đã gửi và trạng thái xử lý mới nhất.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => void loadReportHistory()}
                            className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                            disabled={isLoading}
                        >
                            {isLoading ? "Đang tải..." : "Làm mới"}
                        </button>
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-2">
                        <article className="rounded-xl border border-sky-100 bg-sky-50/70 px-3 py-2">
                            <p className="text-[0.68rem] font-semibold uppercase tracking-wide text-sky-700">Tổng số</p>
                            <p className="mt-1 text-lg font-bold text-sky-900">{stats.total}</p>
                        </article>
                        <article className="rounded-xl border border-amber-100 bg-amber-50/70 px-3 py-2">
                            <p className="text-[0.68rem] font-semibold uppercase tracking-wide text-amber-700">Đang chờ</p>
                            <p className="mt-1 text-lg font-bold text-amber-900">{stats.pending}</p>
                        </article>
                        <article className="rounded-xl border border-emerald-100 bg-emerald-50/70 px-3 py-2">
                            <p className="text-[0.68rem] font-semibold uppercase tracking-wide text-emerald-700">Đã xử lý</p>
                            <p className="mt-1 text-lg font-bold text-emerald-900">{stats.resolved}</p>
                        </article>
                    </div>
                </div>

                {errorMessage ? (
                    <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
                        {errorMessage}
                    </div>
                ) : null}

                {!errorMessage && isLoading ? (
                    <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-600">
                        Đang tải lịch sử báo cáo...
                    </div>
                ) : null}

                {!errorMessage && !isLoading && reportHistory.length === 0 ? (
                    <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-600">
                        Bạn chưa có báo cáo nào.
                    </div>
                ) : null}

                {!errorMessage && !isLoading && reportHistory.length > 0 ? (
                    <div className="space-y-2">
                        {reportHistory.map((report) => (
                            <article
                                key={report.id ?? `${report.createdAt ?? "report"}-${report.description ?? ""}`}
                                className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
                            >
                                <div className="flex flex-wrap items-center gap-2">
                                    <span
                                        className={`rounded-full border px-2 py-0.5 text-[0.68rem] font-semibold ${getReportStatusBadge(report.status)}`}
                                    >
                                        {formatReportStatus(report.status)}
                                    </span>
                                    {report.isUrgent ? (
                                        <span className="rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[0.68rem] font-semibold text-rose-700">
                                            Khẩn cấp
                                        </span>
                                    ) : null}
                                </div>

                                <p className="mt-2 text-sm font-semibold text-slate-900">
                                    {formatReportCategory(report.category)}
                                </p>
                                <p className="mt-1 text-sm text-slate-700">
                                    {report.description?.trim() || "Chưa có mô tả."}
                                </p>
                                <p className="mt-1 text-xs text-slate-600">
                                    {[report.addressLine, report.ward, report.province]
                                        .filter(Boolean)
                                        .join(", ") || "Chưa có địa chỉ"}
                                </p>
                                <p className="mt-1 text-xs font-medium text-slate-500">
                                    {formatDateTime(report.createdAt)}
                                </p>
                            </article>
                        ))}
                    </div>
                ) : null}
            </div>
        </section>
    );
}
