"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { clearAuthTokens, getAuthIdentity } from "@/features/auth/lib/auth-storage";

type RoleSessionGateProps = {
    children: ReactNode;
    allowedRole: string;
    redirectTo: string;
    mode: "protected" | "public";
};

function GateFallback() {
    return (
        <div className="grid min-h-screen place-items-center px-6 text-slate-200">
            <div className="max-w-md rounded-3xl border border-white/10 bg-white/5 px-6 py-5 text-center shadow-[0_18px_60px_rgba(15,23,42,0.2)] backdrop-blur">
                <p className="text-sm uppercase tracking-[0.28em] text-slate-400">
                    VietFlood Insight
                </p>
                <p className="mt-3 text-base font-semibold text-white">
                    Đang kiểm tra phiên đăng nhập...
                </p>
            </div>
        </div>
    );
}

export function RoleSessionGate({
    children,
    allowedRole,
    redirectTo,
    mode,
}: RoleSessionGateProps) {
    const router = useRouter();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const identity = getAuthIdentity();
        const normalizedRole = identity?.role?.trim().toLowerCase() ?? null;
        const normalizedAllowedRole = allowedRole.trim().toLowerCase();

        if (mode === "protected") {
            if (!identity || normalizedRole !== normalizedAllowedRole) {
                clearAuthTokens();
                router.replace(redirectTo);
                return;
            }

            queueMicrotask(() => setIsReady(true));
            return;
        }

        if (identity && normalizedRole === normalizedAllowedRole) {
            router.replace(redirectTo);
            return;
        }

        if (identity && normalizedRole !== normalizedAllowedRole) {
            clearAuthTokens();
        }

        queueMicrotask(() => setIsReady(true));
    }, [allowedRole, mode, redirectTo, router]);

    if (!isReady) {
        return <GateFallback />;
    }

    return <>{children}</>;
}
