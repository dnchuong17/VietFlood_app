"use client";

import { useState } from "react";

import { ReportCreateForm } from "./report-create-form";
import { ReportHistoryView } from "./report-history-view";

type ReportTab = "create" | "history";

const TAB_LABELS: Record<ReportTab, string> = {
    create: "Gửi báo cáo",
    history: "Lịch sử báo cáo",
};

export function ReportTabsView() {
    const [activeTab, setActiveTab] = useState<ReportTab>("create");

    return (
        <div className="relative h-full">
            {activeTab === "create" ? <ReportCreateForm /> : <ReportHistoryView />}

            <div className="pointer-events-none absolute inset-x-0 bottom-4 z-30 flex justify-center px-4">
                <div className="pointer-events-auto inline-flex items-center gap-1.5 rounded-2xl border border-slate-200/90 bg-white/92 p-1.5 shadow-[0_14px_30px_-20px_rgba(2,132,199,0.75)] backdrop-blur-md">
                    {(Object.keys(TAB_LABELS) as ReportTab[]).map((tab) => {
                        const isActive = tab === activeTab;

                        return (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => setActiveTab(tab)}
                                className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition sm:text-sm ${isActive
                                    ? "bg-sky-600 text-white shadow-sm"
                                    : "text-slate-600 hover:bg-slate-100"
                                    }`}
                            >
                                {TAB_LABELS[tab]}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
