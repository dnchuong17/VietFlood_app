"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useGlobalAlert } from "@/components/feedback/global-alert-provider";
import { clearAuthTokens, getAuthIdentity } from "@/features/auth/lib/auth-storage";

import { fetchReliefReports, fetchReliefUsers, fetchReportsByUserId } from "../api";
import type { ReliefReport, ReliefUser } from "../types";

const ReliefRouteMap = dynamic(() => import("./relief-route-map"), {
    ssr: false,
    loading: () => (
        <div className="grid h-[440px] place-items-center rounded-[1.75rem] border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-500">
            Đang tải bản đồ OpenStreetMap...
        </div>
    ),
});

function formatFullName(user: ReliefUser): string {
    const parts = [user.first_name, user.middle_name ?? "", user.last_name]
        .map((part) => (typeof part === "string" ? part.trim() : ""))
        .filter(Boolean);

    return parts.length > 0 ? parts.join(" ") : user.username?.trim() || "Người dùng";
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

function formatStatus(status?: string): string {
    const normalized = status?.trim().toLowerCase();

    if (normalized === "pending") return "Đang chờ";
    if (normalized === "verified") return "Đã xác minh";
    if (normalized === "resolved") return "Đã xử lý";
    if (normalized === "rejected") return "Đã từ chối";

    return status?.trim() || "Không rõ";
}

function statusClass(status?: string): string {
    const normalized = status?.trim().toLowerCase();

    if (normalized === "resolved") return "border-emerald-200 bg-emerald-50 text-emerald-700";
    if (normalized === "verified") return "border-sky-200 bg-sky-50 text-sky-700";
    if (normalized === "rejected") return "border-rose-200 bg-rose-50 text-rose-700";

    return "border-amber-200 bg-amber-50 text-amber-700";
}

function toNumericCoordinate(value: number | string | null | undefined): number | null {
    if (value === null || value === undefined) return null;
    const numericValue = typeof value === "string" ? Number(value) : value;
    return Number.isFinite(numericValue) ? numericValue : null;
}

function reportLocation(report: ReliefReport): string {
    const parts = [report.addressLine, report.ward, report.province]
        .map((part) => (typeof part === "string" ? part.trim() : ""))
        .filter(Boolean);

    return parts.length > 0 ? parts.join(", ") : "Chưa có địa chỉ báo cáo";
}

function reportCoordinates(report: ReliefReport): string {
    const lat = toNumericCoordinate(report.lat);
    const lng = toNumericCoordinate(report.lng);

    if (lat === null || lng === null) {
        return "Chưa có tọa độ";
    }

    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
}

function StatCard({ label, value, hint }: { label: string; value: string; hint: string }) {
    return (
        <article className="rounded-3xl border border-white/60 bg-white p-4 shadow-[0_12px_34px_rgba(15,23,42,0.08)]">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-black text-slate-900">{value}</p>
            <p className="mt-2 text-sm text-slate-600">{hint}</p>
        </article>
    );
}

function EmptyState({ title, description }: { title: string; description: string }) {
    return (
        <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-slate-600">
            <p className="text-lg font-semibold text-slate-900">{title}</p>
            <p className="mt-2 text-sm leading-6">{description}</p>
        </div>
    );
}

export function ManagementDashboard() {
    const router = useRouter();
    const { showAlert } = useGlobalAlert();
    const identity = getAuthIdentity();

    const [users, setUsers] = useState<ReliefUser[]>([]);
    const [reports, setReports] = useState<ReliefReport[]>([]);
    const [usersError, setUsersError] = useState<string | null>(null);
    const [reportsError, setReportsError] = useState<string | null>(null);
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);
    const [isLoadingReports, setIsLoadingReports] = useState(true);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (identity?.role?.trim().toLowerCase() !== "relief") {
            clearAuthTokens();
            router.replace("/dang-nhap");
        }
    }, [identity?.role, router]);

    const loadUsers = useCallback(async () => {
        try {
            setIsLoadingUsers(true);
            setUsersError(null);

            const nextUsers = await fetchReliefUsers();
            setUsers(nextUsers);
            setSelectedUserId((currentValue) => currentValue ?? nextUsers[0]?.id ?? null);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Không thể tải danh sách người dùng.";
            setUsersError(message);
            setUsers([]);
            showAlert({ title: "Không tải được danh sách người dùng", description: message, variant: "error" });
        } finally {
            setIsLoadingUsers(false);
        }
    }, [showAlert]);

    const loadReports = useCallback(async (userId: number | null) => {
        if (!userId) {
            setReports([]);
            setSelectedReportId(null);
            return;
        }

        try {
            setIsLoadingReports(true);
            setReportsError(null);

            const nextReports = await fetchReportsByUserId(userId);
            setReports(nextReports);
            setSelectedReportId((currentValue) => currentValue ?? nextReports[0]?.id ?? null);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Không thể tải báo cáo cho người dùng này.";
            setReportsError(message);
            setReports([]);
            showAlert({ title: "Không tải được báo cáo", description: message, variant: "error" });
        } finally {
            setIsLoadingReports(false);
        }
    }, [showAlert]);

    useEffect(() => {
        void loadUsers();
    }, [loadUsers]);

    useEffect(() => {
        void loadReports(selectedUserId);
    }, [selectedUserId, loadReports]);

    const filteredUsers = useMemo(() => {
        const normalized = searchTerm.trim().toLowerCase();
        if (!normalized) {
            return users;
        }

        return users.filter((user) => {
            const fullName = formatFullName(user).toLowerCase();
            const username = (user.username ?? "").toLowerCase();
            const email = (user.email ?? "").toLowerCase();
            const role = (user.role ?? "").toLowerCase();
            const province = (user.province ?? "").toLowerCase();

            return [fullName, username, email, role, province].some((item) => item.includes(normalized));
        });
    }, [searchTerm, users]);

    const selectedUser = useMemo(() => {
        if (filteredUsers.length === 0) {
            return null;
        }

        return filteredUsers.find((user) => user.id === selectedUserId) ?? filteredUsers[0] ?? null;
    }, [filteredUsers, selectedUserId]);

    const selectedUserReports = useMemo(() => {
        return reports;
    }, [reports]);

    const selectedReport = useMemo(() => {
        if (selectedUserReports.length === 0) {
            return null;
        }

        return selectedUserReports.find((report) => report.id === selectedReportId) ?? selectedUserReports[0] ?? null;
    }, [selectedReportId, selectedUserReports]);

    useEffect(() => {
        if (selectedUserReports.length > 0) {
            const hasCurrent = selectedUserReports.some((report) => report.id === selectedReportId);
            if (!hasCurrent) {
                setSelectedReportId(selectedUserReports[0]?.id ?? null);
            }
            return;
        }

        setSelectedReportId(null);
    }, [selectedReportId, selectedUserReports]);

    const metrics = useMemo(() => {
        return {
            users: users.length,
            reports: reports.length,
            pendingReports: reports.filter((report) => report.status?.trim().toLowerCase() === "pending").length,
            urgentReports: reports.filter((report) => report.isUrgent).length,
        };
    }, [reports, users.length]);

    function handleLogout() {
        clearAuthTokens();
        router.replace("/dang-nhap");
        router.refresh();
    }

    return (
        <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
            <section className="overflow-hidden rounded-[2.25rem] border border-white/70 bg-white/90 p-6 text-slate-900 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur">
                <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                    <div className="max-w-3xl">
                        <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-sky-700">
                            Bảng điều phối relief
                        </span>
                        <h1 className="mt-4 [font-family:var(--font-heading)] text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                            Quản lý người dùng, báo cáo và tuyến hỗ trợ trong một màn hình
                        </h1>
                        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                            Chọn một người dùng để xem báo cáo liên quan, rồi mở từng báo cáo để vẽ tuyến từ vị trí hiện tại của đội điều phối đến điểm sự cố.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(15,23,42,0.2)] transition hover:bg-slate-800"
                    >
                        Đăng xuất
                    </button>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard label="Người dùng" value={String(metrics.users)} hint="Tổng số tài khoản trong phạm vi quản lý" />
                    <StatCard label="Báo cáo" value={String(metrics.reports)} hint="Tổng số báo cáo đã được đồng bộ" />
                    <StatCard label="Đang chờ" value={String(metrics.pendingReports)} hint="Báo cáo cần theo dõi hoặc xử lý" />
                    <StatCard label="Khẩn cấp" value={String(metrics.urgentReports)} hint="Báo cáo được gắn ưu tiên xử lý" />
                </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
                <aside className="rounded-[2rem] border border-white/70 bg-white/95 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.1)]">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Người dùng</p>
                            <h2 className="mt-1 text-xl font-black text-slate-950">Danh sách</h2>
                        </div>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{filteredUsers.length}/{users.length}</span>
                    </div>

                    <label className="mt-4 block">
                        <span className="mb-2 block text-sm font-semibold text-slate-700">Tìm người dùng</span>
                        <input
                            type="search"
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            placeholder="Tên, username, email, tỉnh..."
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-transparent focus:ring-2 focus:ring-sky-500/30"
                        />
                    </label>

                    <div className="mt-4 space-y-3">
                        {isLoadingUsers ? <EmptyState title="Đang tải người dùng..." description="Vui lòng chờ trong giây lát." /> : null}
                        {!isLoadingUsers && usersError ? <EmptyState title="Không tải được người dùng" description={usersError} /> : null}
                        {!isLoadingUsers && !usersError && filteredUsers.length === 0 ? (
                            <EmptyState title="Không có kết quả phù hợp" description="Thử đổi từ khóa tìm kiếm." />
                        ) : null}

                        {!isLoadingUsers && !usersError
                            ? filteredUsers.map((user) => {
                                const isActive = user.id === selectedUser?.id;

                                return (
                                    <button
                                        key={user.id ?? user.username}
                                        type="button"
                                        onClick={() => setSelectedUserId(user.id ?? null)}
                                        className={`w-full rounded-2xl border px-4 py-4 text-left transition ${isActive ? "border-sky-300 bg-sky-50 shadow-[0_10px_24px_rgba(14,165,233,0.12)]" : "border-slate-200 bg-white hover:border-sky-200 hover:bg-sky-50/50"}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-slate-950 text-sm font-black text-white">
                                                {(formatFullName(user).slice(0, 2) || "U").toUpperCase()}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <p className="truncate text-base font-bold text-slate-950">{formatFullName(user)}</p>
                                                        <p className="mt-1 truncate text-sm text-slate-500">@{user.username ?? "unknown"}</p>
                                                    </div>
                                                </div>

                                                <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                                                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700">{user.role ?? "user"}</span>
                                                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700">{user.province ?? "Chưa có tỉnh"}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })
                            : null}
                    </div>
                </aside>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_440px]">
                    <section className="rounded-[2rem] border border-white/70 bg-white/95 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.1)]">
                        <div className="flex flex-wrap items-end justify-between gap-3">
                            <div>
                                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Báo cáo</p>
                                <h2 className="mt-1 text-xl font-black text-slate-950">{selectedUser ? `Báo cáo của ${formatFullName(selectedUser)}` : "Chọn người dùng để xem báo cáo"}</h2>
                            </div>
                            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-600">{selectedUserReports.length} báo cáo</span>
                        </div>

                        <div className="mt-4 space-y-3">
                            {isLoadingReports ? <EmptyState title="Đang tải báo cáo..." description="Vui lòng chờ trong giây lát." /> : null}
                            {!isLoadingReports && reportsError ? <EmptyState title="Không tải được báo cáo" description={reportsError} /> : null}
                            {!isLoadingReports && !reportsError && selectedUserReports.length === 0 ? (
                                <EmptyState title="Chưa có báo cáo" description="Người dùng đã chọn chưa có báo cáo nào trong hệ thống." />
                            ) : null}

                            {!isLoadingReports && !reportsError
                                ? selectedUserReports.map((report) => {
                                    const isActive = report.id === selectedReport?.id;

                                    return (
                                        <button
                                            key={report.id ?? `${report.userId}-${report.createdAt}`}
                                            type="button"
                                            onClick={() => setSelectedReportId(report.id ?? null)}
                                            className={`w-full rounded-2xl border px-4 py-4 text-left transition ${isActive ? "border-teal-300 bg-teal-50 shadow-[0_10px_24px_rgba(13,148,136,0.12)]" : "border-slate-200 bg-white hover:border-teal-200 hover:bg-teal-50/40"}`}
                                        >
                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${statusClass(report.status)}`}>{formatStatus(report.status)}</span>
                                                        {report.isUrgent ? <span className="rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700">Khẩn cấp</span> : null}
                                                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">Mức {report.severity ?? 0}</span>
                                                    </div>

                                                    <p className="mt-3 line-clamp-2 text-base font-bold text-slate-950">
                                                        {report.description?.trim() || "Báo cáo không có mô tả"}
                                                    </p>
                                                    <p className="mt-2 text-sm text-slate-500">{reportLocation(report)}</p>
                                                </div>

                                                <div className="rounded-2xl bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 sm:text-right">
                                                    <p>{formatDateTime(report.createdAt)}</p>
                                                    <p className="mt-1">{reportCoordinates(report)}</p>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })
                                : null}
                        </div>
                    </section>

                    <section className="rounded-[2rem] border border-white/70 bg-white/95 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.1)]">
                        <div className="flex flex-col gap-4">
                            <div>
                                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Bản đồ</p>
                                <h2 className="mt-1 text-xl font-black text-slate-950">{selectedReport ? "OpenStreetMap tuyến hỗ trợ" : "Chọn báo cáo để xem bản đồ"}</h2>
                            </div>

                            {selectedReport ? (
                                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-4">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${statusClass(selectedReport.status)}`}>{formatStatus(selectedReport.status)}</span>
                                        <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-600">{selectedReport.isUrgent ? "Ưu tiên cao" : "Theo dõi"}</span>
                                    </div>

                                    <p className="mt-3 text-base font-bold text-slate-950">
                                        {selectedReport.description?.trim() || "Báo cáo không có mô tả"}
                                    </p>
                                    <p className="mt-2 text-sm leading-6 text-slate-600">{reportLocation(selectedReport)}</p>

                                    <dl className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                                        <div>
                                            <dt className="text-xs uppercase tracking-[0.18em] text-slate-400">Người báo cáo</dt>
                                            <dd className="mt-1 font-semibold text-slate-900">{selectedUser ? formatFullName(selectedUser) : "Chưa xác định"}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-xs uppercase tracking-[0.18em] text-slate-400">Toạ độ</dt>
                                            <dd className="mt-1 font-semibold text-slate-900">{reportCoordinates(selectedReport)}</dd>
                                        </div>
                                    </dl>
                                </div>
                            ) : null}

                            <ReliefRouteMap report={selectedReport} />
                        </div>
                    </section>
                </div>
            </section>
        </div>
    );
}
