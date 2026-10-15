import React from 'react';
import { RoadStatus } from '../types';
import { AlertCircle, HelpCircle, CheckCircle2, Lock, AlertTriangle, XCircle } from 'lucide-react';

interface StatusSummaryProps {
  statusCounts: Record<RoadStatus | '全部', number>;
  selectedStatus: RoadStatus | '全部';
  onSelectStatus: (status: RoadStatus | '全部') => void;
  totalOfficialCount: number;
}

export const StatusSummary: React.FC<StatusSummaryProps> = ({
  statusCounts,
  selectedStatus,
  onSelectStatus,
  totalOfficialCount,
}) => {
  const statusConfig: {
    key: RoadStatus | '全部';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    accentClass: string;
    badgeClass: string;
  }[] = [
    {
      key: '全部',
      label: '全部林道',
      icon: HelpCircle,
      accentClass: 'border-slate-700 bg-slate-900/70 text-slate-200',
      badgeClass: 'bg-slate-800 text-slate-300',
    },
    {
      key: '未確認',
      label: '未確認',
      icon: AlertCircle,
      accentClass: 'border-amber-600/60 bg-amber-950/30 text-amber-300',
      badgeClass: 'bg-amber-900/60 text-amber-200 border border-amber-700/60',
    },
    {
      key: '全線暢通',
      label: '全線暢通',
      icon: CheckCircle2,
      accentClass: 'border-emerald-600/60 bg-emerald-950/20 text-emerald-300',
      badgeClass: 'bg-emerald-900/50 text-emerald-200 border border-emerald-700/60',
    },
    {
      key: '管制通行',
      label: '管制通行',
      icon: Lock,
      accentClass: 'border-blue-600/60 bg-blue-950/20 text-blue-300',
      badgeClass: 'bg-blue-900/50 text-blue-200 border border-blue-700/60',
    },
    {
      key: '預警性封閉',
      label: '預警性封閉',
      icon: AlertTriangle,
      accentClass: 'border-orange-600/60 bg-orange-950/20 text-orange-300',
      badgeClass: 'bg-orange-900/50 text-orange-200 border border-orange-700/60',
    },
    {
      key: '災損封閉',
      label: '災損封閉',
      icon: XCircle,
      accentClass: 'border-rose-600/60 bg-rose-950/20 text-rose-300',
      badgeClass: 'bg-rose-900/50 text-rose-200 border border-rose-700/60',
    },
  ];

  return (
    <section className="mb-6">
      {/* Notice box */}
      <div className="mb-4 rounded-xl border border-amber-900/50 bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-slate-900 p-4 text-xs sm:text-sm text-amber-200/90 flex items-start gap-3 shadow-md">
        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-amber-300">
            官方林道狀態聲明（農業部林業及自然保育署 83 條列管清單）
          </p>
          <p className="text-amber-200/80 leading-relaxed">
            本工具僅收錄林業及自然保育署官方列管之 83 條林道，堅持「不生成假資料、不自行判斷路況」原則。現階段所有林道之開放狀態、可通行里程與官方電話均預設標示為「未確認」或「—」，入山前請向各管理分署詳查最新現地通報。
          </p>
        </div>
      </div>

      {/* Status chips grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {statusConfig.map((item) => {
          const isSelected = selectedStatus === item.key;
          const count = statusCounts[item.key] ?? 0;
          const Icon = item.icon;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onSelectStatus(item.key)}
              className={`text-left p-3 rounded-xl border transition-all duration-150 flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'ring-2 ring-emerald-400 border-emerald-500 bg-slate-800 shadow-md'
                  : 'hover:border-slate-600 border-slate-800 bg-slate-900/80 hover:bg-slate-850'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5 truncate">
                  <Icon className="w-3.5 h-3.5 shrink-0 opacity-80" />
                  {item.label}
                </span>
                {item.key === '全部' && (
                  <span className="text-[10px] text-slate-500 font-mono">共 {totalOfficialCount} 條</span>
                )}
              </div>
              <div className="flex items-baseline justify-between">
                <span
                  className={`text-xl font-bold font-mono tracking-tight ${
                    item.key === '未確認' && count > 0
                      ? 'text-amber-400'
                      : isSelected
                      ? 'text-emerald-400'
                      : 'text-slate-200'
                  }`}
                >
                  {count}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">條</span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
