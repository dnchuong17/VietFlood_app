"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { useGlobalAlert } from "@/components/feedback/global-alert-provider";
import { signUp } from "@/features/auth/api/sign-in";
import {
    fetchVietnamAdministrativeUnits,
    type VnProvince,
    type VnWard,
} from "@/features/auth/api/vietnam-administrative";

type RegisterFormState = {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
    phone: string;
    firstName: string;
    middleName: string;
    lastName: string;
    dateOfBirth: string;
    province: string;
    ward: string;
    addressLine: string;
};

const INITIAL_FORM_STATE: RegisterFormState = {
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    phone: "",
    firstName: "",
    middleName: "",
    lastName: "",
    dateOfBirth: "",
    province: "",
    ward: "",
    addressLine: "",
};

function EyeIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
            className="h-[1.15rem] w-[1.15rem]"
        >
            <path
                d="M2 12s3.8-6 10-6 10 6 10 6-3.8 6-10 6-10-6-10-6Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
            />
            <circle
                cx="12"
                cy="12"
                r="3"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
            />
        </svg>
    );
}

function EyeOffIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
            className="h-[1.15rem] w-[1.15rem]"
        >
            <path
                d="M3 3l18 18M10.6 6.5a9.8 9.8 0 0 1 1.4-.1c6.2 0 10 5.6 10 5.6a18 18 0 0 1-4.2 4.4M6.2 8.1A18.9 18.9 0 0 0 2 12s3.8 6 10 6c.5 0 1 0 1.4-.1"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.7"
            />
            <path
                d="M9.9 9.9a3 3 0 0 0 4.2 4.2"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.7"
            />
        </svg>
    );
}

function toDisplayErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        const normalized = error.message.trim().toLowerCase();

        if (normalized === "failed to fetch") {
            return "Không thể kết nối đến server.";
        }

        return error.message;
    }

    return "Đăng ký thất bại. Vui lòng thử lại.";
}

