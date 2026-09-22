// ==============================================================================
// I-CAN PLATFORM — SDG 17 PARTNERSHIP & COOPERATION MODELS
// ==============================================================================

export type PartnerCategory = 
  | 'NGO'               // Yayasan / Lembaga Swadaya Masyarakat Lingkungan
  | 'GOVERNMENT'        // Pemerintah / Dinas Lingkungan Hidup / Kementerian
  | 'PRIVATE_CSR'       // Perusahaan Swasta / BUMN (Program CSR Berkelanjutan)
  | 'COMMUNITY'         // Komunitas Lokal / Pemuda / Bank Sampah
  | 'INTERNATIONAL';    // Badan PBB / Organisasi Internasional

export type PartnerStatus = 
  | 'ACTIVE'            // Kerjasama Aktif
  | 'PENDING_RENEWAL'   // Masa Berlaku Hampir Habis / Perlu Pembaruan
  | 'COMPLETED'         // Periode Kerjasama Selesai
  | 'DRAFT';            // Pengajuan / Penjajakan Awal

export type DocumentType = 
  | 'MoU'               // Memorandum of Understanding (Nota Kesepahaman)
  | 'MoA'               // Memorandum of Agreement (Perjanjian Kerja Sama)
  | 'PKS'               // Perjanjian Kerja Sama Operasional
  | 'KEMITRAAN_LAIN';   // Surat Komitmen / Dokumen Kerjasama Lain

export type DocumentStatus = 
  | 'ACTIVE'            // Berlaku Sah
  | 'EXPIRED'           // Kadaluarsa
  | 'PENDING_SIGN';     // Menunggu Tanda Tangan

export interface PartnerDocument {
  id: string;
  docNumber: string;           // Contoh: "MoU/BINUS-SSO/2026/018"
  title: string;               // Contoh: "Nota Kesepahaman Pengelolaan Sampah Kampus"
  docType: DocumentType;
  fileUrl: string;             // URL atau Base64 file dokumen
  fileName?: string;
  fileSizeKb?: number;
  signedDate: string;          // ISO Date string (YYYY-MM-DD)
  expiredDate: string;         // ISO Date string (YYYY-MM-DD)
  status: DocumentStatus;
  notes?: string;
}

export type ProgramStatus = 
  | 'PLANNING'          // Dalam Perencanaan
  | 'ONGOING'           // Sedang Berjalan
  | 'COMPLETED';        // Telah Terlaksana

export interface PartnerProgram {
  id: string;
  title: string;               // Nama Program Kerjasama
  description: string;
  targetParticipants: number;  // Target Kuota Mahasiswa
  targetImpact: string;        // Contoh: "2,000 Bibit Pohon", "1,500 kg Sampah Terpilah"
  targetSdg: string[];         // Contoh: ["SDG 17", "SDG 12", "SDG 15"]
  startDate: string;           // YYYY-MM-DD
  endDate: string;             // YYYY-MM-DD
  status: ProgramStatus;
  comservHoursAllocated?: number; // Alokasi jam comserv jika ada
  linkedEventId?: string;      // Tautan ID event di I-CAN jika ada
  linkedEventTitle?: string;
  picName?: string;
}

export interface PartnerContact {
  name: string;                // Nama Lengkap PIC Mitra
  role: string;                // Jabatan PIC (e.g. "Head of Sustainability")
  email: string;               // Email resmi mitra
  phone: string;               // Nomor kontak / WhatsApp
}

export interface Partner {
  id: string;
  name: string;                // Nama Instansi / Organisasi Mitra
  category: PartnerCategory;
  description: string;
  logoUrl?: string;
  websiteUrl?: string;
  sdgFocus: string[];          // Fokus SDG, wajib memuat SDG 17
  contactPerson: PartnerContact;
  status: PartnerStatus;
  documents: PartnerDocument[];
  programs: PartnerProgram[];
  cooperationScope: string;    // Ruang lingkup kerjasama (e.g. Edukasi, Daur Ulang, VBL)
  startDate: string;           // Tanggal Mulai Kerjasama
  endDate: string;             // Tanggal Berakhir Kerjasama
  createdAt: string;
  updatedAt?: string;
}
