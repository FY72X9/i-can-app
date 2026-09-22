// ==============================================================================
// I-CAN PLATFORM — SDG 17 PARTNERSHIP & COOPERATION SERVICE
// Manages partners, MoU/MoA legal documents, and collaborative action programs.
// Integrates directly with Supabase Database (partners table) + LocalStorage Cache.
// ==============================================================================

import { Partner, PartnerDocument, PartnerProgram } from '@/types/partner';
import { supabase, isConfigured } from '@/services/supabase';

const LOCAL_PARTNERS_KEY = 'i_can_sdg17_partners_v2';

export const INITIAL_PARTNERS_DATA: Partner[] = [
  {
    id: 'partner-w4c-001',
    name: 'Waste4Change (PT Wasteforchange Alam Indonesia)',
    category: 'PRIVATE_CSR',
    description: 'Penyedia solusi pengelolaan sampah bertanggung jawab berbasis sirkular ekonomi, mendukung program pemilahan limbah dan audit sampah kampus.',
    logoUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=200&q=80',
    websiteUrl: 'https://waste4change.com',
    sdgFocus: ['SDG 17', 'SDG 12', 'SDG 13'],
    contactPerson: {
      name: 'Dimas Nugroho, S.T.',
      role: 'Head of Partnership & Public Sector',
      email: 'partnership@waste4change.com',
      phone: '+62 812-8901-2345',
    },
    status: 'ACTIVE',
    cooperationScope: 'Penyediaan drop box terpilah, edukasi daur ulang sampah plastik, dan workshop pemilahan sampah organik untuk mahasiswa BINUS.',
    startDate: '2026-01-10',
    endDate: '2027-01-09',
    createdAt: '2026-01-10T08:00:00.000Z',
    documents: [
      {
        id: 'doc-w4c-01',
        docNumber: 'MoU/BINUS-SSO/2026/012',
        title: 'Nota Kesepahaman Pengelolaan Sampah Kampus dan Edukasi Sirkular',
        docType: 'MoU',
        fileUrl: '',
        fileName: 'MoU_BINUS_Waste4Change_2026.pdf',
        fileSizeKb: 480,
        signedDate: '2026-01-10',
        expiredDate: '2027-01-09',
        status: 'ACTIVE',
        notes: 'Ditandatangani oleh Rektorat BINUS dan Direktur Waste4Change.',
      },
      {
        id: 'doc-w4c-02',
        docNumber: 'PKS/BINUS-SSO/2026/028',
        title: 'Perjanjian Kerjasama Operasional Drop Box Sampah Kampus @Bekasi',
        docType: 'PKS',
        fileUrl: '',
        fileName: 'PKS_DropBox_Sampah_Bekasi.pdf',
        fileSizeKb: 320,
        signedDate: '2026-02-01',
        expiredDate: '2026-12-31',
        status: 'ACTIVE',
        notes: 'Penyediaan 6 unit smart waste bin di area lobi.',
      }
    ],
    programs: [
      {
        id: 'prog-w4c-01',
        title: 'Program Kampus Bijak Kelola Sampah (Zero Waste Campus)',
        description: 'Edukasi dan implementasi pemilahan sampah kertas dan botol plastik di lingkungan kampus.',
        targetParticipants: 1200,
        targetImpact: '2,500 kg Sampah Terpilah',
        targetSdg: ['SDG 17', 'SDG 12'],
        startDate: '2026-02-15',
        endDate: '2026-11-30',
        status: 'ONGOING',
        comservHoursAllocated: 8,
        picName: 'Dimas Nugroho',
      },
      {
        id: 'prog-w4c-02',
        title: 'Workshop Digital Upcycling & Circular Economy',
        description: 'Pelatihan pembuatan produk berdaya jual dari limbah tutup botol HDPE.',
        targetParticipants: 350,
        targetImpact: '350 kg Plastik Didaur Ulang',
        targetSdg: ['SDG 17', 'SDG 8', 'SDG 12'],
        startDate: '2026-04-10',
        endDate: '2026-04-25',
        status: 'PLANNING',
        comservHoursAllocated: 4,
        picName: 'Siti Rahmawati',
      }
    ]
  },
  {
    id: 'partner-lh-002',
    name: 'Yayasan LindungiHutan Indonesia',
    category: 'NGO',
    description: 'Organisasi nirlaba penggerak konservasi hutan dan reforestasi pesisir pantai di seluruh Indonesia melalui skema adopsi pohon.',
    logoUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=200&q=80',
    websiteUrl: 'https://lindungihutan.com',
    sdgFocus: ['SDG 17', 'SDG 13', 'SDG 15'],
    contactPerson: {
      name: 'Miftachur Robani, S.Kom.',
      role: 'Chief Executive Officer',
      email: 'kerjasama@lindungihutan.com',
      phone: '+62 813-2233-4455',
    },
    status: 'ACTIVE',
    cooperationScope: 'Pelaksanaan penanaman bibit pohon mangrove dan tanaman keras untuk program penghijauan mahasiswa Teach For Indonesia.',
    startDate: '2025-11-01',
    endDate: '2026-12-31',
    createdAt: '2025-11-01T09:00:00.000Z',
    documents: [
      {
        id: 'doc-lh-01',
        docNumber: 'MoA/BINUS-TFI/2025/089',
        title: 'Perjanjian Kerjasama Penanaman 3,000 Mangrove Pesisir Muara Gembong',
        docType: 'MoA',
        fileUrl: '',
        fileName: 'MoA_Penanaman_Mangrove_2026.pdf',
        fileSizeKb: 610,
        signedDate: '2025-11-01',
        expiredDate: '2026-12-31',
        status: 'ACTIVE',
        notes: 'PKS multi-tahun untuk mendukung verifikasi jam Community Service.',
      }
    ],
    programs: [
      {
        id: 'prog-lh-01',
        title: 'Aksi Nyata Tanam 1,500 Bibit Mangrove',
        description: 'Penanaman bibit mangrove berbatang kuat di pesisir utara untuk menahan abrasi dan serapan karbon.',
        targetParticipants: 600,
        targetImpact: '1,500 Bibit Pohon',
        targetSdg: ['SDG 17', 'SDG 13', 'SDG 15'],
        startDate: '2026-03-01',
        endDate: '2026-08-30',
        status: 'ONGOING',
        comservHoursAllocated: 12,
        picName: 'Miftachur Robani',
      }
    ]
  },
  {
    id: 'partner-dlh-003',
    name: 'Dinas Lingkungan Hidup DKI Jakarta',
    category: 'GOVERNMENT',
    description: 'Instansi pemerintah yang membidangi pengendalian pencemaran, konservasi sumber daya air tanah, dan pemantauan kualitas lingkungan hidup perkotaan.',
    logoUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=200&q=80',
    websiteUrl: 'https://lingkunganhidup.jakarta.go.id',
    sdgFocus: ['SDG 17', 'SDG 6', 'SDG 11'],
    contactPerson: {
      name: 'Ir. Hendra Kusnadi, M.T.',
      role: 'Kepala Seksi Kemitraan & Peran Serta Masyarakat',
      email: 'kemitraan.dlh@jakarta.go.id',
      phone: '+62 21-8092740',
    },
    status: 'ACTIVE',
    cooperationScope: 'Fasilitasi pembuatan lubang biopori di fasum warga sekitar kampus dan kalibrasi emisi karbon aktivitas mahasiswa.',
    startDate: '2025-08-15',
    endDate: '2026-08-14',
    createdAt: '2025-08-15T10:00:00.000Z',
    documents: [
      {
        id: 'doc-dlh-01',
        docNumber: 'MoU/DLH-DKI/BINUS/2025/11',
        title: 'Kesepakatan Bersama Edukasi Konservasi Air Tanah & Biopori Pemukiman',
        docType: 'MoU',
        fileUrl: '',
        fileName: 'MoU_DLH_DKI_BINUS_2025.pdf',
        fileSizeKb: 540,
        signedDate: '2025-08-15',
        expiredDate: '2026-08-14',
        status: 'ACTIVE',
        notes: 'Masa berlaku hingga Agustus 2026, dalam persiapan pembaruan.',
      }
    ],
    programs: [
      {
        id: 'prog-dlh-01',
        title: 'Gerakan 1,000 Lubang Resapan Biopori Kampus & Warga Sekitar',
        description: 'Pembuatan lubang biopori pada area resapan air pemukiman RT/RW sekitar kampus bersama warga.',
        targetParticipants: 800,
        targetImpact: '1,000 Lubang Biopori',
        targetSdg: ['SDG 17', 'SDG 6'],
        startDate: '2026-01-20',
        endDate: '2026-07-31',
        status: 'ONGOING',
        comservHoursAllocated: 10,
        picName: 'Ir. Hendra Kusnadi',
      }
    ]
  },
  {
    id: 'partner-wwf-004',
    name: 'Yayasan WWF Indonesia',
    category: 'INTERNATIONAL',
    description: 'Badan konservasi independen global yang berfokus pada pelestarian keanekaragaman hayati dan pengurangan jejak ekologis manusia.',
    logoUrl: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=200&q=80',
    websiteUrl: 'https://www.wwf.id',
    sdgFocus: ['SDG 17', 'SDG 14', 'SDG 15'],
    contactPerson: {
      name: 'Aditya Pratama, M.Sc.',
      role: 'Youth Engagement & Education Specialist',
      email: 'youth@wwf.id',
      phone: '+62 21-5761070',
    },
    status: 'PENDING_RENEWAL',
    cooperationScope: 'Penyelenggaraan Earth Hour Kampus, kampanye anti-kantong plastik, dan kompetisi inovasi video pembelajaran VBL.',
    startDate: '2025-03-01',
    endDate: '2026-03-31',
    createdAt: '2025-03-01T10:00:00.000Z',
    documents: [
      {
        id: 'doc-wwf-01',
        docNumber: 'MoU/WWF-ID/BINUS/2025/04',
        title: 'Nota Kesepahaman Kampanye Konservasi Alam & Earth Hour',
        docType: 'MoU',
        fileUrl: '',
        fileName: 'MoU_WWF_Indonesia_2025.pdf',
        fileSizeKb: 720,
        signedDate: '2025-03-01',
        expiredDate: '2026-03-31',
        status: 'ACTIVE',
        notes: 'Perlu pengajuan addendum pembaruan untuk periode 2026/2027.',
      }
    ],
    programs: [
      {
        id: 'prog-wwf-01',
        title: 'Earth Hour Campus Switch-Off & Renewable Energy Campaign',
        description: 'Kampanye pemadaman listrik 60 menit serentak dan edukasi efisiensi energi bagi mahasiswa.',
        targetParticipants: 1500,
        targetImpact: '450 kWh Penghematan Energi',
        targetSdg: ['SDG 17', 'SDG 7', 'SDG 13'],
        startDate: '2026-03-15',
        endDate: '2026-03-30',
        status: 'COMPLETED',
        comservHoursAllocated: 6,
        picName: 'Aditya Pratama',
      }
    ]
  }
];

