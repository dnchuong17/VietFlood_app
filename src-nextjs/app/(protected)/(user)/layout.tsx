import type { ReactNode } from "react";

import { SiteHeader } from "@/components/navigation/site-header";

type UserProtectedLayoutProps = {
    children: ReactNode;
};

export default function UserProtectedLayout({ children }: UserProtectedLayoutProps) {
    return (
        <div className="relative h-screen overflow-hidden">
            <div className="absolute inset-x-0 top-0 z-40">
                <SiteHeader />
            </div>
            <main className="h-full">{children}</main>
        </div>
    );
}
