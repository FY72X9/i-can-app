// ==============================================================================
// I-CAN PLATFORM — EXCEL STUDENT IMPORT MODAL
// AdminLTE Styled Modal for importing BINUS students via Excel (.xlsx, .xls, .csv)
// ==============================================================================

import React, { useState, useRef } from 'react';
import {
  FileSpreadsheet,
  UploadCloud,
  Download,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  X,
  RefreshCw,
  Users,
  Check,
  FileText,
  Info,
  ShieldCheck,
  KeyRound,
} from 'lucide-react';
import { UserProfile } from '@/types';
import {
  parseStudentExcel,
  downloadStudentTemplate,
  ExcelParseResult,
  ParsedStudentRow,
} from '@/services/excelImportService';
import { useAuthStore } from '@/stores/authStore';

interface ImportUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  existingUsers: UserProfile[];
}

export const ImportUsersModal: React.FC<ImportUsersModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  existingUsers,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [parseResult, setParseResult] = useState<ExcelParseResult | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  // Configuration options
  const [passwordType, setPasswordType] = useState<'default' | 'nim'>('default');
  const [customPassword, setCustomPassword] = useState('binus123');
  const [duplicateAction, setDuplicateAction] = useState<'skip' | 'update'>('skip');
  const [previewFilter, setPreviewFilter] = useState<'all' | 'valid' | 'duplicate' | 'invalid'>('all');

  // Execution state
  const [isImporting, setIsImporting] = useState(false);
  const [importSuccessResult, setImportSuccessResult] = useState<{
    imported: number;
    updated: number;
    skipped: number;
  } | null>(null);

  if (!isOpen) return null;

  const handleFileChange = async (file: File) => {
    if (!file) return;

    setIsParsing(true);
    setParseError(null);
    setImportSuccessResult(null);

    try {
      const result = await parseStudentExcel(file, existingUsers);
      setParseResult(result);
    } catch (err: any) {
      setParseError(err.message || 'Gagal membaca file Excel');
      setParseResult(null);
    } finally {
      setIsParsing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleExecuteImport = async () => {
    if (!parseResult) return;

    // Determine records to process based on duplicate action
    const itemsToProcess = parseResult.allRows.filter((r) => {
      if (r.status === 'valid') return true;
      if (duplicateAction === 'update' && r.status === 'duplicate_system') return true;
      return false;
    });

    if (itemsToProcess.length === 0) {
      alert('Tidak ada data valid yang dapat diimpor.');
      return;
    }

    setIsImporting(true);
    try {
      const importPayload = itemsToProcess.map((r) => ({
        nim: r.nim,
        fullName: r.fullName,
        email: r.email,
        facultyName: r.facultyName,
        role: 'MAHASISWA' as const,
      }));

      const res = await useAuthStore.getState().batchImportUsers(importPayload, {
        defaultPassword: customPassword,
        useNimAsPassword: passwordType === 'nim',
        duplicateAction,
        defaultRole: 'MAHASISWA',
      });

      setImportSuccessResult({
        imported: res.imported,
        updated: res.updated,
        skipped: res.skipped,
      });

      onSuccess();
    } catch (err: any) {
      alert(err?.message || 'Terjadi kesalahan saat memproses import akun');
    } finally {
      setIsImporting(false);
    }
  };

  const resetState = () => {
    setParseResult(null);
    setParseError(null);
    setImportSuccessResult(null);
    setPreviewFilter('all');
  };

  // Filter rows for preview table
  const displayedRows = parseResult
    ? parseResult.allRows.filter((r) => {
        if (previewFilter === 'valid') return r.status === 'valid';
        if (previewFilter === 'duplicate') return r.status === 'duplicate_system' || r.status === 'duplicate_file';
        if (previewFilter === 'invalid') return r.status === 'invalid';
        return true;
      })
    : [];

  return (
    <div
      className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
      onClick={() => !isImporting && onClose()}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl relative my-auto overflow-hidden border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-800 flex items-center gap-2">
                Import Pengguna Mahasiswa (Excel)
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                  SSO BINUS
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Daftarkan massal akun mahasiswa dari berkas spreadsheet (.xlsx, .xls, .csv)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isImporting}
            className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Format Requirements Banner & Template Download */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50/80 via-teal-50/40 to-slate-50 border border-emerald-100/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-black text-emerald-950">
                <Info className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Format Kolom Header Spreadsheet Wajib:</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                <code className="px-2 py-0.5 rounded-md bg-white border border-emerald-200 font-mono font-bold text-emerald-800 shadow-2xs">
                  NIM
                </code>
                <span className="text-slate-400">•</span>
                <code className="px-2 py-0.5 rounded-md bg-white border border-emerald-200 font-mono font-bold text-emerald-800 shadow-2xs">
                  Nama Lengkap
                </code>
                <span className="text-slate-400">•</span>
                <code className="px-2 py-0.5 rounded-md bg-white border border-emerald-200 font-mono font-bold text-emerald-800 shadow-2xs">
                  Email BINUS
                </code>
                <span className="text-slate-400">•</span>
                <code className="px-2 py-0.5 rounded-md bg-white border border-emerald-200 font-mono font-bold text-emerald-800 shadow-2xs">
                  Program
                </code>
              </div>
              <p className="text-[10px] text-slate-500">
                NIM harus 10 digit angka. Setiap mahasiswa baru otomatis memperoleh role <strong>MAHASISWA</strong> dan bonus sambutan <strong>50 Green Coins</strong>.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => downloadStudentTemplate('xlsx')}
                className="px-3 py-2 rounded-xl bg-white hover:bg-emerald-50 border border-emerald-300 text-emerald-700 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5"
                title="Download file template Excel dengan header dan contoh data"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Template (.xlsx)</span>
              </button>
            </div>
          </div>

          {/* Success Banner */}
          {importSuccessResult && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2">
              <div className="flex items-center gap-2 font-black text-sm text-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Import Data Mahasiswa Berhasil!</span>
              </div>
              <div className="text-xs text-emerald-700 grid grid-cols-3 gap-2 pt-1 font-semibold">
                <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-200">
                  <span className="text-slate-500 block text-[10px]">Akun Baru Terdaftar:</span>
                  <span className="text-base font-black text-emerald-700">+{importSuccessResult.imported}</span>
                </div>
                <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-200">
                  <span className="text-slate-500 block text-[10px]">Akun Diperbarui:</span>
                  <span className="text-base font-black text-blue-700">+{importSuccessResult.updated}</span>
                </div>
                <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-200">
                  <span className="text-slate-500 block text-[10px]">Akun Dilewati:</span>
                  <span className="text-base font-black text-slate-600">{importSuccessResult.skipped}</span>
                </div>
              </div>
              <p className="text-[11px] text-emerald-600 pt-1">
                Data akun telah diperbarui di sistem. Mahasiswa dapat langsung login menggunakan NIM / Email BINUS.
              </p>
            </div>
          )}

          {/* Error Banner */}
          {parseError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold block">Gagal Membaca Spreadsheet</span>
                <span>{parseError}</span>
              </div>
            </div>
          )}

          {/* Upload Dropzone */}
          {!parseResult && (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-8 sm:p-10 text-center cursor-pointer transition-all ${
                dragActive
                  ? 'border-emerald-500 bg-emerald-50/50 scale-[0.99]'
                  : 'border-slate-200 hover:border-emerald-400 hover:bg-slate-50/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                className="hidden"
              />

              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3.5 shadow-xs">
                {isParsing ? (
                  <RefreshCw className="w-6 h-6 animate-spin text-emerald-700" />
                ) : (
                  <UploadCloud className="w-7 h-7" />
                )}
              </div>

              <h4 className="text-sm font-black text-slate-800 mb-1">
                {isParsing ? 'Sedang Membaca & Memvalidasi File...' : 'Tarik & Lepas File Excel Disini, atau Klik untuk Jelajahi'}
              </h4>
              <p className="text-xs text-slate-400 font-medium max-w-sm mx-auto">
                Mendukung format Microsoft Excel (<strong>.xlsx</strong>, <strong>.xls</strong>) dan format teks (<strong>.csv</strong>)
              </p>
            </div>
          )}

          {/* Parsed Result Preview & Settings */}
          {parseResult && (
            <div className="space-y-4">
              {/* File Info & Change button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-800">{parseResult.fileName}</span>
                      <span className="text-[10px] text-slate-500 font-mono px-2 py-0.5 rounded-md bg-white border border-slate-200">
                        Sheet: {parseResult.sheetName}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Total baris data terdeteksi: <strong>{parseResult.totalRows} mahasiswa</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={resetState}
                    disabled={isImporting}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-colors shadow-2xs flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                    <span>Ganti File</span>
                  </button>
                </div>
              </div>

              {/* Import Configuration Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80">
                {/* Initial Password Settings */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-black text-slate-800">
                    <KeyRound className="w-4 h-4 text-[#007bff]" />
                    <span>Kata Sandi Awal (Initial Password)</span>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300">
                      <input
                        type="radio"
                        name="passwordType"
                        checked={passwordType === 'default'}
                        onChange={() => setPasswordType('default')}
                        className="text-[#007bff] focus:ring-0"
                      />
                      <span className="font-semibold text-slate-700">Kata Sandi Default Seragam:</span>
                      <input
                        type="text"
                        value={customPassword}
                        onChange={(e) => setCustomPassword(e.target.value)}
                        disabled={passwordType !== 'default'}
                        className="text-xs px-2 py-1 rounded-lg border border-slate-200 font-mono w-28 bg-slate-50 focus:bg-white"
                      />
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300">
                      <input
                        type="radio"
                        name="passwordType"
                        checked={passwordType === 'nim'}
                        onChange={() => setPasswordType('nim')}
                        className="text-[#007bff] focus:ring-0"
                      />
                      <span className="font-semibold text-slate-700">Gunakan NIM masing-masing mahasiswa</span>
                    </label>
                  </div>
                </div>

                {/* Duplicate Strategy Settings */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-black text-slate-800">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Penanganan Akun yang Sudah Terdaftar</span>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300">
                      <input
                        type="radio"
                        name="duplicateAction"
                        checked={duplicateAction === 'skip'}
                        onChange={() => setDuplicateAction('skip')}
                        className="text-emerald-600 focus:ring-0"
                      />
                      <div>
                        <span className="font-bold text-slate-800 block">Lewati (Skip)</span>
                        <span className="text-[10px] text-slate-400">Hanya daftarkan NIM/Email yang belum ada di sistem</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300">
                      <input
                        type="radio"
                        name="duplicateAction"
                        checked={duplicateAction === 'update'}
                        onChange={() => setDuplicateAction('update')}
                        className="text-emerald-600 focus:ring-0"
                      />
                      <div>
                        <span className="font-bold text-slate-800 block">Perbarui Data (Update)</span>
                        <span className="text-[10px] text-slate-400">Perbarui Nama & Program tanpa menghapus Green Coins / SAT</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Validation Summary Stat Tabs */}
              <div className="grid grid-cols-4 gap-2 text-center">
                <button
                  type="button"
                  onClick={() => setPreviewFilter('all')}
                  className={`p-2.5 rounded-2xl border transition-all ${
                    previewFilter === 'all'
                      ? 'bg-slate-800 text-white border-slate-800 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="block text-[10px] font-bold opacity-80 uppercase">Total Data</span>
                  <span className="text-base font-black">{parseResult.totalRows}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewFilter('valid')}
                  className={`p-2.5 rounded-2xl border transition-all ${
                    previewFilter === 'valid'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-emerald-50/70 text-emerald-800 border-emerald-200 hover:bg-emerald-100/70'
                  }`}
                >
                  <span className="block text-[10px] font-bold opacity-80 uppercase">Siap Impor</span>
                  <span className="text-base font-black text-inherit">{parseResult.validRows.length}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewFilter('duplicate')}
                  className={`p-2.5 rounded-2xl border transition-all ${
                    previewFilter === 'duplicate'
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-amber-50/70 text-amber-800 border-amber-200 hover:bg-amber-100/70'
                  }`}
                >
                  <span className="block text-[10px] font-bold opacity-80 uppercase">Duplikat</span>
                  <span className="text-base font-black text-inherit">{parseResult.duplicateRows.length}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewFilter('invalid')}
                  className={`p-2.5 rounded-2xl border transition-all ${
                    previewFilter === 'invalid'
                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                      : 'bg-rose-50/70 text-rose-800 border-rose-200 hover:bg-rose-100/70'
                  }`}
                >
                  <span className="block text-[10px] font-bold opacity-80 uppercase">Format Salah</span>
                  <span className="text-base font-black text-inherit">{parseResult.invalidRows.length}</span>
                </button>
              </div>

              {/* Data Preview Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                <div className="max-h-72 overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="sticky top-0 bg-slate-100 text-slate-700 border-b border-slate-200 z-10">
                      <tr>
                        <th className="p-2.5 font-black w-14">Baris</th>
                        <th className="p-2.5 font-black w-28">Status</th>
                        <th className="p-2.5 font-black">NIM</th>
                        <th className="p-2.5 font-black">Nama Lengkap</th>
                        <th className="p-2.5 font-black">Email BINUS</th>
                        <th className="p-2.5 font-black">Program</th>
                        <th className="p-2.5 font-black">Keterangan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {displayedRows.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-6 text-center text-slate-400 font-bold">
                            Tidak ada data untuk filter "{previewFilter}"
                          </td>
                        </tr>
                      ) : (
                        displayedRows.map((r, idx) => (
                          <tr
                            key={idx}
                            className={`hover:bg-slate-50 transition-colors ${
                              r.status === 'invalid'
                                ? 'bg-rose-50/30'
                                : r.status === 'duplicate_system' || r.status === 'duplicate_file'
                                ? 'bg-amber-50/20'
                                : ''
                            }`}
                          >
                            <td className="p-2.5 font-mono text-[11px] text-slate-400">#{r.rowNumber}</td>
                            <td className="p-2.5">
                              {r.status === 'valid' && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                                  <Check className="w-3 h-3" /> Siap
                                </span>
                              )}
                              {r.status === 'duplicate_system' && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                                  <AlertTriangle className="w-3 h-3" /> Ada di Sistem
                                </span>
                              )}
                              {r.status === 'duplicate_file' && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                                  <AlertTriangle className="w-3 h-3" /> Duplikat File
                                </span>
                              )}
                              {r.status === 'invalid' && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-800">
                                  <AlertCircle className="w-3 h-3" /> Tidak Valid
                                </span>
                              )}
                            </td>
                            <td className="p-2.5 font-mono font-bold text-slate-700">{r.nim || '-'}</td>
                            <td className="p-2.5 font-bold text-slate-800">{r.fullName || '-'}</td>
                            <td className="p-2.5 text-slate-600 font-mono text-[11px]">{r.email || '-'}</td>
                            <td className="p-2.5 text-slate-600">{r.facultyName || '-'}</td>
                            <td className="p-2.5 text-[11px]">
                              {r.errors.length > 0 && (
                                <span className="text-rose-600 font-semibold block">
                                  {r.errors.join(', ')}
                                </span>
                              )}
                              {r.warnings.length > 0 && (
                                <span className="text-amber-700 block">
                                  {r.warnings.join(', ')}
                                </span>
                              )}
                              {r.errors.length === 0 && r.warnings.length === 0 && (
                                <span className="text-slate-400">Valid</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/70 shrink-0">
          <div className="text-xs text-slate-500 font-medium">
            {parseResult ? (
              <span>
                Akan memproses:{' '}
                <strong className="text-slate-800">
                  {duplicateAction === 'update'
                    ? parseResult.validRows.length + parseResult.duplicateRows.length
                    : parseResult.validRows.length}{' '}
                  data mahasiswa
                </strong>
              </span>
            ) : (
              <span>Pilih file spreadsheet untuk memulai validasi.</span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isImporting}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              Batal
            </button>

            {parseResult && (
              <button
                type="button"
                onClick={handleExecuteImport}
                disabled={
                  isImporting ||
                  (parseResult.validRows.length === 0 &&
                    (duplicateAction !== 'update' || parseResult.duplicateRows.length === 0))
                }
                className={`px-5 py-2 rounded-xl text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 ${
                  isImporting ||
                  (parseResult.validRows.length === 0 &&
                    (duplicateAction !== 'update' || parseResult.duplicateRows.length === 0))
                    ? 'bg-slate-300 cursor-not-allowed text-slate-500'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {isImporting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Mengimpor Akun...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      Import{' '}
                      {duplicateAction === 'update'
                        ? parseResult.validRows.length + parseResult.duplicateRows.length
                        : parseResult.validRows.length}{' '}
                      Mahasiswa
                    </span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

