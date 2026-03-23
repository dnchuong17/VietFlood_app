"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useGlobalAlert } from "@/components/feedback/global-alert-provider";
import { apiRequest } from "@/features/auth/lib/api-client";
import {
    clearAuthTokens,
    getAccessToken,
    getAuthIdentity,
} from "@/features/auth/lib/auth-storage";
import type {
    AuthProfile,
    UpdateProfilePayload,
} from "@/features/auth/types/auth";

type ProfileState = {
    isLoading: boolean;
    isSaving: boolean;
    profile: AuthProfile | null;
    error: string | null;
};

type EditableProfileForm = {
    phone: string;
    province: string;
    ward: string;
    address_line: string;
};

const DEFAULT_AUTH_API_BASE_URL = "http://localhost:8081";
const AUTH_API_BASE_URL =
    process.env.NEXT_PUBLIC_AUTH_API_BASE_URL ?? DEFAULT_AUTH_API_BASE_URL;

function toDisplayErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        if (error.message.trim().toLowerCase() === "failed to fetch") {
            return "Không thể kết nối đến máy chủ.";
        }

        return error.message;
    }

    return "Không thể tải thông tin tài khoản.";
}

function formatRole(role?: string): string {
    const normalized = role?.trim().toLowerCase();

    if (normalized === "admin") {
        return "Quản trị viên";
    }

    if (normalized === "operator") {
        return "Người vận hành";
    }

    return "Người dân";
}

function formatDate(value?: string): string {
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
    }).format(date);
}

function getFullName(profile: AuthProfile | null): string {
    if (!profile) {
        return "Người dùng";
    }

    const fullName = `${profile.first_name ?? ""} ${profile.middle_name ?? ""} ${profile.last_name ?? ""}`
        .replace(/\s+/g, " ")
        .trim();

    if (fullName.length > 0) {
        return fullName;
    }

    return profile.username?.trim() || "Người dùng";
}

function getAddress(profile: AuthProfile | null): string {
    if (!profile) {
        return "Chưa cập nhật";
    }

    const address = [profile.address_line, profile.ward, profile.province]
        .map((item) => item?.trim())
        .filter(Boolean)
        .join(", ");

    return address.length > 0 ? address : "Chưa cập nhật";
}

function buildForm(profile: AuthProfile | null): EditableProfileForm {
    return {
        phone: profile?.phone?.trim() ?? "",
        province: profile?.province?.trim() ?? "",
        ward: profile?.ward?.trim() ?? "",
        address_line: profile?.address_line?.trim() ?? "",
    };
}

function getInitials(name: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? "U";
    const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";

    return `${first}${last}`.toUpperCase();
}

function normalizeValue(value: string): string {
    return value.trim().replace(/\s+/g, " ");
}

function buildUpdatePayload(
    profile: AuthProfile | null,
    form: EditableProfileForm,
): UpdateProfilePayload {
    const payload: UpdateProfilePayload = {};

    const fields: Array<keyof EditableProfileForm> = [
        "phone",
        "province",
        "ward",
        "address_line",
    ];

    for (const field of fields) {
        const nextValue = normalizeValue(form[field]);
        const currentValue = normalizeValue(String(profile?.[field] ?? ""));

        if (nextValue !== currentValue) {
            payload[field] = nextValue;
        }
    }

    return payload;
}

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

    return fallbackMessage;
}

