// ==============================================================================
// I-CAN PLATFORM — SDG 17 PARTNER REGISTRATION & EDIT MODAL
// Clean AdminLTE / BINUS Operations Style (Antislop Compliant)
// ==============================================================================

import React, { useState, useEffect } from 'react';
import {
  X,
  Building2,
  FileText,
  Calendar,
  Globe,
  Mail,
  Phone,
  User,
  Plus,
  Trash2,
  Upload,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Link as LinkIcon
} from 'lucide-react';
import {
  Partner,
  PartnerCategory,
  PartnerStatus,
  DocumentType,
  DocumentStatus,
  PartnerDocument,
  PartnerProgram,
  ProgramStatus
} from '@/types/partner';
import { CampusEvent } from '@/types';

interface PartnerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (partnerData: Omit<Partner, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  initialPartner?: Partner | null;
  availableEvents?: CampusEvent[];
}

const CATEGORY_OPTIONS: { value: PartnerCategory; label: string; desc: string }[] = [
  { value: 'NGO', label: 'Yayasan / NGO Lingkungan', desc: 'Lembaga nirlaba konservasi & edukasi hijau' },
  { value: 'PRIVATE_CSR', label: 'Perusahaan Swasta / CSR BUMN', desc: 'Mitra industri pendukung ekonomi sirkular & CSR' },
  { value: 'GOVERNMENT', label: 'Instansi Pemerintah / DLH', desc: 'Dinas lingkungan hidup, kementerian, atau pemda' },
  { value: 'COMMUNITY', label: 'Komunitas Lokal / Pemuda', desc: 'Bank sampah, komunitas warga RT/RW, ormawa' },
  { value: 'INTERNATIONAL', label: 'Badan Internasional', desc: 'Organisasi global pelestarian alam & SDG' },
];

const SDG_TARGET_OPTIONS = [
  'SDG 17: Partnerships for the Goals',
  'SDG 12: Responsible Consumption and Production',
  'SDG 13: Climate Action',
  'SDG 15: Life on Land',
  'SDG 6: Clean Water and Sanitation',
  'SDG 11: Sustainable Cities and Communities',
  'SDG 4: Quality Education',
  'SDG 7: Affordable and Clean Energy',
  'SDG 14: Life Below Water',
];

