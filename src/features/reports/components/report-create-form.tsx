"use client";

import { useEffect, useMemo, useState } from "react";

import { useGlobalAlert } from "@/components/feedback/global-alert-provider";
import {
    fetchVietnamAdministrativeUnits,
    type VnProvince,
    type VnWard,
} from "@/features/auth/api/vietnam-administrative";
import { apiRequest } from "@/features/auth/lib/api-client";

const DEFAULT_API_BASE_URL = "http://localhost:8081";
const API_BASE_URL =
    process.env.NEXT_PUBLIC_AUTH_API_BASE_URL ?? DEFAULT_API_BASE_URL;

type ReportCategory = "flood" | "incident" | "infrastructure" | "rescue";

type ReportItem = {
    category: ReportCategory;
    description: string;
};

type ReportFormState = {
    province: string;
    ward: string;
    addressLine: string;
    lat: string;
    lng: string;
    files: File[];
};

const CATEGORY_OPTIONS: Array<{ value: ReportCategory; label: string }> = [
    { value: "flood", label: "Ngập lụt" },
    { value: "incident", label: "Sự cố" },
    { value: "infrastructure", label: "Hạ tầng" },
    { value: "rescue", label: "Cứu hộ" },
];

const DEFAULT_REPORT_ITEM: ReportItem = {
    category: "flood",
    description: "",
};

function createInitialState(): ReportFormState {
    return {
        province: "",
        ward: "",
        addressLine: "",
        lat: "",
        lng: "",
        files: [],
    };
}

function parseOptionalNumber(value: string): number | null {
    const trimmed = value.trim();
    if (!trimmed) {
        return null;
    }

    const next = Number(trimmed);
    return Number.isFinite(next) ? next : null;
}

function extractErrorMessage(data: unknown, fallback: string): string {
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

    return fallback;
}

