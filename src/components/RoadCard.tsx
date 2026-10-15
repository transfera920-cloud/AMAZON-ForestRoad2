import React, { useState } from 'react';
import { ForestRoad } from '../types';
import { MapPin, Phone, Gauge, Clock, ChevronDown, ChevronUp, AlertCircle, FileText } from 'lucide-react';

interface RoadCardProps {
  road: ForestRoad;
}

export const RoadCard: React.FC<RoadCardProps> = ({ road }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Subtle branch badge styling
  const branchColorMap: Record<string, string> = {
    宜蘭分署: 'bg-emerald-950/70 text-emerald-300 border-emerald-800/60',
    新竹分署: 'bg-teal-950/70 text-teal-300 border-teal-800/60',
    臺中分署: 'bg-cyan-950/70 text-cyan-300 border-cyan-800/60',
    南投分署: 'bg-lime-950/70 text-lime-300 border-lime-800/60',
    嘉義分署: 'bg-sky-950/70 text-sky-300 border-sky-800/60',
    屏東分署: 'bg-amber-950/70 text-amber-300 border-amber-800/60',
    臺東分署: 'bg-indigo-950/70 text-indigo-300 border-indigo-800/60',
    花蓮分署: 'bg-violet-950/70 text-violet-300 border-violet-800/60',
  };

  const branchBadgeClass =
    branchColorMap[road.branch] || 'bg-slate-800 text-slate-300 border-slate-700';

  return (
    <div
      onClick={() => setIsExpanded(!isExpanded)}
      className="group relative rounded-2xl border border-slate-800 bg-slate-900/90 hover:bg-slate-850 hover:border-slate-700 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md flex flex-col justify-between overflow-hidden"
    >
      {/* Top Header Section */}
      <div className="p-4 sm:p-5 pb-3">
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-[11px] font-semibold text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              #{String(road.id).padStart(2, '0')}
            </span>
            <span
              className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${branchBadgeClass}`}
            >
              {road.branch}
            </span>
          </div>

          {/* Status Badge */}
          <div className="shrink-0">
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-700/60 text-amber-300">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              {road.status}
            </span>
          </div>
        </div>

        {/* Road Name */}
        <h2 className="text-lg font-bold text-slate-100 group-hover:text-emerald-300 transition-colors tracking-tight">
          {road.name}
        </h2>
      </div>

      {/* Meta Information Grid */}
      <div className="px-4 sm:px-5 py-3 border-t border-b border-slate-800/70 bg-slate-950/40 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-300">
        {/* 起點位置 */}
        <div className="flex items-start gap-2">
          <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <span className="text-slate-500 block text-[11px]">起點位置</span>
            <span className="font-medium text-slate-200 truncate block">
              {road.startLocation}
            </span>
          </div>
        </div>

        {/* 可通行至幾公里 */}
        <div className="flex items-start gap-2">
          <Gauge className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-slate-500 block text-[11px]">可通行里程</span>
            <span className="font-medium text-slate-200">{road.passableMileage}</span>
          </div>
        </div>

        {/* 官方路況通報電話 */}
        <div className="flex items-start gap-2">
          <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-slate-500 block text-[11px]">官方通報電話</span>
            <span className="font-medium text-slate-200">{road.officialPhone}</span>
          </div>
        </div>

        {/* 最後更新時間 */}
        <div className="flex items-start gap-2">
          <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-slate-500 block text-[11px]">最後更新時間</span>
            <span className="font-medium text-slate-200">{road.lastUpdated}</span>
          </div>
        </div>
      </div>

      {/* Accordion Expand Action Bar */}
      <div className="px-4 sm:px-5 py-2.5 flex items-center justify-between text-xs text-slate-400 group-hover:text-slate-200 transition-colors">
        <span className="inline-flex items-center gap-1.5 font-medium">
          <FileText className="w-3.5 h-3.5 text-emerald-400" />
          {isExpanded ? '收合簡單說明' : '點擊查看簡單說明'}
        </span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-emerald-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
        )}
      </div>

      {/* Expanded Description Drawer */}
      {isExpanded && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="px-4 sm:px-5 py-3.5 bg-slate-950/80 border-t border-slate-800 text-xs text-slate-300 space-y-2 animate-fadeIn"
        >
          <div className="space-y-1">
            <h4 className="font-semibold text-emerald-400">林道概況說明</h4>
            <p className="text-slate-300/90 leading-relaxed">{road.description}</p>
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex items-start gap-1.5 text-[11px] text-slate-400">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400/80 shrink-0 mt-0.5" />
            <span>
              亞馬遜國家山岳協會提醒：山區林道易因降雨崩塌，入山前請務必向{road.branch}洽詢最新現地管制公告。
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