export const PartnerFormModal: React.FC<PartnerFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialPartner,
  availableEvents = [],
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'documents' | 'programs'>('profile');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form states: Profil & PIC
  const [name, setName] = useState('');
  const [category, setCategory] = useState<PartnerCategory>('NGO');
  const [description, setDescription] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [cooperationScope, setCooperationScope] = useState('');
  const [status, setStatus] = useState<PartnerStatus>('ACTIVE');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sdgFocus, setSdgFocus] = useState<string[]>(['SDG 17']);

  // PIC Contact
  const [picName, setPicName] = useState('');
  const [picRole, setPicRole] = useState('');
  const [picEmail, setPicEmail] = useState('');
  const [picPhone, setPicPhone] = useState('');

  // Documents State
  const [documents, setDocuments] = useState<PartnerDocument[]>([]);
  // Input form untuk menambah dokumen baru di tab dokumen
  const [newDocNumber, setNewDocNumber] = useState('');
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocType, setNewDocType] = useState<DocumentType>('MoU');
  const [newDocSignedDate, setNewDocSignedDate] = useState('');
  const [newDocExpiredDate, setNewDocExpiredDate] = useState('');
  const [newDocNotes, setNewDocNotes] = useState('');
  const [newDocFileName, setNewDocFileName] = useState('');

  // Programs State
  const [programs, setPrograms] = useState<PartnerProgram[]>([]);
  // Input form untuk menambah program baru di tab program
  const [newProgTitle, setNewProgTitle] = useState('');
  const [newProgDesc, setNewProgDesc] = useState('');
  const [newProgTarget, setNewProgTarget] = useState('500');
  const [newProgImpact, setNewProgImpact] = useState('');
  const [newProgStart, setNewProgStart] = useState('');
  const [newProgEnd, setNewProgEnd] = useState('');
  const [newProgStatus, setNewProgStatus] = useState<ProgramStatus>('PLANNING');
  const [newProgComservHours, setNewProgComservHours] = useState('8');
  const [newProgLinkedEventId, setNewProgLinkedEventId] = useState('');

  // Sinkronisasi data awal saat modal dibuka (mode edit atau create)
  useEffect(() => {
    if (initialPartner) {
      setName(initialPartner.name || '');
      setCategory(initialPartner.category || 'NGO');
      setDescription(initialPartner.description || '');
      setLogoUrl(initialPartner.logoUrl || '');
      setWebsiteUrl(initialPartner.websiteUrl || '');
      setCooperationScope(initialPartner.cooperationScope || '');
      setStatus(initialPartner.status || 'ACTIVE');
      setStartDate(initialPartner.startDate || '');
      setEndDate(initialPartner.endDate || '');
      setSdgFocus(initialPartner.sdgFocus?.length ? initialPartner.sdgFocus : ['SDG 17']);

      setPicName(initialPartner.contactPerson?.name || '');
      setPicRole(initialPartner.contactPerson?.role || '');
      setPicEmail(initialPartner.contactPerson?.email || '');
      setPicPhone(initialPartner.contactPerson?.phone || '');

      setDocuments(initialPartner.documents || []);
      setPrograms(initialPartner.programs || []);
    } else {
      // Reset default values
      const todayStr = new Date().toISOString().split('T')[0];
      const nextYearDate = new Date();
      nextYearDate.setFullYear(nextYearDate.getFullYear() + 1);
      const nextYearStr = nextYearDate.toISOString().split('T')[0];

      setName('');
      setCategory('NGO');
      setDescription('');
      setLogoUrl('');
      setWebsiteUrl('');
      setCooperationScope('');
      setStatus('ACTIVE');
      setStartDate(todayStr);
      setEndDate(nextYearStr);
      setSdgFocus(['SDG 17', 'SDG 12']);

      setPicName('');
      setPicRole('');
      setPicEmail('');
      setPicPhone('');

      setDocuments([]);
      setPrograms([]);
    }
    setActiveTab('profile');
    setFormError(null);
  }, [initialPartner, isOpen]);

  // Keyboard accessibility: Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Toggle SDG checkbox
  const handleToggleSdg = (sdg: string) => {
    const code = sdg.split(':')[0].trim();
    if (code === 'SDG 17') return; // SDG 17 is mandatory
    if (sdgFocus.includes(code)) {
      setSdgFocus(sdgFocus.filter((s) => s !== code));
    } else {
      setSdgFocus([...sdgFocus, code]);
    }
  };

  // Tambah dokumen ke daftar sementara
  const handleAddDocument = () => {
    if (!newDocNumber.trim()) {
      setFormError('Nomor dokumen wajib diisi (misal: MoU/BINUS-SSO/2026/001)');
      return;
    }
    if (!newDocTitle.trim()) {
      setFormError('Judul dokumen wajib diisi');
      return;
    }

    const newDoc: PartnerDocument = {
      id: `doc-tmp-${Date.now()}`,
      docNumber: newDocNumber.trim(),
      title: newDocTitle.trim(),
      docType: newDocType,
      fileUrl: '',
      fileName: newDocFileName || `${newDocNumber.replace(/\//g, '_')}.pdf`,
      fileSizeKb: 450,
      signedDate: newDocSignedDate || startDate || new Date().toISOString().split('T')[0],
      expiredDate: newDocExpiredDate || endDate || '',
      status: 'ACTIVE',
      notes: newDocNotes.trim(),
    };

    setDocuments([...documents, newDoc]);
    setNewDocNumber('');
    setNewDocTitle('');
    setNewDocNotes('');
    setNewDocFileName('');
    setFormError(null);
  };

  const handleRemoveDocument = (docId: string) => {
    setDocuments(documents.filter((d) => d.id !== docId));
  };

  // Tambah program ke daftar sementara
  const handleAddProgram = () => {
    if (!newProgTitle.trim()) {
      setFormError('Nama program kemitraan wajib diisi');
      return;
    }

    const linkedEvent = availableEvents.find((e) => e.id === newProgLinkedEventId);

    const newProg: PartnerProgram = {
      id: `prog-tmp-${Date.now()}`,
      title: newProgTitle.trim(),
      description: newProgDesc.trim(),
      targetParticipants: parseInt(newProgTarget, 10) || 100,
      targetImpact: newProgImpact.trim() || 'Aksi nyata keberlanjutan kampus',
      targetSdg: sdgFocus,
      startDate: newProgStart || startDate,
      endDate: newProgEnd || endDate,
      status: newProgStatus,
      comservHoursAllocated: parseInt(newProgComservHours, 10) || 0,
      linkedEventId: newProgLinkedEventId || undefined,
      linkedEventTitle: linkedEvent?.title,
      picName: picName.trim(),
    };

    setPrograms([...programs, newProg]);
    setNewProgTitle('');
    setNewProgDesc('');
    setNewProgImpact('');
    setNewProgLinkedEventId('');
    setFormError(null);
  };

  const handleRemoveProgram = (progId: string) => {
    setPrograms(programs.filter((p) => p.id !== progId));
  };

  // Submit keseluruhan form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setActiveTab('profile');
      setFormError('Nama instansi mitra wajib diisi');
      return;
    }

    if (!picName.trim() || !picEmail.trim()) {
      setActiveTab('profile');
      setFormError('Nama dan email PIC penanggung jawab wajib diisi');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: Omit<Partner, 'id' | 'createdAt' | 'updatedAt'> = {
        name: name.trim(),
        category,
        description: description.trim(),
        logoUrl: logoUrl.trim(),
        websiteUrl: websiteUrl.trim(),
        sdgFocus,
        contactPerson: {
          name: picName.trim(),
          role: picRole.trim() || 'Perwakilan Mitra',
          email: picEmail.trim(),
          phone: picPhone.trim(),
        },
        status,
        cooperationScope: cooperationScope.trim(),
        startDate: startDate || new Date().toISOString().split('T')[0],
        endDate: endDate || '',
        documents,
        programs,
      };

      await onSave(payload);
      onClose();
    } catch (err: any) {
      setFormError(err.message || 'Gagal menyimpan data kemitraan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="partner-modal-title"
    >
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden text-slate-900 my-auto">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#007bff]/10 border border-[#007bff]/20 flex items-center justify-center text-[#007bff]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 id="partner-modal-title" className="text-base sm:text-lg font-black text-slate-900">
                {initialPartner ? 'Perbarui Kemitraan SDG 17' : 'Form Kerjasama Mitra Baru (SDG 17)'}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Pencatatan legalitas mitra, dokumen MoU/MoA, dan program kolaborasi kampus
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
            aria-label="Tutup form modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-white px-6 gap-2 text-xs font-bold pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'border-[#007bff] text-[#007bff] font-black'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>1. Profil Mitra & PIC</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('documents')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'documents'
                ? 'border-[#007bff] text-[#007bff] font-black'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>2. Dokumen Legalitas ({documents.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('programs')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'programs'
                ? 'border-[#007bff] text-[#007bff] font-black'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>3. Program & Event Kolaborasi ({programs.length})</span>
          </button>
        </div>

        {/* Error Alert */}
        {formError && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2.5 text-xs text-rose-800 font-medium">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* Form Body with Scroll */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: PROFIL MITRA & PIC */}
          {activeTab === 'profile' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Instansi / Perusahaan / Komunitas Mitra <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: PT Wasteforchange Alam Indonesia"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#007bff] focus:ring-1 focus:ring-[#007bff] text-xs font-medium outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kategori Sektor Mitra <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as PartnerCategory)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:border-[#007bff] text-xs font-bold outline-hidden bg-white"
                  >
                    {CATEGORY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {CATEGORY_OPTIONS.find((c) => c.value === category)?.desc}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Status Kerjasama
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as PartnerStatus)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:border-[#007bff] text-xs font-bold outline-hidden bg-white"
                  >
                    <option value="ACTIVE">Aktif Berjalan</option>
                    <option value="PENDING_RENEWAL">Menunggu Pembaruan (Renewal)</option>
                    <option value="COMPLETED">Selesai Masa Berlaku</option>
                    <option value="DRAFT">Tahap Penjajakan (Draft)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    URL Logo / Foto Mitra (Opsional)
                  </label>
                  <input
                    type="url"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="https://domain.com/logo.png"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#007bff] text-xs font-medium outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Website Resmi / Profil Mitra
                  </label>
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://partner-website.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#007bff] text-xs font-medium outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tanggal Mulai Kerjasama
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#007bff] text-xs font-medium outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tanggal Berakhir Kerjasama
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#007bff] text-xs font-medium outline-hidden"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ruang Lingkup Kerjasama (Scope of Cooperation)
                  </label>
                  <textarea
                    rows={2}
                    value={cooperationScope}
                    onChange={(e) => setCooperationScope(e.target.value)}
                    placeholder="Contoh: Pengelolaan sampah plastik kampus, edukasi pemilahan limbah, dan penanaman mangrove"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-[#007bff] text-xs font-medium outline-hidden resize-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Deskripsi Ringkas Profil Mitra
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Deskripsi singkat mengenai lembaga, peran, dan latar belakang kerjasama"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-[#007bff] text-xs font-medium outline-hidden resize-none"
                  />
                </div>
              </div>

              {/* Target SDG Multi-select */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-black text-slate-800">
                    Fokus Target SDG yang Didukung
                  </label>
                  <span className="text-[11px] font-bold text-[#007bff]">
                    SDG 17 Terpilih Wajib
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {SDG_TARGET_OPTIONS.map((sdg) => {
                    const code = sdg.split(':')[0].trim();
                    const isChecked = sdgFocus.includes(code);
                    const isSdg17 = code === 'SDG 17';
                    return (
                      <label
                        key={code}
                        className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer select-none transition-colors ${
                          isChecked
                            ? 'bg-blue-50/70 border-[#007bff]/40 text-blue-950 font-bold'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          disabled={isSdg17}
                          onChange={() => handleToggleSdg(sdg)}
                          className="rounded text-[#007bff] focus:ring-[#007bff]"
                        />
                        <span className="text-[11px] truncate">{sdg}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* PIC Contact Card */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-black text-slate-800">
                  <User className="w-4 h-4 text-[#007bff]" />
                  <span>Person In Charge (PIC) & Kontak Resmi Mitra</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Nama PIC <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={picName}
                      onChange={(e) => setPicName(e.target.value)}
                      placeholder="Nama lengkap penanggung jawab"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007bff] text-xs font-medium outline-hidden bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Jabatan / Role PIC
                    </label>
                    <input
                      type="text"
                      value={picRole}
                      onChange={(e) => setPicRole(e.target.value)}
                      placeholder="Contoh: Manager CSR / Head of Sustainability"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007bff] text-xs font-medium outline-hidden bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Email Resmi <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={picEmail}
                      onChange={(e) => setPicEmail(e.target.value)}
                      placeholder="pic@mitra.org"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007bff] text-xs font-medium outline-hidden bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Nomor Telepon / WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={picPhone}
                      onChange={(e) => setPicPhone(e.target.value)}
                      placeholder="+62 812-xxxx-xxxx"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007bff] text-xs font-medium outline-hidden bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DOKUMEN KERJASAMA (MoU / MoA) */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              {/* Form Input Tambah Dokumen */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#007bff]" />
                    <h3 className="text-xs font-black text-slate-800">
                      Entri Dokumen Legalitas (MoU / MoA / PKS)
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Dokumen resmi kesepahaman
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Nomor Dokumen
                    </label>
                    <input
                      type="text"
                      value={newDocNumber}
                      onChange={(e) => setNewDocNumber(e.target.value)}
                      placeholder="Contoh: MoU/BINUS-SSO/2026/015"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007bff] text-xs font-medium outline-hidden bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Jenis Dokumen
                    </label>
                    <select
                      value={newDocType}
                      onChange={(e) => setNewDocType(e.target.value as DocumentType)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007bff] text-xs font-bold outline-hidden bg-white"
                    >
                      <option value="MoU">MoU (Nota Kesepahaman)</option>
                      <option value="MoA">MoA (Perjanjian Kerja Sama)</option>
                      <option value="PKS">PKS (Perjanjian Kerjasama Teknis/Operasional)</option>
                      <option value="KEMITRAAN_LAIN">Surat Komitmen / Dokumen Lain</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Judul / Perihal Dokumen
                    </label>
                    <input
                      type="text"
                      value={newDocTitle}
                      onChange={(e) => setNewDocTitle(e.target.value)}
                      placeholder="Contoh: Nota Kesepahaman Pengelolaan Sampah Kampus dan Edukasi Sirkular"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007bff] text-xs font-medium outline-hidden bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Tanggal Penandatanganan
                    </label>
                    <input
                      type="date"
                      value={newDocSignedDate}
                      onChange={(e) => setNewDocSignedDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007bff] text-xs font-medium outline-hidden bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Tanggal Berakhir Dokumen
                    </label>
                    <input
                      type="date"
                      value={newDocExpiredDate}
                      onChange={(e) => setNewDocExpiredDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007bff] text-xs font-medium outline-hidden bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Nama Berkas (Lampiran File)
                    </label>
                    <input
                      type="text"
                      value={newDocFileName}
                      onChange={(e) => setNewDocFileName(e.target.value)}
                      placeholder="Contoh: MoU_BINUS_SSO_Mitra_2026.pdf"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007bff] text-xs font-medium outline-hidden bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Catatan Tambahan Dokumen
                    </label>
                    <input
                      type="text"
                      value={newDocNotes}
                      onChange={(e) => setNewDocNotes(e.target.value)}
                      placeholder="Contoh: Ditandatangani Rektor & Direktur Utama"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007bff] text-xs font-medium outline-hidden bg-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={handleAddDocument}
                    className="px-4 py-2 bg-[#007bff] hover:bg-[#0069d9] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambahkan ke Daftar Dokumen</span>
                  </button>
                </div>
              </div>

              {/* Daftar Dokumen yang Tersimpan */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-black text-slate-800">
                  <span>Daftar Dokumen Legalitas ({documents.length})</span>
                  <span className="text-slate-500 font-medium text-[11px]">
                    Minimal 1 dokumen MoU/MoA sangat disarankan untuk legalitas
                  </span>
                </div>

                {documents.length === 0 ? (
                  <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-center space-y-1">
                    <FileText className="w-8 h-8 text-slate-400 mx-auto" />
                    <p className="text-xs font-bold text-slate-700">Belum ada dokumen yang ditambahkan</p>
                    <p className="text-[11px] text-slate-500">
                      Gunakan formulir di atas untuk mencatatkan berkas MoU atau MoA kerjasama ini
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {documents.map((doc, idx) => (
                      <div
                        key={doc.id || idx}
                        className="p-3.5 bg-white rounded-2xl border border-slate-200 flex items-center justify-between gap-3 shadow-2xs hover:border-slate-300 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-xl bg-blue-50 text-[#007bff] font-black text-xs flex items-center justify-center shrink-0">
                            {doc.docType}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-slate-900">{doc.docNumber}</span>
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                                {doc.status === 'ACTIVE' ? 'Aktif' : doc.status}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 font-medium line-clamp-1">{doc.title}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              Masa Berlaku: {doc.signedDate || 'N/A'} s.d. {doc.expiredDate || 'Selesai'} • Berkas: {doc.fileName || 'dokumen.pdf'}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveDocument(doc.id)}
                          className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                          title="Hapus dokumen ini"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: PROGRAM & EVENT KOLABORASI */}
          {activeTab === 'programs' && (
            <div className="space-y-6">
              {/* Form Input Tambah Program */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-xs font-black text-slate-800">
                      Rencana Program & Event Bersama Mitra
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Aksi nyata terverifikasi Jam Comserv TFI
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Nama Program Kerjasama
                    </label>
                    <input
                      type="text"
                      value={newProgTitle}
                      onChange={(e) => setNewProgTitle(e.target.value)}
                      placeholder="Contoh: Gerakan Penanaman 1,500 Bibit Mangrove Muara Gembong"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007bff] text-xs font-medium outline-hidden bg-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Deskripsi Program
                    </label>
                    <textarea
                      rows={2}
                      value={newProgDesc}
                      onChange={(e) => setNewProgDesc(e.target.value)}
                      placeholder="Jelaskan ringkasan kegiatan, mekanisme, dan sasaran aksi bagi mahasiswa"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007bff] text-xs font-medium outline-hidden bg-white resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Target Kuota Mahasiswa (Peserta)
                    </label>
                    <input
                      type="number"
                      value={newProgTarget}
                      onChange={(e) => setNewProgTarget(e.target.value)}
                      placeholder="Contoh: 500"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007bff] text-xs font-medium outline-hidden bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Target Dampak Riil (Impact Goal)
                    </label>
                    <input
                      type="text"
                      value={newProgImpact}
                      onChange={(e) => setNewProgImpact(e.target.value)}
                      placeholder="Contoh: 1,500 Bibit Pohon / 2,000 kg Sampah"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007bff] text-xs font-medium outline-hidden bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Status Pelaksanaan Program
                    </label>
                    <select
                      value={newProgStatus}
                      onChange={(e) => setNewProgStatus(e.target.value as ProgramStatus)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007bff] text-xs font-bold outline-hidden bg-white"
                    >
                      <option value="PLANNING">Dalam Perencanaan (Planning)</option>
                      <option value="ONGOING">Sedang Berjalan (Ongoing)</option>
                      <option value="COMPLETED">Telah Terlaksana (Completed)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Tautkan ke Event Kampus I-CAN (Opsional)
                    </label>
                    <select
                      value={newProgLinkedEventId}
                      onChange={(e) => setNewProgLinkedEventId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007bff] text-xs font-medium outline-hidden bg-white"
                    >
                      <option value="">Tidak ditautkan ke event spesifik</option>
                      {availableEvents.map((evt) => (
                        <option key={evt.id} value={evt.id}>
                          {evt.title} ({evt.status})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Alokasi Jam Comserv (TFI)
                    </label>
                    <input
                      type="number"
                      value={newProgComservHours}
                      onChange={(e) => setNewProgComservHours(e.target.value)}
                      placeholder="Contoh: 8"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007bff] text-xs font-medium outline-hidden bg-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={handleAddProgram}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambahkan ke Daftar Program</span>
                  </button>
                </div>
              </div>

              {/* Daftar Program yang Tersimpan */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-black text-slate-800">
                  <span>Daftar Program Dicanangkan ({programs.length})</span>
                  <span className="text-slate-500 font-medium text-[11px]">
                    Ditampilkan pada segmen KPI dashboard
                  </span>
                </div>

                {programs.length === 0 ? (
                  <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-center space-y-1">
                    <Calendar className="w-8 h-8 text-slate-400 mx-auto" />
                    <p className="text-xs font-bold text-slate-700">Belum ada program yang dicanangkan</p>
                    <p className="text-[11px] text-slate-500">
                      Gunakan formulir di atas untuk mencatatkan agenda program atau event kolaborasi
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {programs.map((prog, idx) => (
                      <div
                        key={prog.id || idx}
                        className="p-3.5 bg-white rounded-2xl border border-slate-200 flex items-center justify-between gap-3 shadow-2xs hover:border-slate-300 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center shrink-0 ${
                            prog.status === 'COMPLETED' ? 'bg-slate-100 text-slate-700' : 'bg-emerald-50 text-emerald-700'
                          }`}>
                            {idx + 1}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-slate-900">{prog.title}</span>
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
                            <p className="text-[11px] text-slate-600 font-medium line-clamp-1">{prog.description}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              Target: {prog.targetParticipants} Mahasiswa • Dampak: {prog.targetImpact}
                              {prog.linkedEventTitle && ` • Event: ${prog.linkedEventTitle}`}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveProgram(prog.id)}
                          className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                          title="Hapus program ini"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
            <div className="text-xs text-slate-500 font-medium hidden sm:block">
              {activeTab === 'profile' && 'Lanjut ke tab Dokumen & Program untuk melengkapi berkas'}
              {activeTab === 'documents' && `${documents.length} dokumen legalitas siap disimpan`}
              {activeTab === 'programs' && `${programs.length} program dicanangkan siap diterbitkan`}
            </div>

            <div className="flex items-center gap-2.5 ml-auto">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-[#007bff] hover:bg-[#0069d9] text-white text-xs font-black flex items-center gap-2 transition-all shadow-xs disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{initialPartner ? 'Simpan Perubahan' : 'Simpan Kemitraan'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
