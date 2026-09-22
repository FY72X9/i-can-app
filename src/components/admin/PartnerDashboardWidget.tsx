// ==============================================================================
// I-CAN PLATFORM — SDG 17 PARTNER DASHBOARD WIDGET & CHART
// Displays partnership counts, program counts, category distribution, & partner list
// ==============================================================================

import React, { useState, useMemo } from 'react';
import {
  Building2,
  FileText,
  Calendar,
  Users,
  Search,
  Filter,
  Plus,
  ExternalLink,
  ChevronRight,
  Eye,
  CheckCircle2,
  PieChart,
  BarChart3,
  Award
} from 'lucide-react';
import { Partner, PartnerCategory, PartnerStatus } from '@/types/partner';

interface PartnerDashboardWidgetProps {
  partners: Partner[];
  onAddPartner: () => void;
  onViewPartner: (partner: Partner) => void;
}

const CATEGORY_NAMES: Record<PartnerCategory, string> = {
  NGO: 'NGO & Yayasan',
  PRIVATE_CSR: 'Swasta / CSR BUMN',
  GOVERNMENT: 'Instansi Pemerintah',
  COMMUNITY: 'Komunitas Lokal',
  INTERNATIONAL: 'Badan Global',
};

const CATEGORY_COLORS: Record<PartnerCategory, string> = {
  NGO: '#10b981',        // Emerald
  PRIVATE_CSR: '#007bff', // BINUS Blue
  GOVERNMENT: '#f59e0b',  // Amber
  COMMUNITY: '#8b5cf6',   // Purple
  INTERNATIONAL: '#06b6d4', // Cyan
};

