"use client";

import { useEffect, useMemo, useState } from "react";

import L from "leaflet";
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from "react-leaflet";

import type { MapPoint, ReliefReport } from "../types";

type RouteSummary = {
    coordinates: [number, number][];
    distanceKm: number;
    durationMinutes: number;
};

type OsrmRouteResponse = {
    routes?: Array<{
        distance?: number;
        duration?: number;
        geometry?: {
            coordinates?: [number, number][];
        };
    }>;
};

function createMarkerIcon(color: string, label: string) {
    return L.divIcon({
        className: "",
        html: `
      <div style="display:grid;place-items:center;">
        <div style="width:18px;height:18px;border-radius:999px;background:${color};box-shadow:0 0 0 8px color-mix(in srgb, ${color} 18%, transparent);border:2px solid white;"></div>
        <div style="margin-top:6px;padding:4px 8px;border-radius:999px;background:rgba(15,23,42,0.88);color:white;font-size:11px;font-weight:700;line-height:1;white-space:nowrap;box-shadow:0 12px 24px rgba(15,23,42,0.18);">${label}</div>
      </div>
    `,
        iconSize: [96, 50],
        iconAnchor: [48, 36],
    });
}

function toPoint(value: number | string | null | undefined): number | null {
    if (value === null || value === undefined) {
        return null;
    }

    const numericValue = typeof value === "string" ? Number(value) : value;
    return Number.isFinite(numericValue) ? numericValue : null;
}

function isLocationInVietnam(lat: number, lng: number): boolean {
    // Việt Nam bounds: roughly between 8.5°N - 23.4°N (latitude) and 102.1°E - 109.6°E (longitude)
    const VIETNAM_BOUNDS = {
        minLat: 8.0,
        maxLat: 23.5,
        minLng: 101.8,
        maxLng: 109.7,
    };

    return (
        lat >= VIETNAM_BOUNDS.minLat &&
        lat <= VIETNAM_BOUNDS.maxLat &&
        lng >= VIETNAM_BOUNDS.minLng &&
        lng <= VIETNAM_BOUNDS.maxLng
    );
}

function FitBounds({ points }: { points: Array<[number, number]> }) {
    const map = useMap();

    useEffect(() => {
        if (points.length > 0) {
            map.fitBounds(points, { padding: [56, 56], maxZoom: 16 });
        }
    }, [map, points]);

    return null;
}