const generateId = (prefix: string): string => {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
};

/**
 * Mapping helper dari row database Supabase ke model Partner
 */
function mapDbRowToPartner(row: any): Partner {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    description: row.description || '',
    logoUrl: row.logo_url || '',
    websiteUrl: row.website_url || '',
    sdgFocus: Array.isArray(row.sdg_focus) ? row.sdg_focus : ['SDG 17'],
    contactPerson: row.contact_person || { name: '', role: '', email: '', phone: '' },
    status: row.status || 'ACTIVE',
    documents: Array.isArray(row.documents) ? row.documents : [],
    programs: Array.isArray(row.programs) ? row.programs : [],
    cooperationScope: row.cooperation_scope || '',
    startDate: row.start_date || '',
    endDate: row.end_date || '',
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at,
  };
}

/**
 * Mengambil semua data mitra kerjasama SDG 17
 * Mencoba query Supabase terlebih dahulu; bila gagal/offline, gunakan cache localStorage / seed.
 */
export async function getPartners(): Promise<Partner[]> {
  // 1. Coba baca dari Supabase jika configured
  if (isConfigured) {
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const mapped = data.map(mapDbRowToPartner);
        localStorage.setItem(LOCAL_PARTNERS_KEY, JSON.stringify(mapped));
        return mapped;
      }
    } catch (err) {
      console.warn('[partnerService] Supabase fetch failed, trying local store:', err);
    }
  }

  // 2. Fallback ke LocalStorage
  try {
    const stored = localStorage.getItem(LOCAL_PARTNERS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[partnerService] Failed to parse stored partners, using default data:', err);
  }

  // 3. Fallback ke seed data awal
  localStorage.setItem(LOCAL_PARTNERS_KEY, JSON.stringify(INITIAL_PARTNERS_DATA));
  return INITIAL_PARTNERS_DATA;
}

