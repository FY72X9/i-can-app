// ==============================================================================
// I-CAN PLATFORM — SDG 17 PARTNER DETAIL & DOSSIER MODAL
// Displays complete partner profile, legal MoU/MoA documents, and programs
// ==============================================================================

import React, { useEffect } from 'react';
import {
  X,
  Building2,
  FileText,
  Calendar,
  Globe,
  Mail,
  Phone,
  User,
  ExternalLink,
  Download,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { Partner, PartnerCategory } from '@/types/partner';

interface PartnerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  partner: Partner | null;
  onEdit: (partner: Partner) => void;
  onDelete: (partnerId: string) => void;
}

const CATEGORY_LABELS: Record<PartnerCategory, { label: string; badgeColor: string }> = {
  NGO: { label: 'NGO / Yayasan Lingkungan', badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
  PRIVATE_CSR: { label: 'Swasta / BUMN (CSR)', badgeColor: 'bg-blue-100 text-blue-900 border-blue-300' },
  GOVERNMENT: { label: 'Instansi Pemerintah', badgeColor: 'bg-amber-100 text-amber-900 border-amber-300' },
  COMMUNITY: { label: 'Komunitas Lokal / Ormawa', badgeColor: 'bg-purple-100 text-purple-900 border-purple-300' },
  INTERNATIONAL: { label: 'Badan Internasional', badgeColor: 'bg-cyan-100 text-cyan-900 border-cyan-300' },
};

export const PartnerDetailModal: React.FC<PartnerDetailModalProps> = ({
  isOpen,
  onClose,
  partner,
  onEdit,
  onDelete,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !partner) return null;

  const categoryInfo = CATEGORY_LABELS[partner.category] || {
    label: partner.category,
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
  };

  const handleDownloadDoc = (fileName: string, docNumber: string) => {
    // Generate a simple legal summary text file as an authentic download demonstration
    const content = `BINUS UNIVERSITY — STUDENT SERVICE OFFICE (SSO)\nARSIP DOKUMEN LEGALITAS KERJASAMA SDG 17\n=======================================================\nNomor Dokumen : ${docNumber}\nMitra         : ${partner.name}\nKategori      : ${categoryInfo.label}\nStatus        : Aktif Sah\nPeriode       : ${partner.startDate} s.d. ${partner.endDate}\nRuang Lingkup : ${partner.cooperationScope}\nPIC Mitra     : ${partner.contactPerson.name} (${partner.contactPerson.email})\n=======================================================\nDokumen ini tersimpan secara sah dalam Database SSO BINUS.`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName.endsWith('.txt') || fileName.endsWith('.pdf') ? fileName : `${fileName}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="partner-detail-title"
    >
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden text-slate-900 my-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200 shadow-2xs overflow-hidden flex items-center justify-center shrink-0">
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
                <Building2 className="w-5 h-5 text-[#007bff]" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 id="partner-detail-title" className="text-base sm:text-lg font-black text-slate-900">
                  {partner.name}
                </h2>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${categoryInfo.badgeColor}`}>
                  {categoryInfo.label}
                </span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {partner.status === 'ACTIVE' ? 'Kerjasama Aktif' : partner.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Periode: {partner.startDate || 'N/A'} s.d. {partner.endDate || 'Berjalan'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
            aria-label="Tutup rincian mitra"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Ringkasan Profil & PIC */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-[11px] font-bold text-slate-500 block uppercase tracking-wide">
                Ruang Lingkup Kerjasama
              </span>
              <p className="text-xs text-slate-800 font-medium leading-relaxed">
                {partner.cooperationScope || partner.description || 'Tidak ada keterangan khusus.'}
              </p>
              {partner.websiteUrl && (
                <a
                  href={partner.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#007bff] hover:underline pt-1"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Kunjungi Website Resmi</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-[11px] font-bold text-slate-500 block uppercase tracking-wide">
                Kontak Penanggung Jawab (PIC)
              </span>
              <div className="space-y-1 text-xs">
                <div className="font-black text-slate-900">{partner.contactPerson.name}</div>
                <div className="text-slate-600 font-medium">{partner.contactPerson.role}</div>
                <div className="flex items-center gap-1.5 text-slate-600 pt-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{partner.contactPerson.email}</span>
                </div>
                {partner.contactPerson.phone && (
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{partner.contactPerson.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Fokus Target SDG */}
          <div className="space-y-2">
            <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-[#007bff]" />
              <span>Target Berkelanjutan (UN SDG) yang Didukung</span>
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {partner.sdgFocus.map((sdg) => (
                <span
                  key={sdg}
                  className="text-xs font-bold bg-blue-50 text-[#007bff] border border-blue-200 px-3 py-1 rounded-xl"
                >
                  {sdg}
                </span>
              ))}
            </div>
          </div>

          {/* Dokumen Kerjasama MoU / MoA */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#007bff]" />
                <span>Dokumen Legalitas & MoU/MoA ({partner.documents.length})</span>
              </h3>
              <span className="text-[11px] text-slate-500 font-medium">Terarsip di SSO</span>
            </div>

            {partner.documents.length === 0 ? (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                Belum ada dokumen MoU/MoA yang diunggah untuk mitra ini.
              </div>
            ) : (
              <div className="space-y-2">
                {partner.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3.5 bg-white rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-blue-50 text-[#007bff] rounded-md font-black text-[10px]">
                          {doc.docType}
                        </span>
                        <span className="font-black text-xs text-slate-900">{doc.docNumber}</span>
                        <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                          {doc.status}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-800">{doc.title}</p>
                      <p className="text-[11px] text-slate-500">
                        Ditandatangani: {doc.signedDate} • Berlaku hingga: {doc.expiredDate || 'Selesai'}
                        {doc.notes && ` • Catatan: ${doc.notes}`}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDownloadDoc(doc.fileName || `${doc.docNumber}.txt`, doc.docNumber)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh Berkas</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Program & Event Kolaborasi */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>Program & Event Dicanangkan ({partner.programs.length})</span>
              </h3>
              <span className="text-[11px] text-slate-500 font-medium">Aksi Mahasiswa</span>
            </div>

            {partner.programs.length === 0 ? (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                Belum ada program aksi yang dicanangkan bersama mitra ini.
              </div>
            ) : (
              <div className="space-y-2.5">
                {partner.programs.map((prog) => (
                  <div
                    key={prog.id}
                    className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2 shadow-2xs"
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <h4 className="text-xs font-black text-slate-900">{prog.title}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        prog.status === 'ONGOING'
                          ? 'bg-emerald-100 text-emerald-800'
                          : prog.status === 'PLANNING'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {prog.status === 'ONGOING' ? 'Sedang Berjalan' : prog.status === 'PLANNING' ? 'Rencana' : 'Selesai'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 font-medium">{prog.description}</p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                      <span className="font-bold text-slate-700">
                        Target: {prog.targetParticipants} Mahasiswa
                      </span>
                      <span>•</span>
                      <span className="text-emerald-700 font-bold">Dampak: {prog.targetImpact}</span>
                      {prog.comservHoursAllocated && (
                        <>
                          <span>•</span>
                          <span className="text-blue-800 font-bold">+{prog.comservHoursAllocated} Jam Comserv TFI</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Apakah Anda yakin ingin menghapus data kemitraan "${partner.name}"?`)) {
                onDelete(partner.id);
                onClose();
              }
            }}
            className="px-3.5 py-2 text-rose-600 hover:bg-rose-100/70 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hapus Kemitraan</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={() => {
                onEdit(partner);
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-[#007bff] hover:bg-[#0069d9] text-white text-xs font-black flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Sunting Data Mitra</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