export const PartnerDashboardWidget: React.FC<PartnerDashboardWidgetProps> = ({
  partners,
  onAddPartner,
  onViewPartner,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Metrik Agregasi
  const totalPartners = partners.length;
  const activePartners = partners.filter((p) => p.status === 'ACTIVE').length;
  const totalPrograms = partners.reduce((sum, p) => sum + (p.programs?.length || 0), 0);
  const totalMoU = partners.reduce((sum, p) => sum + (p.documents?.filter((d) => d.status === 'ACTIVE').length || 0), 0);
  const totalTargetParticipants = partners.reduce((sum, p) => {
    return sum + (p.programs?.reduce((pSum, pr) => pSum + (pr.targetParticipants || 0), 0) || 0);
  }, 0);

  // Distribusi Sektor untuk Chart
  const categoryDistribution = useMemo(() => {
    const counts: Record<PartnerCategory, { count: number; programs: number }> = {
      NGO: { count: 0, programs: 0 },
      PRIVATE_CSR: { count: 0, programs: 0 },
      GOVERNMENT: { count: 0, programs: 0 },
      COMMUNITY: { count: 0, programs: 0 },
      INTERNATIONAL: { count: 0, programs: 0 },
    };

    partners.forEach((p) => {
      if (counts[p.category]) {
        counts[p.category].count += 1;
        counts[p.category].programs += (p.programs?.length || 0);
      }
    });

    return Object.entries(counts).map(([catKey, data]) => {
      const percentage = totalPartners > 0 ? Math.round((data.count / totalPartners) * 100) : 0;
      return {
        category: catKey as PartnerCategory,
        label: CATEGORY_NAMES[catKey as PartnerCategory],
        count: data.count,
        programs: data.programs,
        percentage,
        color: CATEGORY_COLORS[catKey as PartnerCategory],
      };
    });
  }, [partners, totalPartners]);

  // Status Program untuk Analisis
  const programStatusCounts = useMemo(() => {
    let ongoing = 0;
    let planning = 0;
    let completed = 0;

    partners.forEach((p) => {
      p.programs?.forEach((pr) => {
        if (pr.status === 'ONGOING') ongoing += 1;
        else if (pr.status === 'PLANNING') planning += 1;
        else if (pr.status === 'COMPLETED') completed += 1;
      });
    });

    return { ongoing, planning, completed, total: ongoing + planning + completed };
  }, [partners]);

  // Filtered Partners
  const filteredPartners = useMemo(() => {
    return partners.filter((p) => {
      if (categoryFilter !== 'ALL' && p.category !== categoryFilter) return false;
      if (statusFilter !== 'ALL' && p.status !== statusFilter) return false;

      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        return (
          p.name.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.contactPerson?.name?.toLowerCase().includes(query) ||
          p.cooperationScope?.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [partners, categoryFilter, statusFilter, searchTerm]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-6">
      {/* Header Segmen Kemitraan */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#007bff] shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                SDG 17: Kemitraan untuk Mencapai Tujuan (Partnership for the Goals)
              </h2>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-300">
                SSO & TFI
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Kelola legalitas kerjasama, dokumen MoU/MoA, dan program kolaborasi aksi hijau bersama mitra kampus
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onAddPartner}
          className="px-4 py-2.5 bg-[#007bff] hover:bg-[#0069d9] text-white rounded-xl text-xs font-black flex items-center gap-2 transition-all shadow-xs self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Mitra Baru</span>
        </button>
      </div>

      {/* 4 Kartu KPI Kemitraan */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Mitra Kerjasama</span>
            <Building2 className="w-4 h-4 text-[#007bff]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{totalPartners}</div>
          <p className="text-[11px] text-slate-500 font-medium">
            <span className="text-emerald-700 font-black">{activePartners} Aktif</span> dari total mitra terdaftar
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Program Dicanangkan</span>
            <Calendar className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{totalPrograms}</div>
          <p className="text-[11px] text-slate-500 font-medium">
            <span className="text-emerald-700 font-black">{programStatusCounts.ongoing} Berjalan</span> • {programStatusCounts.planning} Rencana
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Dokumen MoU/MoA Sah</span>
            <FileText className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{totalMoU} Berkas</div>
          <p className="text-[11px] text-slate-500 font-medium">
            Dokumen legalitas terverifikasi SSO
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Target Mahasiswa</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {totalTargetParticipants.toLocaleString('id-ID')}
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            Total kuota partisipasi aksi hijau
          </p>
        </div>
      </div>

      {/* Visual Charts: Distribusi Sektor & Status Program (Clean Antislop SVG Bar Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart 1: Distribusi Mitra Berdasarkan Sektor */}
        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#007bff]" />
              <h3 className="text-xs font-black text-slate-900">
                Distribusi Kategori Mitra Kerjasama (SDG 17)
              </h3>
            </div>
            <span className="text-[11px] text-slate-500 font-bold">{totalPartners} Mitra</span>
          </div>

          <div className="space-y-3">
            {categoryDistribution.map((item) => (
              <div key={item.category} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-sm"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-slate-800">{item.label}</span>
                  </div>
                  <div className="text-slate-600 text-[11px]">
                    <span className="font-black text-slate-900">{item.count} mitra</span>
                    <span className="text-slate-400 mx-1">•</span>
                    <span>{item.programs} program</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200/80 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.color,
                      minWidth: item.count > 0 ? '6px' : '0px',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Status Pelaksanaan Program Kolaborasi */}
        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <PieChart className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-black text-slate-900">
                  Status Program Kolaborasi Mitra
                </h3>
              </div>
              <span className="text-[11px] text-slate-500 font-bold">{totalPrograms} Program Total</span>
            </div>

            {/* Visual Stacked Progress Bar */}
            <div className="space-y-2">
              <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden flex">
                {programStatusCounts.total > 0 ? (
                  <>
                    <div
                      style={{ width: `${(programStatusCounts.ongoing / programStatusCounts.total) * 100}%` }}
                      className="bg-emerald-500 h-full transition-all"
                      title={`Sedang Berjalan: ${programStatusCounts.ongoing}`}
                    />
                    <div
                      style={{ width: `${(programStatusCounts.planning / programStatusCounts.total) * 100}%` }}
                      className="bg-[#007bff] h-full transition-all"
                      title={`Dalam Rencana: ${programStatusCounts.planning}`}
                    />
                    <div
                      style={{ width: `${(programStatusCounts.completed / programStatusCounts.total) * 100}%` }}
                      className="bg-slate-400 h-full transition-all"
                      title={`Selesai: ${programStatusCounts.completed}`}
                    />
                  </>
                ) : (
                  <div className="w-full h-full bg-slate-200" />
                )}
              </div>

              {/* Legend & Breakdown */}
              <div className="grid grid-cols-3 gap-2 pt-3">
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-0.5 text-center">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block mb-0.5" />
                  <div className="text-xs font-black text-emerald-900">{programStatusCounts.ongoing}</div>
                  <div className="text-[10px] text-slate-500 font-bold">Sedang Berjalan</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-0.5 text-center">
                  <span className="w-2 h-2 rounded-full bg-[#007bff] inline-block mb-0.5" />
                  <div className="text-xs font-black text-blue-900">{programStatusCounts.planning}</div>
                  <div className="text-[10px] text-slate-500 font-bold">Dalam Rencana</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-0.5 text-center">
                  <span className="w-2 h-2 rounded-full bg-slate-400 inline-block mb-0.5" />
                  <div className="text-xs font-black text-slate-800">{programStatusCounts.completed}</div>
                  <div className="text-[10px] text-slate-500 font-bold">Telah Terlaksana</div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 font-medium pt-2 border-t border-slate-200/80">
            Setiap program kolaborasi terintegrasi dengan validasi jam Comserv TFI dan reward Green Coins mahasiswa.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar untuk Daftar Mitra */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-xs sm:text-sm font-black text-slate-900">
              Daftar Mitra & Instansi Kolaborator ({filteredPartners.length})
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama mitra atau PIC..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 focus:border-[#007bff] text-xs font-medium outline-hidden"
              />
            </div>

            {/* Sektor Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-300 text-xs font-bold outline-hidden bg-white text-slate-700"
            >
              <option value="ALL">Semua Sektor</option>
              <option value="NGO">NGO & Yayasan</option>
              <option value="PRIVATE_CSR">Swasta / CSR</option>
              <option value="GOVERNMENT">Pemerintah</option>
              <option value="COMMUNITY">Komunitas</option>
              <option value="INTERNATIONAL">Internasional</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-300 text-xs font-bold outline-hidden bg-white text-slate-700"
            >
              <option value="ALL">Semua Status</option>
              <option value="ACTIVE">Aktif Sah</option>
              <option value="PENDING_RENEWAL">Perlu Renewal</option>
              <option value="COMPLETED">Selesai</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>
        </div>

        {/* Tabel / Kartu Daftar Mitra */}
        {filteredPartners.length === 0 ? (
          <div className="p-8 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-center space-y-2">
            <Building2 className="w-8 h-8 text-slate-400 mx-auto" />
            <h4 className="text-xs font-black text-slate-800">Tidak ada mitra ditemukan</h4>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
              {searchTerm || categoryFilter !== 'ALL' || statusFilter !== 'ALL'
                ? 'Coba sesuaikan kata kunci pencarian atau filter yang dipilih.'
                : 'Belum ada mitra kerjasama yang tercatat. Daftarkan mitra baru sekarang.'}
            </p>
            <button
              type="button"
              onClick={onAddPartner}
              className="mt-2 px-3 py-1.5 bg-[#007bff] text-white text-xs font-bold rounded-xl hover:bg-[#0069d9] transition-colors"
            >
              + Tambah Mitra Baru
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPartners.map((partner) => (
              <div
                key={partner.id}
                className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                    {partner.logoUrl ? (
                      <img
                        src={partner.logoUrl}
                        alt={partner.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <Building2 className="w-6 h-6 text-[#007bff]" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs sm:text-sm font-black text-slate-900">
                        {partner.name}
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-slate-100 text-slate-800 border border-slate-300">
                        {CATEGORY_NAMES[partner.category] || partner.category}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                        partner.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : partner.status === 'PENDING_RENEWAL'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {partner.status === 'ACTIVE' ? 'Aktif' : partner.status === 'PENDING_RENEWAL' ? 'Perlu Renewal' : partner.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 font-medium line-clamp-1">
                      {partner.cooperationScope || partner.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-0.5">
                      <span className="font-bold text-slate-700">
                        PIC: {partner.contactPerson.name} ({partner.contactPerson.email})
                      </span>
                      <span>•</span>
                      <span className="text-[#007bff] font-bold">
                        {partner.documents?.length || 0} Dokumen MoU/MoA
                      </span>
                      <span>•</span>
                      <span className="text-emerald-700 font-bold">
                        {partner.programs?.length || 0} Program Dicanangkan
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => onViewPartner(partner)}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-600" />
                    <span>Rincian & Dokumen</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
