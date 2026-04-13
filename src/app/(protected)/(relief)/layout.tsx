import type { ReactNode } from "react";

import { RoleSessionGate } from "@/features/auth/components/role-session-gate";

type ReliefProtectedLayoutProps = {
    children: ReactNode;
};

export default function ReliefProtectedLayout({ children }: ReliefProtectedLayoutProps) {
    return (
        <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.22),transparent_28%),radial-gradient(circle_at_top_right,_rgba(13,148,136,0.16),transparent_26%),linear-gradient(180deg,#f8fafc_0%,#e2e8f0_100%)] text-slate-950">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[linear-gradient(135deg,rgba(15,23,42,0.08),transparent_55%)]" />
            <div className="pointer-events-none absolute -left-28 top-28 h-80 w-80 rounded-full bg-sky-300/30 blur-3xl" />
            <div className="pointer-events-none absolute right-[-5rem] top-1/3 h-96 w-96 rounded-full bg-teal-300/20 blur-3xl" />

            <RoleSessionGate allowedRole="relief" redirectTo="/dang-nhap" mode="protected">
                <main className="relative min-h-screen">{children}</main>
            </RoleSessionGate>
        </div>
    );
}