export function ProfileView() {
    const router = useRouter();
    const { showAlert } = useGlobalAlert();
    const [state, setState] = useState<ProfileState>({
        isLoading: true,
        isSaving: false,
        profile: null,
        error: null,
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [form, setForm] = useState<EditableProfileForm>(buildForm(null));

    const identity = useMemo(() => getAuthIdentity(), []);

    const loadProfile = useCallback(async () => {
        const accessToken = getAccessToken();

        if (!accessToken) {
            setState({
                isLoading: false,
                isSaving: false,
                profile: null,
                error: "Bạn chưa đăng nhập. Vui lòng đăng nhập để xem thông tin.",
            });
            return;
        }

        setState((previous) => ({
            ...previous,
            isLoading: true,
            error: null,
        }));

        try {
            const response = await apiRequest(`${AUTH_API_BASE_URL}/auth/profile`, {
                method: "GET",
                credentials: "include",
            });
            const data: unknown = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(
                    extractErrorMessage(data, "Không thể tải thông tin tài khoản."),
                );
            }

            const profile =
                typeof data === "object" && data !== null
                    ? (data as AuthProfile)
                    : null;

            setState((previous) => ({
                ...previous,
                isLoading: false,
                profile,
                error: profile ? null : "Không nhận được dữ liệu hồ sơ hợp lệ từ máy chủ.",
            }));
            setForm(buildForm(profile));
        } catch (error) {
            const message = toDisplayErrorMessage(error);

            if (message.toLowerCase().includes("unauthorized")) {
                clearAuthTokens();
            }

            setState((previous) => ({
                ...previous,
                isLoading: false,
                profile: null,
                error: message,
            }));
        }
    }, []);

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            void loadProfile();
        }, 0);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [loadProfile]);

    function handleLogout() {
        setIsLogoutConfirmOpen(true);
    }

    async function handleConfirmLogout() {
        try {
            setIsLoggingOut(true);
            clearAuthTokens();
            setIsLogoutConfirmOpen(false);
            showAlert({
                title: "Đã đăng xuất",
                description: "Phiên đăng nhập của bạn đã được kết thúc. Hên gặp lại bạn!",
                variant: "info",
            });
            router.replace("/dang-nhap");
            router.refresh();
        } finally {
            setIsLoggingOut(false);
        }
    }

    function handleChangeField(field: keyof EditableProfileForm, value: string) {
        setForm((previous) => ({
            ...previous,
            [field]: value,
        }));
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const accessToken = getAccessToken();
        if (!accessToken) {
            showAlert({
                title: "Hết phiên đăng nhập",
                description: "Vui lòng đăng nhập lại để cập nhật thông tin.",
                variant: "error",
            });
            router.replace("/dang-nhap");
            return;
        }

        const payload = buildUpdatePayload(state.profile, form);

        if (Object.keys(payload).length === 0) {
            showAlert({
                title: "Không có thay đổi",
                description: "Bạn chưa chỉnh sửa trường nào để cập nhật.",
                variant: "info",
            });
            return;
        }

        setState((previous) => ({ ...previous, isSaving: true }));

        try {
            const response = await apiRequest(`${AUTH_API_BASE_URL}/auth/update`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data: unknown = await response.json().catch(() => null);
            if (!response.ok) {
                throw new Error(
                    extractErrorMessage(data, "Cập nhật thông tin thất bại. Vui lòng thử lại."),
                );
            }

            showAlert({
                title: "Cập nhật thành công",
                description: "Thông tin tài khoản đã được cập nhật.",
                variant: "success",
            });
            setIsEditing(false);
            await loadProfile();
        } catch (error) {
            showAlert({
                title: "Cập nhật thất bại",
                description: toDisplayErrorMessage(error),
                variant: "error",
            });
        } finally {
            setState((previous) => ({ ...previous, isSaving: false }));
        }
    }

    function handleCancelEdit() {
        setForm(buildForm(state.profile));
        setIsEditing(false);
    }

    const fullName = getFullName(state.profile);
    const initials = getInitials(fullName);

    return (
        <>
            <section className="relative h-full overflow-y-auto bg-[radial-gradient(circle_at_top,rgba(14,116,144,0.18),transparent_48%),radial-gradient(circle_at_bottom_right,rgba(15,118,110,0.16),transparent_45%),linear-gradient(180deg,#f8fdff_0%,#f6f7ff_100%)] px-4 pb-10 pt-[calc(var(--navbar-height)+1.1rem)]">
                <div className="mx-auto w-full max-w-xl space-y-4">
                    <div className="relative overflow-hidden rounded-3xl border border-sky-100/90 bg-white/85 p-5 shadow-[0_24px_48px_-32px_rgba(8,47,73,0.55)] backdrop-blur-sm">
                        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-sky-200/35 blur-xl" />
                        <div className="absolute -bottom-6 left-8 h-20 w-20 rounded-full bg-teal-200/30 blur-xl" />

                        <div className="relative flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-linear-to-br from-sky-600 to-teal-600 text-lg font-bold text-white shadow-lg shadow-sky-200/70">
                                    {initials}
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">
                                        Hồ sơ cá nhân
                                    </p>
                                    <h1 className="mt-1 text-[1.35rem] font-extrabold leading-tight text-slate-900">
                                        {fullName}
                                    </h1>
                                    <p className="mt-1 text-sm text-slate-600">
                                        {identity?.username ? `@${identity.username}` : "Tài khoản VietFlood"}
                                    </p>
                                </div>
                            </div>

                            <span className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal-800">
                                {formatRole(state.profile?.role)}
                            </span>
                        </div>

                        <div className="relative mt-4 flex flex-wrap gap-2">
                            <button
                                type="button"
                                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                                onClick={() => setIsEditing((previous) => !previous)}
                                disabled={state.isLoading || state.isSaving}
                            >
                                {isEditing ? "Đóng chỉnh sửa" : "Chỉnh sửa"}
                            </button>
                            <button
                                type="button"
                                className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:cursor-pointer hover:bg-slate-700 disabled:cursor-not-allowed"
                                onClick={handleLogout}
                                disabled={state.isSaving}
                            >
                                Đăng xuất
                            </button>
                        </div>
                    </div>

                    {state.error ? (
                        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
                            {state.error}
                        </div>
                    ) : null}

                    <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-slate-200/85 bg-white p-4 shadow-sm sm:col-span-2">
                            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                                Địa chỉ hiện tại
                            </p>
                            <p className="mt-1 text-sm font-semibold text-slate-900">
                                {getAddress(state.profile)}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200/85 bg-white p-4 shadow-sm">
                            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                                Email
                            </p>
                            <p className="mt-1 text-sm font-semibold text-slate-900">
                                {state.profile?.email || "Chưa cập nhật"}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200/85 bg-white p-4 shadow-sm">
                            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                                Số điện thoại
                            </p>
                            <p className="mt-1 text-sm font-semibold text-slate-900">
                                {state.profile?.phone || "Chưa cập nhật"}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200/85 bg-white p-4 shadow-sm">
                            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                                Ngày sinh
                            </p>
                            <p className="mt-1 text-sm font-semibold text-slate-900">
                                {formatDate(state.profile?.date_of_birth)}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200/85 bg-white p-4 shadow-sm">
                            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                                Ngày tạo tài khoản
                            </p>
                            <p className="mt-1 text-sm font-semibold text-slate-900">
                                {formatDate(state.profile?.created_at)}
                            </p>
                        </div>
                    </div>

                    {isEditing ? (
                        <form
                            onSubmit={handleSubmit}
                            className="rounded-3xl border border-slate-200/80 bg-white/92 p-5 shadow-[0_20px_42px_-34px_rgba(15,23,42,0.45)] backdrop-blur"
                        >
                            <h2 className="text-base font-bold text-slate-900">Cập nhật thông tin</h2>
                            <p className="mt-1 text-sm text-slate-600">
                                Bạn có thể chỉnh sửa thông tin liên hệ và địa chỉ bên dưới.
                            </p>

                            <div className="mt-4 grid gap-3">
                                <label className="grid gap-1.5 text-sm font-medium text-slate-700">
                                    Số điện thoại
                                    <input
                                        type="text"
                                        value={form.phone}
                                        onChange={(event) => handleChangeField("phone", event.target.value)}
                                        className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-teal-500/35"
                                        placeholder="Nhập số điện thoại"
                                    />
                                </label>

                                <label className="grid gap-1.5 text-sm font-medium text-slate-700">
                                    Tỉnh/Thành phố
                                    <input
                                        type="text"
                                        value={form.province}
                                        onChange={(event) => handleChangeField("province", event.target.value)}
                                        className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-teal-500/35"
                                        placeholder="Nhập tỉnh/thành phố"
                                    />
                                </label>

                                <label className="grid gap-1.5 text-sm font-medium text-slate-700">
                                    Phường/Xã
                                    <input
                                        type="text"
                                        value={form.ward}
                                        onChange={(event) => handleChangeField("ward", event.target.value)}
                                        className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-teal-500/35"
                                        placeholder="Nhập phường/xã"
                                    />
                                </label>

                                <label className="grid gap-1.5 text-sm font-medium text-slate-700">
                                    Địa chỉ chi tiết
                                    <textarea
                                        value={form.address_line}
                                        onChange={(event) => handleChangeField("address_line", event.target.value)}
                                        className="min-h-22 rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-teal-500/35"
                                        placeholder="Nhập số nhà, tên đường..."
                                    />
                                </label>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                                <button
                                    type="submit"
                                    className="rounded-xl bg-linear-to-r from-sky-600 to-teal-600 px-4 py-2.5 text-sm font-bold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
                                    disabled={state.isSaving || state.isLoading}
                                >
                                    {state.isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                                    disabled={state.isSaving}
                                >
                                    Hủy
                                </button>
                            </div>
                        </form>
                    ) : null}
                </div>
            </section>

            {isLogoutConfirmOpen ? (
                <div
                    className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/55 px-4"
                    onClick={() => {
                        if (!isLoggingOut) {
                            setIsLogoutConfirmOpen(false);
                        }
                    }}
                >
                    <div
                        className="w-full max-w-md rounded-2xl border border-blue-200 bg-white p-5 shadow-2xl"
                        role="alertdialog"
                        aria-modal="true"
                        aria-label="Xác nhận đăng xuất"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-blue-700">
                            Xác nhận hành động
                        </p>
                        <h3 className="mt-1 text-lg font-bold text-slate-900">Đăng xuất</h3>
                        <p className="mt-2 text-sm text-slate-600">
                            Bạn có chắc chắn muốn đăng xuất khỏi hệ thống không?
                        </p>

                        <div className="mt-5 flex items-center justify-end gap-2">
                            <button
                                type="button"
                                className="rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                                onClick={() => setIsLogoutConfirmOpen(false)}
                                disabled={isLoggingOut}
                            >
                                Hủy
                            </button>
                            <button
                                type="button"
                                className="rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                onClick={() => void handleConfirmLogout()}
                                disabled={isLoggingOut}
                            >
                                {isLoggingOut ? "Đang xử lý..." : "Xác nhận đăng xuất"}
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}

        </>
    );
}