/**
 * Menyimpan mitra baru (ke Supabase dan LocalStorage)
 */
export async function createPartner(
  data: Omit<Partner, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Partner> {
  const currentPartners = await getPartners();
  const newPartner: Partner = {
    ...data,
    id: generateId('partner'),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // 1. Insert ke Supabase jika terhubung
  if (isConfigured) {
    try {
      await supabase.from('partners').insert([{
        id: newPartner.id,
        name: newPartner.name,
        category: newPartner.category,
        description: newPartner.description,
        logo_url: newPartner.logoUrl,
        website_url: newPartner.websiteUrl,
        sdg_focus: newPartner.sdgFocus,
        contact_person: newPartner.contactPerson,
        status: newPartner.status,
        documents: newPartner.documents,
        programs: newPartner.programs,
        cooperation_scope: newPartner.cooperationScope,
        start_date: newPartner.startDate || null,
        end_date: newPartner.endDate || null,
        created_at: newPartner.createdAt,
        updated_at: newPartner.updatedAt,
      }]);
    } catch (err) {
      console.warn('[partnerService] Supabase insert failed, continuing with local store:', err);
    }
  }

  // 2. Update local storage
  const updatedList = [newPartner, ...currentPartners];
  localStorage.setItem(LOCAL_PARTNERS_KEY, JSON.stringify(updatedList));

  return newPartner;
}

/**
 * Memperbarui data mitra yang sudah ada
 */
export async function updatePartner(
  id: string,
  updates: Partial<Omit<Partner, 'id' | 'createdAt'>>
): Promise<Partner> {
  const currentPartners = await getPartners();
  const index = currentPartners.findIndex((p) => p.id === id);
  if (index === -1) {
    throw new Error('Mitra tidak ditemukan');
  }

  const updatedPartner: Partner = {
    ...currentPartners[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  // 1. Update di Supabase jika terhubung
  if (isConfigured) {
    try {
      await supabase
        .from('partners')
        .update({
          name: updatedPartner.name,
          category: updatedPartner.category,
          description: updatedPartner.description,
          logo_url: updatedPartner.logoUrl,
          website_url: updatedPartner.websiteUrl,
          sdg_focus: updatedPartner.sdgFocus,
          contact_person: updatedPartner.contactPerson,
          status: updatedPartner.status,
          documents: updatedPartner.documents,
          programs: updatedPartner.programs,
          cooperation_scope: updatedPartner.cooperationScope,
          start_date: updatedPartner.startDate || null,
          end_date: updatedPartner.endDate || null,
          updated_at: updatedPartner.updatedAt,
        })
        .eq('id', id);
    } catch (err) {
      console.warn('[partnerService] Supabase update failed, continuing with local store:', err);
    }
  }

  // 2. Update local storage
  currentPartners[index] = updatedPartner;
  localStorage.setItem(LOCAL_PARTNERS_KEY, JSON.stringify(currentPartners));
  return updatedPartner;
}

/**
 * Menghapus data mitra
 */
export async function deletePartner(id: string): Promise<boolean> {
  // 1. Delete dari Supabase jika terhubung
  if (isConfigured) {
    try {
      await supabase.from('partners').delete().eq('id', id);
    } catch (err) {
      console.warn('[partnerService] Supabase delete failed, continuing with local store:', err);
    }
  }

  // 2. Update local storage
  const currentPartners = await getPartners();
  const filtered = currentPartners.filter((p) => p.id !== id);
  localStorage.setItem(LOCAL_PARTNERS_KEY, JSON.stringify(filtered));
  return true;
}

/**
 * Menambahkan dokumen legalitas (MoU/MoA) ke mitra
 */
export async function addDocumentToPartner(
  partnerId: string,
  documentData: Omit<PartnerDocument, 'id'>
): Promise<Partner> {
  const currentPartners = await getPartners();
  const partner = currentPartners.find((p) => p.id === partnerId);
  if (!partner) throw new Error('Mitra tidak ditemukan');

  const newDoc: PartnerDocument = {
    ...documentData,
    id: generateId('doc'),
  };

  const updatedDocuments = [...partner.documents, newDoc];
  return updatePartner(partnerId, { documents: updatedDocuments });
}

/**
 * Menghapus dokumen dari mitra
 */
export async function deleteDocumentFromPartner(
  partnerId: string,
  docId: string
): Promise<Partner> {
  const currentPartners = await getPartners();
  const partner = currentPartners.find((p) => p.id === partnerId);
  if (!partner) throw new Error('Mitra tidak ditemukan');

  const updatedDocuments = partner.documents.filter((d) => d.id !== docId);
  return updatePartner(partnerId, { documents: updatedDocuments });
}

/**
 * Menambahkan program kolaborasi baru ke mitra
 */
export async function addProgramToPartner(
  partnerId: string,
  programData: Omit<PartnerProgram, 'id'>
): Promise<Partner> {
  const currentPartners = await getPartners();
  const partner = currentPartners.find((p) => p.id === partnerId);
  if (!partner) throw new Error('Mitra tidak ditemukan');

  const newProgram: PartnerProgram = {
    ...programData,
    id: generateId('prog'),
  };

  const updatedPrograms = [...partner.programs, newProgram];
  return updatePartner(partnerId, { programs: updatedPrograms });
}

/**
 * Menghapus program kolaborasi dari mitra
 */
export async function deleteProgramFromPartner(
  partnerId: string,
  programId: string
): Promise<Partner> {
  const currentPartners = await getPartners();
  const partner = currentPartners.find((p) => p.id === partnerId);
  if (!partner) throw new Error('Mitra tidak ditemukan');

  const updatedPrograms = partner.programs.filter((p) => p.id !== programId);
  return updatePartner(partnerId, { programs: updatedPrograms });
}

/**
 * Reset data mitra ke nilai awal
 */
export async function resetPartnersToDefault(): Promise<Partner[]> {
  localStorage.setItem(LOCAL_PARTNERS_KEY, JSON.stringify(INITIAL_PARTNERS_DATA));
  return INITIAL_PARTNERS_DATA;
}
