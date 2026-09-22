// ==============================================================================
// I-CAN PLATFORM — STUDENT GREEN ACTIVITY MONITOR (TIMEFRAME FILTERED)
// Tracks student green actions across Week, Month, and Year with visual charts
// ==============================================================================

import React, { useState, useMemo } from 'react';
import {
  Activity,
  Calendar,
  Filter,
  CheckCircle2,
  Clock,
  Award,
  GraduationCap,
  Users,
  Leaf,
  BarChart2,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { GreenAction } from '@/types';

interface StudentGreenActivityMonitorProps {
  actions: GreenAction[];
}

type TimeframeOption = 'WEEK' | 'MONTH' | 'YEAR';

export const StudentGreenActivityMonitor: React.FC<StudentGreenActivityMonitorProps> = ({
  actions,
}) => {
  const [timeframe, setTimeframe] = useState<TimeframeOption>('MONTH');
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  // Hitung rentang waktu berdasarkan filter
  const timeframeFilter = useMemo(() => {
    const now = new Date();
    let startDate: Date;
    let label: string;

    if (timeframe === 'WEEK') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      label = '7 Hari Terakhir (Mingguan)';
    } else if (timeframe === 'MONTH') {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      label = '30 Hari Terakhir (Bulanan)';
    } else {
      // 365 hari terakhir / tahun kalender
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      label = '1 Tahun Terakhir (Tahunan)';
    }

    return { startDate, label };
  }, [timeframe]);

  // Aksi yang terhitung dalam timeframe
  const filteredActions = useMemo(() => {
    const startMs = timeframeFilter.startDate.getTime();
    return actions.filter((act) => {
      if (!act.submittedAt) return false;
      const actTime = new Date(act.submittedAt).getTime();
      return actTime >= startMs;
    });
  }, [actions, timeframeFilter.startDate]);

  // Metrik Teragregasi dalam Timeframe
  const metrics = useMemo(() => {
    const total = filteredActions.length;
    const verified = filteredActions.filter((a) => a.status === 'APPROVED').length;
    const pending = filteredActions.filter((a) => a.status === 'PENDING').length;
    const rejected = filteredActions.filter((a) => a.status === 'REJECTED').length;

    const co2SavedKg = filteredActions
      .filter((a) => a.status === 'APPROVED')
      .reduce((sum, a) => sum + (a.carbonImpactKg || 0), 0);

    const comservHoursEarned = filteredActions
      .filter((a) => a.status === 'APPROVED' && a.decision === 'APPROVED_FULL')
      .reduce((sum, a) => sum + (a.comservHoursEarned || 0), 0);

    const greenCoinsEarned = filteredActions
      .filter((a) => a.status === 'APPROVED')
      .reduce((sum, a) => sum + (a.greenCoinsEarned || 0), 0);

    // Hitung mahasiswa unik yang aktif
    const uniqueUserIds = new Set(filteredActions.map((a) => a.userId));
    const activeStudentsCount = uniqueUserIds.size;

    return {
      total,
      verified,
      pending,
      rejected,
      co2SavedKg: Number(co2SavedKg.toFixed(1)),
      comservHoursEarned,
      greenCoinsEarned,
      activeStudentsCount,
    };
  }, [filteredActions]);

  // Data Seri untuk Visual Chart (Clean SVG Bars)
  const chartSeries = useMemo(() => {
    const now = new Date();

    if (timeframe === 'WEEK') {
      // 7 hari terakhir: buat 7 bucket harian
      const days: { label: string; dateStr: string; total: number; verified: number; co2: number }[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dayKey = d.toISOString().split('T')[0];
        const dayLabel = d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' });

        const matches = filteredActions.filter((a) => a.submittedAt?.startsWith(dayKey));
        const verifiedMatches = matches.filter((a) => a.status === 'APPROVED');
        const co2 = verifiedMatches.reduce((sum, a) => sum + (a.carbonImpactKg || 0), 0);

        days.push({
          label: dayLabel,
          dateStr: dayKey,
          total: matches.length,
          verified: verifiedMatches.length,
          co2: Number(co2.toFixed(1)),
        });
      }
      return days;
    } else if (timeframe === 'MONTH') {
      // 4 minggu dalam sebulan: buat 4 bucket per 7 hari
      const weeks: { label: string; dateStr: string; total: number; verified: number; co2: number }[] = [];
      for (let w = 3; w >= 0; w--) {
        const endDay = new Date(now.getTime() - w * 7 * 24 * 60 * 60 * 1000);
        const startDay = new Date(endDay.getTime() - 7 * 24 * 60 * 60 * 1000);

        const matches = filteredActions.filter((a) => {
          if (!a.submittedAt) return false;
          const t = new Date(a.submittedAt).getTime();
          return t >= startDay.getTime() && t <= endDay.getTime();
        });
        const verifiedMatches = matches.filter((a) => a.status === 'APPROVED');
        const co2 = verifiedMatches.reduce((sum, a) => sum + (a.carbonImpactKg || 0), 0);

        weeks.push({
          label: `Minggu ${4 - w}`,
          dateStr: `${startDay.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} - ${endDay.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}`,
          total: matches.length,
          verified: verifiedMatches.length,
          co2: Number(co2.toFixed(1)),
        });
      }
      return weeks;
    } else {
      // 12 bulan dalam setahun
      const months: { label: string; dateStr: string; total: number; verified: number; co2: number }[] = [];
      for (let m = 11; m >= 0; m--) {
        const d = new Date(now.getFullYear(), now.getMonth() - m, 1);
        const year = d.getFullYear();
        const month = d.getMonth();
        const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
        const monthLabel = d.toLocaleDateString('id-ID', { month: 'short' });

        const matches = filteredActions.filter((a) => a.submittedAt?.startsWith(monthPrefix));
        const verifiedMatches = matches.filter((a) => a.status === 'APPROVED');
        const co2 = verifiedMatches.reduce((sum, a) => sum + (a.carbonImpactKg || 0), 0);

        months.push({
          label: monthLabel,
          dateStr: `${d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}`,
          total: matches.length,
          verified: verifiedMatches.length,
          co2: Number(co2.toFixed(1)),
        });
      }
      return months;
    }
  }, [timeframe, filteredActions]);

  // Max value untuk skala tinggi chart SVG
  const maxBarValue = useMemo(() => {
    const maxVal = Math.max(...chartSeries.map((s) => s.total), 1);
    return Math.ceil(maxVal * 1.15);
  }, [chartSeries]);

  // Distribusi Kategori Aksi Mahasiswa dalam Timeframe
  const categoryBreakdown = useMemo(() => {
    const map = new Map<string, { count: number; co2: number }>();
    filteredActions.forEach((a) => {
      const cat = a.categoryName || 'Aksi Hijau Lainnya';
      const existing = map.get(cat) || { count: 0, co2: 0 };
      existing.count += 1;
      if (a.status === 'APPROVED') {
        existing.co2 += (a.carbonImpactKg || 0);
      }
      map.set(cat, existing);
    });

    const list = Array.from(map.entries()).map(([name, val]) => ({
      name,
      count: val.count,
      co2: Number(val.co2.toFixed(1)),
      percentage: metrics.total > 0 ? Math.round((val.count / metrics.total) * 100) : 0,
    }));

    return list.sort((a, b) => b.count - a.count);
  }, [filteredActions, metrics.total]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-6">
      {/* Header Monitor dengan Timeframe Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Monitor Aktivitas Hijau Mahasiswa (Green Action Activity)
              </h2>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                Live Data
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Pantau volume pengajuan aksi mahasiswa, verifikasi TFI, dan reduksi emisi karbon per rentang waktu
            </p>
          </div>
        </div>

        {/* Filter Timeframe Buttons */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200/80 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setTimeframe('WEEK')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
              timeframe === 'WEEK'
                ? 'bg-[#007bff] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Minggu (7 Hari)
          </button>
          <button
            type="button"
            onClick={() => setTimeframe('MONTH')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
              timeframe === 'MONTH'
                ? 'bg-[#007bff] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Bulan (30 Hari)
          </button>
          <button
            type="button"
            onClick={() => setTimeframe('YEAR')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
              timeframe === 'YEAR'
                ? 'bg-[#007bff] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tahun (12 Bulan)
          </button>
        </div>
      </div>

      {/* Ringkasan Metrik dalam Timeframe */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Total Pengajuan Aksi
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {metrics.total}
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            Dalam {timeframeFilter.label}
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Aksi Disetujui (TFI)
          </span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-800">
            {metrics.verified}
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            <span className="text-amber-700 font-bold">{metrics.pending} pending</span> verifikasi
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Reduksi CO2e Ditekan
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {metrics.co2SavedKg} <span className="text-sm font-bold text-slate-500">kg</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            Dampak iklim terukur resmi
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Jam Comserv TFI Terverifikasi
          </span>
          <div className="text-2xl sm:text-3xl font-black text-blue-900">
            {metrics.comservHoursEarned} <span className="text-sm font-bold text-slate-500">Jam</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            +{metrics.greenCoinsEarned} Green Coins
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 col-span-2 lg:col-span-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Mahasiswa Aktif
          </span>
          <div className="text-2xl sm:text-3xl font-black text-purple-900">
            {metrics.activeStudentsCount}
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            Partisipan unik semester ini
          </p>
        </div>
      </div>

      {/* Visual Chart & Breakdown Kategori */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Visual Activity Bar Chart (Responsive SVG Bar) */}
        <div className="lg:col-span-2 p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-[#007bff]" />
              <h3 className="text-xs font-black text-slate-900">
                Tren Volume Aksi Mahasiswa ({timeframeFilter.label})
              </h3>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-bold text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#007bff]" />
                <span>Semua Aksi</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
                <span>Disetujui</span>
              </div>
            </div>
          </div>

          {/* SVG Bar Chart Area */}
          <div className="relative pt-6 pb-2">
            {/* Hover Tooltip Box */}
            {hoveredBarIndex !== null && chartSeries[hoveredBarIndex] && (
              <div className="absolute top-0 right-2 bg-slate-900 text-white text-[11px] px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-3 z-10 font-medium animate-in fade-in duration-150">
                <span className="font-bold text-cyan-300">{chartSeries[hoveredBarIndex].dateStr}</span>
                <span>Total: <strong className="text-white">{chartSeries[hoveredBarIndex].total}</strong> aksi</span>
                <span>Disetujui: <strong className="text-emerald-300">{chartSeries[hoveredBarIndex].verified}</strong></span>
                <span>CO2: <strong className="text-amber-300">{chartSeries[hoveredBarIndex].co2} kg</strong></span>
              </div>
            )}

            {/* Bars Container */}
            <div className="h-44 flex items-end justify-between gap-2 sm:gap-3 px-2 border-b border-slate-200">
              {chartSeries.map((item, index) => {
                const totalHeightPct = Math.min(100, Math.round((item.total / maxBarValue) * 100));
                const verifiedHeightPct = item.total > 0 ? Math.min(100, Math.round((item.verified / maxBarValue) * 100)) : 0;
                const isHovered = hoveredBarIndex === index;

                return (
                  <div
                    key={item.label + index}
                    onMouseEnter={() => setHoveredBarIndex(index)}
                    onMouseLeave={() => setHoveredBarIndex(null)}
                    className="flex-1 h-full flex flex-col justify-end items-center group cursor-pointer relative"
                  >
                    <div className="w-full max-w-[32px] flex items-end justify-center gap-0.5 h-full">
                      {/* Bar Total Aksi */}
                      <div
                        style={{ height: `${Math.max(totalHeightPct, 4)}%` }}
                        className={`w-1/2 rounded-t-md transition-all ${
                          isHovered ? 'bg-[#0069d9]' : 'bg-[#007bff]/80 hover:bg-[#007bff]'
                        }`}
                      />
                      {/* Bar Aksi Disetujui */}
                      <div
                        style={{ height: `${Math.max(verifiedHeightPct, item.verified > 0 ? 4 : 0)}%` }}
                        className={`w-1/2 rounded-t-md transition-all ${
                          isHovered ? 'bg-emerald-600' : 'bg-emerald-500/85 hover:bg-emerald-500'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* X-Axis Labels */}
            <div className="flex items-center justify-between gap-2 sm:gap-3 px-2 pt-2 text-[10px] sm:text-[11px] font-bold text-slate-500">
              {chartSeries.map((item, idx) => (
                <div key={item.label + idx} className="flex-1 text-center truncate">
                  {item.label}
                </div>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-slate-500 font-medium">
            Arahkan kursor pada batang grafik untuk melihat rincian tanggal, aksi terverifikasi, dan kalkulasi emisi karbon.
          </p>
        </div>

        {/* Breakdown Kategori Aksi Mahasiswa */}
        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="text-xs font-black text-slate-900">
                Proporsi Kategori Aksi Hijau
              </h3>
              <span className="text-[11px] font-bold text-slate-500">{categoryBreakdown.length} Kategori</span>
            </div>

            {categoryBreakdown.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 space-y-1">
                <Leaf className="w-6 h-6 text-slate-400 mx-auto" />
                <p className="font-bold text-slate-700">Tidak ada aksi pada periode ini</p>
                <p className="text-[11px]">Mahasiswa belum mengunggah aksi hijau dalam timeframe ini</p>
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                {categoryBreakdown.slice(0, 5).map((cat, idx) => (
                  <div key={cat.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-800 line-clamp-1">{cat.name}</span>
                      <span className="text-slate-900 font-black shrink-0">{cat.count} aksi</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all"
                        style={{ width: `${cat.percentage}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                      <span>{cat.percentage}% dari total aksi</span>
                      <span className="text-emerald-700 font-bold">{cat.co2} kg CO2e</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 text-[11px] text-slate-600 font-medium flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Kategori terpopuler berkontribusi terhadap evaluasi BEKEN Award & Pemeringkatan Kampus Hijau.</span>
          </div>
        </div>
      </div>

      {/* Aktivitas Terkini Mahasiswa dalam Timeframe */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-black text-slate-900">
            Log Aktivitas Mahasiswa Terkini ({filteredActions.slice(0, 5).length} dari {filteredActions.length} Aksi)
          </h3>
          <span className="text-[11px] text-slate-500 font-bold">
            Periode: {timeframeFilter.label}
          </span>
        </div>

        {filteredActions.length === 0 ? (
          <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-500">
            Belum ada log aksi mahasiswa yang tercatat dalam timeframe {timeframeFilter.label.toLowerCase()}.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
            {filteredActions.slice(0, 5).map((act) => (
              <div key={act.id} className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-xs text-slate-700 shrink-0">
                    {act.userName ? act.userName.charAt(0) : 'M'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900">{act.userName || 'Mahasiswa BINUS'}</span>
                      <span className="text-[10px] text-slate-500 font-medium hidden sm:inline">
                        • {act.userFaculty || 'BINUS University'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium line-clamp-1">
                      {act.categoryName || 'Aksi Hijau'}
                      {act.story && ` : "${act.story}"`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 text-right">
                  <div className="hidden sm:block text-right">
                    <div className="text-xs font-black text-emerald-800">+{act.carbonImpactKg || 0} kg CO2e</div>
                    <div className="text-[10px] text-slate-400">
                      {new Date(act.submittedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    act.status === 'APPROVED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : act.status === 'PENDING'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {act.status === 'APPROVED' ? 'Disetujui' : act.status === 'PENDING' ? 'Menunggu' : 'Ditolak'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