export function RegisterForm() {
    const router = useRouter();
    const { showAlert } = useGlobalAlert();
    const [form, setForm] = useState<RegisterFormState>(INITIAL_FORM_STATE);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [provinces, setProvinces] = useState<VnProvince[]>([]);
    const [isLoadingAdministrativeUnits, setIsLoadingAdministrativeUnits] = useState(true);
    const [administrativeError, setAdministrativeError] = useState<string | null>(null);
    const [selectedProvinceCode, setSelectedProvinceCode] = useState("");
    const [selectedWardCode, setSelectedWardCode] = useState("");

    const selectedProvince = useMemo(() => {
        if (!selectedProvinceCode) {
            return null;
        }

        return provinces.find((province) => String(province.code) === selectedProvinceCode) ?? null;
    }, [provinces, selectedProvinceCode]);

    const wards = useMemo<VnWard[]>(() => {
        return selectedProvince?.wards ?? [];
    }, [selectedProvince]);

    useEffect(() => {
        let isMounted = true;

        async function loadAdministrativeUnits() {
            try {
                setIsLoadingAdministrativeUnits(true);
                setAdministrativeError(null);

                const data = await fetchVietnamAdministrativeUnits();

                if (!isMounted) {
                    return;
                }

                setProvinces(data);
            } catch (error) {
                if (!isMounted) {
                    return;
                }

                const message = toDisplayErrorMessage(error);
                setAdministrativeError(message);
                showAlert({
                    title: "Không tải được dữ liệu địa giới",
                    description: message,
                    variant: "error",
                });
            } finally {
                if (isMounted) {
                    setIsLoadingAdministrativeUnits(false);
                }
            }
        }

        void loadAdministrativeUnits();

        return () => {
            isMounted = false;
        };
    }, [showAlert]);

    function handleSelectProvince(event: React.ChangeEvent<HTMLSelectElement>) {
        const code = event.target.value;
        const province = provinces.find((item) => String(item.code) === code);

        setSelectedProvinceCode(code);
        setSelectedWardCode("");
        setForm((prev) => ({
            ...prev,
            province: province?.name ?? "",
            ward: "",
        }));
    }

    function handleSelectWard(event: React.ChangeEvent<HTMLSelectElement>) {
        const code = event.target.value;
        const ward = wards.find((item) => String(item.code) === code);

        setSelectedWardCode(code);

        setForm((prev) => ({
            ...prev,
            ward: ward?.name ?? "",
        }));
    }

    async function handleRetryAdministrativeUnits() {
        try {
            setIsLoadingAdministrativeUnits(true);
            setAdministrativeError(null);

            const data = await fetchVietnamAdministrativeUnits();
            setProvinces(data);
        } catch (error) {
            const message = toDisplayErrorMessage(error);
            setAdministrativeError(message);
            showAlert({
                title: "Không tải được dữ liệu địa giới",
                description: message,
                variant: "error",
            });
        } finally {
            setIsLoadingAdministrativeUnits(false);
        }
    }

    function updateField<Key extends keyof RegisterFormState>(
        key: Key,
        value: RegisterFormState[Key],
    ) {
        setForm((prev) => ({
            ...prev,
            [key]: value,
        }));
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (form.password !== form.confirmPassword) {
            showAlert({
                title: "Mật khẩu không khớp",
                description: "Vui lòng nhập lại mật khẩu xác nhận trùng khớp.",
                variant: "error",
            });
            return;
        }

        if (form.password.trim().length < 6) {
            showAlert({
                title: "Mật khẩu quá ngắn",
                description: "Mật khẩu cần có ít nhất 6 ký tự.",
                variant: "error",
            });
            return;
        }

        if (!form.province || !form.ward) {
            showAlert({
                title: "Thiếu địa chỉ hành chính",
                description: "Vui lòng chọn đầy đủ tỉnh/thành phố và phường/xã.",
                variant: "error",
            });
            return;
        }

        try {
            setIsSubmitting(true);

            await signUp({
                email: form.email.trim(),
                username: form.username.trim(),
                password: form.password,
                phone: form.phone.trim(),
                first_name: form.firstName.trim(),
                middle_name: form.middleName.trim() || undefined,
                last_name: form.lastName.trim(),
                date_of_birth: form.dateOfBirth,
                province: form.province.trim(),
                ward: form.ward.trim(),
                address_line: form.addressLine.trim(),
            });

            showAlert({
                title: "Đăng ký thành công",
                description: "Tài khoản user đã được tạo. Vui lòng đăng nhập để tiếp tục.",
                variant: "success",
            });

            setSelectedWardCode("");

            router.replace("/dang-nhap");
            router.refresh();
        } catch (error) {
            showAlert({
                title: "Đăng ký thất bại",
                description: toDisplayErrorMessage(error),
                variant: "error",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form className="mt-4 grid gap-3" onSubmit={handleSubmit}>
            <label htmlFor="last-name" className="text-[0.95rem] font-semibold">
                Họ và tên
            </label>
            <div className="grid gap-2 sm:grid-cols-3">
                <input
                    id="last-name"
                    name="last-name"
                    type="text"
                    placeholder="Họ"
                    autoComplete="family-name"
                    value={form.lastName}
                    onChange={(event) => updateField("lastName", event.target.value)}
                    className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none focus:border-transparent focus:ring-2 focus:ring-teal-500/40"
                    required
                />
                <input
                    id="middle-name"
                    name="middle-name"
                    type="text"
                    placeholder="Tên đệm"
                    value={form.middleName}
                    onChange={(event) => updateField("middleName", event.target.value)}
                    className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none focus:border-transparent focus:ring-2 focus:ring-teal-500/40"
                />
                <input
                    id="first-name"
                    name="first-name"
                    type="text"
                    placeholder="Tên"
                    autoComplete="given-name"
                    value={form.firstName}
                    onChange={(event) => updateField("firstName", event.target.value)}
                    className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none focus:border-transparent focus:ring-2 focus:ring-teal-500/40"
                    required
                />
            </div>

            <label htmlFor="username" className="text-[0.95rem] font-semibold">
                Tên đăng nhập
            </label>
            <input
                id="username"
                name="username"
                type="text"
                placeholder="Nhập tên đăng nhập"
                autoComplete="username"
                value={form.username}
                onChange={(event) => updateField("username", event.target.value)}
                className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none focus:border-transparent focus:ring-2 focus:ring-teal-500/40"
                required
            />

            <label htmlFor="email" className="text-[0.95rem] font-semibold">
                Email
            </label>
            <input
                id="email"
                name="email"
                type="email"
                placeholder="tenban@email.com"
                autoComplete="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none focus:border-transparent focus:ring-2 focus:ring-teal-500/40"
                required
            />

            <label htmlFor="phone" className="text-[0.95rem] font-semibold">
                Số điện thoại
            </label>
            <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Nhập số điện thoại"
                autoComplete="tel"
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none focus:border-transparent focus:ring-2 focus:ring-teal-500/40"
                required
            />

            <label htmlFor="date-of-birth" className="text-[0.95rem] font-semibold">
                Ngày sinh
            </label>
            <input
                id="date-of-birth"
                name="date-of-birth"
                type="date"
                value={form.dateOfBirth}
                onChange={(event) => updateField("dateOfBirth", event.target.value)}
                className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none focus:border-transparent focus:ring-2 focus:ring-teal-500/40"
                required
            />

            <label htmlFor="province" className="text-[0.95rem] font-semibold">
                Tỉnh/Thành phố
            </label>
            <select
                id="province"
                name="province"
                value={selectedProvinceCode}
                onChange={handleSelectProvince}
                className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none focus:border-transparent focus:ring-2 focus:ring-teal-500/40"
                disabled={isLoadingAdministrativeUnits}
                required
            >
                <option value="">{isLoadingAdministrativeUnits ? "Đang tải dữ liệu tỉnh/thành phố..." : "Chọn tỉnh/thành phố"}</option>
                {provinces.map((province) => (
                    <option key={province.code} value={String(province.code)}>
                        {province.name}
                    </option>
                ))}
            </select>

            <label htmlFor="ward" className="text-[0.95rem] font-semibold">
                Phường/Xã
            </label>
            <select
                id="ward"
                name="ward"
                value={selectedWardCode}
                onChange={handleSelectWard}
                className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none focus:border-transparent focus:ring-2 focus:ring-teal-500/40"
                disabled={!selectedProvinceCode || isLoadingAdministrativeUnits}
                required
            >
                <option value="">{!selectedProvinceCode ? "Chọn tỉnh/thành phố trước" : "Chọn phường/xã"}</option>
                {wards.map((ward) => (
                    <option key={ward.code} value={String(ward.code)}>
                        {ward.name}
                    </option>
                ))}
            </select>

            {administrativeError ? (
                <div className="rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-700">
                    <p className="m-0">Không thể tải danh sách địa giới. Bạn có thể thử lại.</p>
                    <button
                        type="button"
                        onClick={() => void handleRetryAdministrativeUnits()}
                        className="mt-2 inline-flex rounded-md border border-red-300 bg-white px-2.5 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                    >
                        Tải lại dữ liệu
                    </button>
                </div>
            ) : null}

            <label htmlFor="address-line" className="text-[0.95rem] font-semibold">
                Địa chỉ cụ thể
            </label>
            <input
                id="address-line"
                name="address-line"
                type="text"
                placeholder="Số nhà, đường..."
                value={form.addressLine}
                onChange={(event) => updateField("addressLine", event.target.value)}
                className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none focus:border-transparent focus:ring-2 focus:ring-teal-500/40"
                required
            />

            <label htmlFor="password" className="text-[0.95rem] font-semibold">
                Mật khẩu
            </label>
            <div className="relative">
                <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                    autoComplete="new-password"
                    value={form.password}
                    onChange={(event) => updateField("password", event.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 pr-12 outline-none focus:border-transparent focus:ring-2 focus:ring-teal-500/40"
                    required
                />
                <button
                    type="button"
                    className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-sky-700 transition hover:bg-sky-100 focus-visible:outline-2 focus-visible:outline-teal-500/50"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    aria-pressed={showPassword}
                >
                    <span className="sr-only">{showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}</span>
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
            </div>

            <label htmlFor="confirm-password" className="text-[0.95rem] font-semibold">
                Xác nhận mật khẩu
            </label>
            <div className="relative">
                <input
                    id="confirm-password"
                    name="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu"
                    autoComplete="new-password"
                    value={form.confirmPassword}
                    onChange={(event) => updateField("confirmPassword", event.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 pr-12 outline-none focus:border-transparent focus:ring-2 focus:ring-teal-500/40"
                    required
                />
                <button
                    type="button"
                    className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-sky-700 transition hover:bg-sky-100 focus-visible:outline-2 focus-visible:outline-teal-500/50"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    aria-pressed={showConfirmPassword}
                >
                    <span className="sr-only">{showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}</span>
                    {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
            </div>

            <button
                type="submit"
                className="mt-1 rounded-xl bg-linear-to-r from-sky-600 to-teal-600 px-4 py-2.5 font-bold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-75"
                disabled={isSubmitting}
            >
                {isSubmitting ? "Đang tạo tài khoản..." : "Đăng ký"}
            </button>

            <p className="mt-1 text-center text-sm text-slate-600">
                Đã có tài khoản?{" "}
                <Link
                    href="/dang-nhap"
                    className="font-semibold text-sky-700 underline-offset-2 hover:underline"
                >
                    Đăng nhập ngay
                </Link>
            </p>
        </form>
    );
}