export function ReportCreateForm() {
    const { showAlert } = useGlobalAlert();
    const [form, setForm] = useState<ReportFormState>(createInitialState);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLocating, setIsLocating] = useState(false);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [provinces, setProvinces] = useState<VnProvince[]>([]);
    const [isLoadingAdministrativeUnits, setIsLoadingAdministrativeUnits] =
        useState(true);
    const [administrativeError, setAdministrativeError] = useState<string | null>(
        null,
    );
    const [selectedProvinceCode, setSelectedProvinceCode] = useState("");
    const [selectedWardCode, setSelectedWardCode] = useState("");
    const [reportItems, setReportItems] = useState<ReportItem[]>([
        DEFAULT_REPORT_ITEM,
    ]);

    const selectedFileNames = useMemo(
        () => form.files.map((file) => file.name).join(", "),
        [form.files],
    );

    const selectedProvince = useMemo(() => {
        if (!selectedProvinceCode) {
            return null;
        }

        return (
            provinces.find(
                (province) => String(province.code) === selectedProvinceCode,
            ) ?? null
        );
    }, [provinces, selectedProvinceCode]);

    const wards = useMemo<VnWard[]>(() => {
        return selectedProvince?.wards ?? [];
    }, [selectedProvince]);

    function handleChange<K extends keyof ReportFormState>(
        key: K,
        value: ReportFormState[K],
    ) {
        setForm((previous) => ({ ...previous, [key]: value }));
    }

    function handleChangeReportItem(
        index: number,
        key: keyof ReportItem,
        value: ReportItem[keyof ReportItem],
    ) {
        setReportItems((previous) =>
            previous.map((item, currentIndex) =>
                currentIndex === index ? { ...item, [key]: value } : item,
            ),
        );
    }

    function handleAddReportItem() {
        if (reportItems.length >= CATEGORY_OPTIONS.length) {
            return;
        }

        const usedCategories = new Set(reportItems.map((item) => item.category));
        const nextCategory =
            CATEGORY_OPTIONS.find((option) => !usedCategories.has(option.value))
                ?.value ?? CATEGORY_OPTIONS[0].value;

        setReportItems((previous) => [
            ...previous,
            {
                category: nextCategory,
                description: "",
            },
        ]);
    }

    function handleRemoveReportItem(index: number) {
        if (reportItems.length <= 1) {
            return;
        }

        setReportItems((previous) =>
            previous.filter((_, currentIndex) => currentIndex !== index),
        );
    }

    function fillCurrentLocation() {
        if (typeof window === "undefined" || !("geolocation" in navigator)) {
            setLocationError("Thiết bị không hỗ trợ định vị.");
            return;
        }

        setIsLocating(true);
        setLocationError(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude.toFixed(6);
                const lng = position.coords.longitude.toFixed(6);

                setForm((previous) => ({
                    ...previous,
                    lat,
                    lng,
                }));
                setIsLocating(false);
            },
            (error) => {
                const message =
                    error.code === error.PERMISSION_DENIED
                        ? "Bạn đã từ chối quyền truy cập vị trí."
                        : error.code === error.TIMEOUT
                            ? "Hết thời gian lấy vị trí. Vui lòng thử lại."
                            : "Không thể lấy vị trí hiện tại.";

                setLocationError(message);
                setIsLocating(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000,
            },
        );
    }

    useEffect(() => {
        fillCurrentLocation();
    }, []);

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

                const message =
                    error instanceof Error
                        ? error.message
                        : "Không thể tải dữ liệu địa giới hành chính.";

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

    async function handleRetryAdministrativeUnits() {
        try {
            setIsLoadingAdministrativeUnits(true);
            setAdministrativeError(null);

            const data = await fetchVietnamAdministrativeUnits();
            setProvinces(data);
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Không thể tải dữ liệu địa giới hành chính.";

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

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const trimmedItems = reportItems.map((item) => ({
            category: item.category,
            description: item.description.trim(),
        }));

        if (trimmedItems.some((item) => !item.description)) {
            showAlert({
                title: "Thiếu mô tả báo cáo",
                description: "Mỗi loại báo cáo cần có nội dung mô tả.",
                variant: "error",
            });
            return;
        }

        const uniqueCategories = new Set(trimmedItems.map((item) => item.category));
        if (uniqueCategories.size !== trimmedItems.length) {
            showAlert({
                title: "Trùng loại báo cáo",
                description: "Mỗi loại báo cáo chỉ được chọn tối đa một lần.",
                variant: "error",
            });
            return;
        }

        if (!form.province.trim() || !form.ward.trim() || !form.addressLine.trim()) {
            showAlert({
                title: "Thiếu thông tin",
                description: "Vui lòng chọn tỉnh/thành, phường/xã và nhập địa chỉ cụ thể.",
                variant: "error",
            });
            return;
        }

        const lat = parseOptionalNumber(form.lat);
        const lng = parseOptionalNumber(form.lng);

        if (form.lat.trim() && lat === null) {
            showAlert({
                title: "Vĩ độ không hợp lệ",
                description: "Vĩ độ phải là số hợp lệ.",
                variant: "error",
            });
            return;
        }

        if (form.lng.trim() && lng === null) {
            showAlert({
                title: "Kinh độ không hợp lệ",
                description: "Kinh độ phải là số hợp lệ.",
                variant: "error",
            });
            return;
        }

        const payload = new FormData();
        for (const item of trimmedItems) {
            payload.append("category[]", item.category);
        }

        const description = trimmedItems
            .map((item) => item.description)
            .join(", ");

        payload.append("description", description);
        payload.append("province", form.province.trim());
        payload.append("ward", form.ward.trim());
        payload.append("addressLine", form.addressLine.trim());

        if (lat !== null) {
            payload.append("lat", String(lat));
        }

        if (lng !== null) {
            payload.append("lng", String(lng));
        }

        for (const file of form.files) {
            payload.append("files", file);
        }

        try {
            setIsSubmitting(true);

            const response = await apiRequest(`${API_BASE_URL}/reports/create`, {
                method: "POST",
                credentials: "include",
                body: payload,
            });

            const data: unknown = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(
                    extractErrorMessage(data, "Gửi báo cáo thất bại. Vui lòng thử lại."),
                );
            }

            showAlert({
                title: "Gửi báo cáo thành công",
                description: "Cảm ơn bạn đã gửi thông tin. Chúng tôi sẽ xử lý sớm.",
                variant: "success",
            });
            setForm(createInitialState());
            setSelectedProvinceCode("");
            setSelectedWardCode("");
            setReportItems([DEFAULT_REPORT_ITEM]);
            fillCurrentLocation();
        } catch (error) {
            showAlert({
                title: "Không thể gửi báo cáo",
                description:
                    error instanceof Error
                        ? error.message
                        : "Đã có lỗi xảy ra khi gửi báo cáo.",
                variant: "error",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <section className="relative h-full overflow-y-auto bg-[radial-gradient(circle_at_top,rgba(14,116,144,0.16),transparent_45%),linear-gradient(180deg,#f8fdff_0%,#f5f7ff_100%)] px-4 pb-10 pt-[calc(var(--navbar-height)+1.1rem)]">
            <div className="mx-auto w-full max-w-xl">
                <div className="rounded-3xl border border-sky-100/90 bg-white/90 p-5 shadow-[0_24px_48px_-32px_rgba(8,47,73,0.45)] backdrop-blur-sm">
                    <h1 className="text-[1.35rem] font-extrabold leading-tight text-slate-900">
                        Gửi báo cáo hiện trường
                    </h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Vui lòng nhập thông tin chi tiết để hệ thống tiếp nhận và xử lý nhanh hơn.
                    </p>

                    <form className="mt-5 space-y-4" onSubmit={(event) => void handleSubmit(event)}>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                                    Danh sách báo cáo trong lần gửi này
                                </p>
                                <button
                                    type="button"
                                    onClick={handleAddReportItem}
                                    disabled={
                                        isSubmitting ||
                                        reportItems.length >= CATEGORY_OPTIONS.length
                                    }
                                    className="rounded-lg border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700 transition hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    Thêm loại báo cáo
                                </button>
                            </div>

                            {reportItems.map((item, index) => {
                                const selectedCategories = new Set(
                                    reportItems
                                        .filter((_, idx) => idx !== index)
                                        .map((entry) => entry.category),
                                );

                                return (
                                    <div
                                        key={`${item.category}-${index}`}
                                        className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/70 p-3"
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="text-sm font-semibold text-slate-800">
                                                Báo cáo #{index + 1}
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveReportItem(index)}
                                                disabled={isSubmitting || reportItems.length <= 1}
                                                className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                Xóa
                                            </button>
                                        </div>

                                        <label className="block space-y-1">
                                            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                                                Loại báo cáo
                                            </span>
                                            <select
                                                value={item.category}
                                                onChange={(event) =>
                                                    handleChangeReportItem(
                                                        index,
                                                        "category",
                                                        event.target.value as ReportCategory,
                                                    )
                                                }
                                                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-transparent focus:ring-2 focus:ring-sky-500/40"
                                                disabled={isSubmitting}
                                            >
                                                {CATEGORY_OPTIONS.map((option) => (
                                                    <option
                                                        key={option.value}
                                                        value={option.value}
                                                        disabled={
                                                            selectedCategories.has(option.value) &&
                                                            option.value !== item.category
                                                        }
                                                    >
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>

                                        <label className="block space-y-1">
                                            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                                                Mô tả sự việc
                                            </span>
                                            <textarea
                                                rows={3}
                                                value={item.description}
                                                onChange={(event) =>
                                                    handleChangeReportItem(
                                                        index,
                                                        "description",
                                                        event.target.value,
                                                    )
                                                }
                                                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-transparent focus:ring-2 focus:ring-sky-500/40"
                                                placeholder="Mô tả ngắn gọn tình trạng bạn quan sát được"
                                                disabled={isSubmitting}
                                            />
                                        </label>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <label className="block space-y-1">
                                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                                    Tỉnh/Thành phố
                                </span>
                                <select
                                    value={selectedProvinceCode}
                                    onChange={handleSelectProvince}
                                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-transparent focus:ring-2 focus:ring-sky-500/40"
                                    disabled={isSubmitting || isLoadingAdministrativeUnits}
                                >
                                    <option value="">
                                        {isLoadingAdministrativeUnits
                                            ? "Đang tải dữ liệu tỉnh/thành phố..."
                                            : "Chọn tỉnh/thành phố"}
                                    </option>
                                    {provinces.map((province) => (
                                        <option key={province.code} value={String(province.code)}>
                                            {province.name}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label className="block space-y-1">
                                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                                    Phường/Xã
                                </span>
                                <select
                                    value={selectedWardCode}
                                    onChange={handleSelectWard}
                                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-transparent focus:ring-2 focus:ring-sky-500/40"
                                    disabled={
                                        isSubmitting ||
                                        isLoadingAdministrativeUnits ||
                                        !selectedProvinceCode
                                    }
                                >
                                    <option value="">
                                        {!selectedProvinceCode
                                            ? "Chọn tỉnh/thành phố trước"
                                            : "Chọn phường/xã"}
                                    </option>
                                    {wards.map((ward) => (
                                        <option key={ward.code} value={String(ward.code)}>
                                            {ward.name}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>

                        {administrativeError ? (
                            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
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

                        <label className="block space-y-1">
                            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                                Địa chỉ cụ thể
                            </span>
                            <input
                                type="text"
                                value={form.addressLine}
                                onChange={(event) => handleChange("addressLine", event.target.value)}
                                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-transparent focus:ring-2 focus:ring-sky-500/40"
                                placeholder="Số nhà, đường, mốc gần nhất"
                                disabled={isSubmitting}
                            />
                        </label>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <label className="block space-y-1">
                                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                                    Vĩ độ (lat)
                                </span>
                                <input
                                    type="text"
                                    value={form.lat}
                                    readOnly
                                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900"
                                    placeholder={isLocating ? "Đang lấy vị trí..." : "Chưa có vị trí"}
                                />
                            </label>

                            <label className="block space-y-1">
                                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                                    Kinh độ (lng)
                                </span>
                                <input
                                    type="text"
                                    value={form.lng}
                                    readOnly
                                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900"
                                    placeholder={isLocating ? "Đang lấy vị trí..." : "Chưa có vị trí"}
                                />
                            </label>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-xs text-slate-600">
                                    Tọa độ được lấy tự động từ vị trí hiện tại của thiết bị.
                                </p>
                                <button
                                    type="button"
                                    className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                                    onClick={fillCurrentLocation}
                                    disabled={isSubmitting || isLocating}
                                >
                                    {isLocating ? "Đang lấy..." : "Lấy lại vị trí"}
                                </button>
                            </div>
                            {locationError ? (
                                <p className="mt-1 text-xs text-red-700">{locationError}</p>
                            ) : null}
                        </div>

                        <label className="block space-y-1">
                            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                                Ảnh/Video minh chứng (tối đa 10)
                            </span>
                            <input
                                type="file"
                                multiple
                                accept="image/*,video/*"
                                onChange={(event) => {
                                    const files = event.target.files ? Array.from(event.target.files).slice(0, 10) : [];
                                    handleChange("files", files);
                                }}
                                className="block w-full text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-sky-100 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-sky-800 hover:file:bg-sky-200"
                                disabled={isSubmitting}
                            />
                            {selectedFileNames ? (
                                <p className="text-xs text-slate-500">Đã chọn: {selectedFileNames}</p>
                            ) : null}
                        </label>

                        <button
                            type="submit"
                            className="w-full rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-65"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Đang gửi báo cáo..." : "Gửi báo cáo"}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
