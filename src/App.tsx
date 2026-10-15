import React, { useState, useMemo, useEffect } from 'react';
import { FOREST_ROADS_DATA, BRANCH_LIST, STATUS_LIST, BranchName, RoadStatus } from './data/forestRoads';
import { Header } from './components/Header';
import { StatusSummary } from './components/StatusSummary';
import { FilterBar } from './components/FilterBar';
import { RoadCard } from './components/RoadCard';
import { Footer } from './components/Footer';
import { SearchX, ArrowUp } from 'lucide-react';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBranch, setSelectedBranch] = useState<BranchName | '全部'>('全部');
  const [selectedStatus, setSelectedStatus] = useState<RoadStatus | '全部'>('全部');
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  // Toggle dark mode class on html tag
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Track window scroll for back to top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Compute status counts for the top status cards based on current branch/search or all
  const statusCounts = useMemo(() => {
    // When computing status breakdown, let's look at the roads filtered by branch & search (so status chip shows relevant count)
    const baseList = FOREST_ROADS_DATA.filter((road) => {
      const matchBranch = selectedBranch === '全部' || road.branch === selectedBranch;
      const matchSearch =
        !searchQuery.trim() ||
        road.name.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
        road.startLocation.toLowerCase().includes(searchQuery.trim().toLowerCase());
      return matchBranch && matchSearch;
    });

    const counts: Record<RoadStatus | '全部', number> = {
      全部: baseList.length,
      未確認: 0,
      全線暢通: 0,
      預警性封閉: 0,
      災損封閉: 0,
      管制通行: 0,
    };

    baseList.forEach((road) => {
      counts[road.status] = (counts[road.status] || 0) + 1;
    });

    return counts;
  }, [selectedBranch, searchQuery]);

  // Compute branch counts for the filter chips
  const branchCounts = useMemo(() => {
    const counts: Record<BranchName | '全部', number> = {
      全部: FOREST_ROADS_DATA.length,
      宜蘭分署: 0,
      新竹分署: 0,
      臺中分署: 0,
      南投分署: 0,
      嘉義分署: 0,
      屏東分署: 0,
      臺東分署: 0,
      花蓮分署: 0,
    };

    FOREST_ROADS_DATA.forEach((road) => {
      counts[road.branch] = (counts[road.branch] || 0) + 1;
    });

    return counts;
  }, []);

  // Filtered roads list
  const filteredRoads = useMemo(() => {
    return FOREST_ROADS_DATA.filter((road) => {
      // Branch filter
      if (selectedBranch !== '全部' && road.branch !== selectedBranch) {
        return false;
      }

      // Status filter
      if (selectedStatus !== '全部' && road.status !== selectedStatus) {
        return false;
      }

      // Search query (matches road name or start location)
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchesName = road.name.toLowerCase().includes(query);
        const matchesStart = road.startLocation.toLowerCase().includes(query);
        if (!matchesName && !matchesStart) {
          return false;
        }
      }

      return true;
    });
  }, [selectedBranch, selectedStatus, searchQuery]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedBranch('全部');
    setSelectedStatus('全部');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
      }`}
    >
      {/* Top Header */}
      <Header darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} />

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        {/* Brand Banner / Subtitle */}
        <div className="mb-6 pb-4 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              林業及自然保育署 83 條官方列管林道
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              由亞馬遜國家山岳協會彙整維護。依據官方查驗原則，當前狀態均嚴格列為「未確認」，杜絕虛構路況。
            </p>
          </div>
          <div className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 shrink-0 self-start sm:self-auto">
            全台官方林道：<strong className="text-emerald-400">{FOREST_ROADS_DATA.length}</strong> 條
          </div>
        </div>

        {/* Status Summary Section */}
        <StatusSummary
          statusCounts={statusCounts}
          selectedStatus={selectedStatus}
          onSelectStatus={setSelectedStatus}
          totalOfficialCount={FOREST_ROADS_DATA.length}
        />

        {/* Filter and Search Bar */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedBranch={selectedBranch}
          onSelectBranch={setSelectedBranch}
          selectedStatus={selectedStatus}
          onSelectStatus={setSelectedStatus}
          branchCounts={branchCounts}
          onResetFilters={handleResetFilters}
          totalFilteredCount={filteredRoads.length}
        />

        {/* Road Cards Grid */}
        {filteredRoads.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredRoads.map((road) => (
              <RoadCard key={road.id} road={road} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center bg-slate-900/30">
            <SearchX className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-300">
              找不到符合條件的林道
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              目前篩選條件下無符合之官方林道，請嘗試清除關鍵字搜尋或更換分署別。
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              重設所有篩選
            </button>
          </div>
        )}
      </main>

      {/* Back to top button */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="回到頂端"
          className="fixed bottom-6 right-6 p-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/60 z-30 transition-all cursor-pointer border border-emerald-400/40"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