export default function ReliefRouteMap({ report }: { report: ReliefReport | null }) {
    const destination = useMemo<MapPoint | null>(() => {
        const lat = toPoint(report?.lat);
        const lng = toPoint(report?.lng);

        if (lat === null || lng === null) {
            return null;
        }

        if (!isLocationInVietnam(lat, lng)) {
            return null;
        }

        return { lat, lng };
    }, [report?.lat, report?.lng]);

    const [origin, setOrigin] = useState<MapPoint | null>(null);
    const [routeSummary, setRouteSummary] = useState<RouteSummary | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("Đang chờ vị trí hiện tại...");
    const [routeError, setRouteError] = useState<string | null>(null);

    useEffect(() => {
        setRouteSummary(null);
        setRouteError(null);

        if (!destination) {
            setOrigin(null);
            setMessage("Báo cáo này chưa có tọa độ để dựng tuyến đường.");
            return;
        }

        if (typeof navigator === "undefined" || !navigator.geolocation) {
            setOrigin(null);
            setMessage("Thiết bị không hỗ trợ định vị.");
            return;
        }

        setIsLoading(true);
        setMessage("Đang xác định vị trí hiện tại...");

        let isActive = true;

        navigator.geolocation.getCurrentPosition(
            (position) => {
                if (!isActive) {
                    return;
                }

                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                if (!isLocationInVietnam(lat, lng)) {
                    setOrigin(null);
                    setMessage("Vị trí hiện tại nằm ngoài lãnh thổ Việt Nam, chỉ hiển thị điểm báo cáo.");
                    setIsLoading(false);
                    return;
                }

                setOrigin({ lat, lng });
                setMessage("Đã lấy được vị trí hiện tại.");
            },
            () => {
                if (!isActive) {
                    return;
                }

                setOrigin(null);
                setMessage("Chưa cấp quyền định vị nên chỉ hiển thị điểm báo cáo.");
                setIsLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 12000,
                maximumAge: 15000,
            },
        );

        return () => {
            isActive = false;
        };
    }, [destination]);

    useEffect(() => {
        if (!origin || !destination) {
            setIsLoading(false);
            return;
        }

        const currentOrigin = origin;
        const currentDestination = destination;
        let isActive = true;

        async function loadRoute() {
            try {
                setIsLoading(true);
                const response = await fetch(
                    `https://router.project-osrm.org/route/v1/driving/${currentOrigin.lng},${currentOrigin.lat};${currentDestination.lng},${currentDestination.lat}?overview=full&geometries=geojson`,
                    { cache: "no-store" },
                );

                const data: OsrmRouteResponse = await response.json().catch(() => ({}));

                if (!response.ok) {
                    throw new Error("Không thể tải tuyến đường từ OSM.");
                }

                const firstRoute = data.routes?.[0];
                if (!firstRoute) {
                    throw new Error("Không tìm thấy tuyến đường phù hợp.");
                }

                const coordinates = firstRoute.geometry?.coordinates ?? [];
                if (coordinates.length === 0) {
                    throw new Error("Không tìm thấy tuyến đường phù hợp.");
                }

                // Validate all route points are within Vietnam
                const allPointsInVietnam = coordinates.every(([lng, lat]) =>
                    isLocationInVietnam(lat, lng)
                );
                if (!allPointsInVietnam) {
                    throw new Error("Tuyến đường vượt ra ngoài lãnh thổ Việt Nam.");
                }

                if (!isActive) {
                    return;
                }

                setRouteSummary({
                    coordinates: coordinates.map(([lng, lat]) => [lat, lng]),
                    distanceKm: (firstRoute.distance ?? 0) / 1000,
                    durationMinutes: (firstRoute.duration ?? 0) / 60,
                });
                setRouteError(null);
            } catch (error) {
                if (!isActive) {
                    return;
                }

                setRouteSummary(null);
                setRouteError(error instanceof Error ? error.message : "Không thể tải tuyến đường.");
            } finally {
                if (isActive) {
                    setIsLoading(false);
                }
            }
        }

        void loadRoute();

        return () => {
            isActive = false;
        };
    }, [destination, origin]);

    const mapCenter = useMemo<[number, number]>(() => {
        if (origin) {
            return [origin.lat, origin.lng];
        }

        if (destination) {
            return [destination.lat, destination.lng];
        }

        return [16.047079, 108.20623];
    }, [destination, origin]);

    if (!destination) {
        const reportLat = toPoint(report?.lat);
        const reportLng = toPoint(report?.lng);
        const hasCoordinates = reportLat !== null && reportLng !== null;
        const isOutsideVietnam = hasCoordinates && !isLocationInVietnam(reportLat, reportLng);

        return (
            <div className="grid h-full min-h-[420px] place-items-center rounded-[1.75rem] border border-slate-200 bg-slate-50 px-6 text-center text-slate-600">
                <div className="max-w-sm">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">OpenStreetMap</p>
                    <p className="mt-3 text-lg font-semibold text-slate-900">
                        {isOutsideVietnam
                            ? "Tọa độ báo cáo nằm ngoài lãnh thổ Việt Nam."
                            : "Báo cáo này chưa có tọa độ để dựng tuyến đường."}
                    </p>
                </div>
            </div>
        );
    }

    const bounds = [
        [destination.lat, destination.lng] as [number, number],
        ...(origin ? ([[origin.lat, origin.lng] as [number, number]] as Array<[number, number]>) : []),
    ];

    return (
        <div className="grid gap-4">
            <div className="rounded-[1.35rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                <p className="font-semibold text-slate-900">Trạng thái định tuyến</p>
                <p className="mt-1 leading-6">{message}</p>
                {routeError ? <p className="mt-2 font-semibold text-rose-600">{routeError}</p> : null}
                {routeSummary ? (
                    <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold text-slate-700">
                        <span className="rounded-full bg-white px-3 py-1.5 shadow-sm">Quãng đường {routeSummary.distanceKm.toFixed(1)} km</span>
                        <span className="rounded-full bg-white px-3 py-1.5 shadow-sm">Thời gian {Math.max(1, Math.round(routeSummary.durationMinutes))} phút</span>
                    </div>
                ) : null}
            </div>

            <div className="relative h-[440px] overflow-hidden rounded-[1.75rem] border border-slate-200 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
                <MapContainer center={mapCenter} zoom={13} scrollWheelZoom={false} className="h-full w-full">
                    <TileLayer
                        attribution="&copy; OpenStreetMap contributors"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <Marker position={[destination.lat, destination.lng]} icon={createMarkerIcon("#f59e0b", "Điểm báo cáo")}>
                        <Popup>
                            <div className="grid gap-1 text-sm">
                                <strong>Điểm báo cáo</strong>
                                <span>{report?.addressLine ?? "Chưa có địa chỉ chi tiết"}</span>
                                <span>
                                    {destination.lat.toFixed(5)}, {destination.lng.toFixed(5)}
                                </span>
                            </div>
                        </Popup>
                    </Marker>

                    {origin ? (
                        <Marker position={[origin.lat, origin.lng]} icon={createMarkerIcon("#0f766e", "Vị trí hiện tại")}>
                            <Popup>
                                <div className="grid gap-1 text-sm">
                                    <strong>Vị trí hiện tại</strong>
                                    <span>Điểm xuất phát của đội điều phối</span>
                                </div>
                            </Popup>
                        </Marker>
                    ) : null}

                    {routeSummary ? <Polyline positions={routeSummary.coordinates} pathOptions={{ color: "#0f766e", weight: 5, opacity: 0.9 }} /> : null}
                    <FitBounds points={bounds} />
                </MapContainer>

                {isLoading ? (
                    <div className="pointer-events-none absolute inset-0 grid place-items-center bg-white/20 backdrop-blur-[1px]">
                        <div className="rounded-full border border-white/40 bg-slate-950/80 px-4 py-2 text-sm font-semibold text-white shadow-lg">
                            Đang vẽ tuyến đường...
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
