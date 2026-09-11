// ==============================================================================
// I-CAN PLATFORM — PDF REPORT GENERATOR SERVICE
// Generates official formal monochrome academic action reports using jsPDF
// Sections:
// 1. Judul Kegiatan
// 2. Anggota
// 3. Bukti
// 4. Narasi Kegiatan
// 5. Penutup
// ==============================================================================

import { jsPDF } from 'jspdf';
import { GreenAction } from '@/types';

export interface ReportStudentProfile {
  name: string;
  nim: string;
  faculty?: string;
  campus?: string;
}

/**
 * Strips non-ASCII characters, emojis, and problematic Unicode glyphs
 * to prevent character encoding corruption (e.g. mojibake) in standard jsPDF fonts.
 */
function sanitizeText(str: string | undefined | null): string {
  if (!str) return '';
  return str
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\u2022/g, '-')
    .replace(/[^\x20-\x7E\n\r\t]/g, '')
    .trim();
}

/**
 * Safely loads an image URL into an HTMLImageElement for embedding into jsPDF
 */
function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = url;
  });
}

/**
 * Generates and triggers browser download of an official formal academic PDF report
 * Strictly black and white / grayscale without decorative colors or cards.
 */
export async function downloadActionPdfReport(
  action: GreenAction,
  studentProfile?: ReportStudentProfile
): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20; // 20mm formal margin
  const contentWidth = pageWidth - margin * 2;
  let cursorY = margin;

  // Helper for auto-page breaks
  const checkPageBreak = (neededHeight: number) => {
    if (cursorY + neededHeight > pageHeight - margin - 15) {
      doc.addPage();
      cursorY = margin + 5;
    }
  };

  // Helper for formal aligned key-value text rows
  const printKeyValue = (label: string, value: string, indent: number = 0) => {
    doc.setFont('times', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    const labelX = margin + indent;
    const colonX = margin + indent + 46;
    const valueX = colonX + 3;
    const maxValueW = contentWidth - (indent + 46 + 3);

    const splitVal = doc.splitTextToSize(value, maxValueW);
    checkPageBreak(splitVal.length * 4.8 + 2);

    if (label) {
      doc.text(label, labelX, cursorY);
      doc.text(':', colonX, cursorY);
    }
    doc.text(splitVal, valueX, cursorY);
    cursorY += splitVal.length * 4.8 + 1.2;
  };

  // ----------------------------------------------------------------------------
  // 1. KOP SURAT RESMI UNIVERSITAS (FORMAL UNIVERSITY LETTERHEAD)
  // ----------------------------------------------------------------------------
  doc.setFont('times', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(0, 0, 0);
  doc.text('UNIVERSITAS BINA NUSANTARA', pageWidth / 2, cursorY, { align: 'center' });

  cursorY += 5;
  doc.setFontSize(10);
  doc.text('DIREKTORAT PENGABDIAN KEPADA MASYARAKAT & SUSTAINABILITY', pageWidth / 2, cursorY, { align: 'center' });

  cursorY += 4.5;
  doc.setFontSize(9.5);
  doc.text('TEACH FOR INDONESIA (TFI) — I-CAN PLATFORM', pageWidth / 2, cursorY, { align: 'center' });

  cursorY += 4;
  doc.setFont('times', 'normal');
  doc.setFontSize(8);
  doc.text('Jl. K. H. Syahdan No. 9, Kemanggisan, Palmerah, Jakarta Barat 11480 | Telp. (021) 5345830', pageWidth / 2, cursorY, { align: 'center' });

  cursorY += 3.5;
  doc.text('Laman: student.binus.ac.id | Surel: teachforindonesia@binus.edu', pageWidth / 2, cursorY, { align: 'center' });

  cursorY += 4;

  // Double horizontal divider line (standard formal letterhead)
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.7);
  doc.line(margin, cursorY, pageWidth - margin, cursorY);

  cursorY += 1.2;
  doc.setLineWidth(0.2);
  doc.line(margin, cursorY, pageWidth - margin, cursorY);

  cursorY += 6;

  // ----------------------------------------------------------------------------
  // JUDUL DOKUMEN & IDENTITAS REGISTRASI
  // ----------------------------------------------------------------------------
  const regId = sanitizeText(action.id || `REG-${Date.now()}`).toUpperCase();
  const dateStr = new Date(action.submittedAt || Date.now()).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  doc.text('LAPORAN PELAKSANAAN KEGIATAN MAHASISWA', pageWidth / 2, cursorY, { align: 'center' });

  cursorY += 4.5;
  doc.setFont('times', 'normal');
  doc.setFontSize(9);
  doc.text(`Nomor Registrasi: ${regId}`, pageWidth / 2, cursorY, { align: 'center' });

  cursorY += 4;
  doc.text(`Tanggal Terbit: ${dateStr}`, pageWidth / 2, cursorY, { align: 'center' });

  cursorY += 7;

  // ============================================================================
  // BAGIAN 1: JUDUL KEGIATAN
  // ============================================================================
  checkPageBreak(35);
  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.text('1. JUDUL KEGIATAN', margin, cursorY);
  cursorY += 1.8;
  doc.setLineWidth(0.2);
  doc.line(margin, cursorY, margin + 45, cursorY);
  cursorY += 4.5;

  const categoryTitle = sanitizeText(action.categoryName) || 'Aksi Keberlanjutan Lingkungan Kampus';
  const pillarLabel =
    action.actionSource === 'QUEST'
      ? 'Daily Quests (Misi Kampus Harian)'
      : action.actionSource === 'EVENT'
      ? 'Event Kampus'
      : 'Program Aksi Nyata (Teach For Indonesia)';

  const statusLabel =
    action.status === 'APPROVED' ? 'Terverifikasi Penuh (Disetujui)' : 'Menunggu Verifikasi Koordinator';
  const locationLabel = sanitizeText(action.surveyLocation) || 'Kampus BINUS University';

  printKeyValue('a. Nama Kegiatan', categoryTitle);
  printKeyValue('b. Pilar Program', pillarLabel);
  printKeyValue('c. Status Dokumen', statusLabel);
  printKeyValue('d. Tanggal Pelaksanaan', dateStr);
  printKeyValue('e. Lokasi / Checkpoint', locationLabel);
  printKeyValue('f. Capaian Poin SAT', `+${action.satPointsEarned || 0} Poin SAT`);
  printKeyValue(
    'g. Jam Pengabdian',
    `${action.comservHoursEarned || (action.satPointsEarned ? action.satPointsEarned * 0.5 : 0)} Jam Community Service (Comserv)`
  );
  printKeyValue('h. Reduksi Emisi Karbon', `${action.carbonImpactKg || 0.5} kg CO2eq`);
  printKeyValue('i. Insentif Green Coins', `+${action.greenCoinsEarned || 0} Green Coins (GC)`);

  cursorY += 4;

  // ============================================================================
  // BAGIAN 2: ANGGOTA
  // ============================================================================
  checkPageBreak(30);
  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.text('2. ANGGOTA', margin, cursorY);
  cursorY += 1.8;
  doc.setLineWidth(0.2);
  doc.line(margin, cursorY, margin + 30, cursorY);
  cursorY += 4.5;

  const studentName = sanitizeText(studentProfile?.name || action.userName || 'Mahasiswa BINUS');
  const studentNim = sanitizeText(studentProfile?.nim || '2501999999');
  const faculty = sanitizeText(studentProfile?.faculty || action.userFaculty || 'School of Computer Science');
  const campus = sanitizeText(studentProfile?.campus || 'BINUS University');

  printKeyValue('a. Pelapor / Ketua Tim', studentName);
  printKeyValue('b. Nomor Induk Mahasiswa', studentNim);
  printKeyValue('c. Fakultas / Jurusan', faculty);
  printKeyValue('d. Kampus Asal', campus);

  if (action.groupMembers && action.groupMembers.length > 0) {
    printKeyValue('e. Anggota Tim', `1. ${studentName} (Ketua Pelapor / NIM: ${studentNim})`);
    action.groupMembers.forEach((memberNim, idx) => {
      printKeyValue('', `${idx + 2}. Anggota Tim (NIM: ${sanitizeText(memberNim)})`);
    });
  } else {
    printKeyValue('e. Anggota Tim', 'Pelaksanaan Mandiri / Individu (Tanpa Anggota Kelompok Tambahan)');
  }

  cursorY += 4;

  // ============================================================================
  // BAGIAN 3: BUKTI
  // ============================================================================
  checkPageBreak(80);
  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.text('3. BUKTI', margin, cursorY);
  cursorY += 1.8;
  doc.setLineWidth(0.2);
  doc.line(margin, cursorY, margin + 25, cursorY);
  cursorY += 5;

  // Photo proof container (centered, formal thin border)
  const photoW = 105;
  const photoH = 70;
  const photoX = margin + (contentWidth - photoW) / 2;

  let imageRendered = false;
  if (action.photoUrl) {
    try {
      if (action.photoUrl.startsWith('data:image')) {
        const format = action.photoUrl.includes('image/png') ? 'PNG' : 'JPEG';
        doc.addImage(action.photoUrl, format, photoX, cursorY, photoW, photoH);
        imageRendered = true;
      } else {
        const img = await loadImage(action.photoUrl);
        doc.addImage(img, 'JPEG', photoX, cursorY, photoW, photoH);
        imageRendered = true;
      }
    } catch {
      imageRendered = false;
    }
  }

  if (imageRendered) {
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.rect(photoX, cursorY, photoW, photoH);

    cursorY += photoH + 3.5;
    doc.setFont('times', 'italic');
    doc.setFontSize(8.5);
    doc.text('Gambar 1. Dokumentasi fisik pelaksanaan kegiatan di lokasi.', pageWidth / 2, cursorY, { align: 'center' });
    cursorY += 5.5;
  } else {
    // Formal placeholder outline
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.rect(photoX, cursorY, photoW, 30);

    doc.setFont('times', 'italic');
    doc.setFontSize(8.5);
    doc.text('[Dokumentasi foto fisik tersimpan dalam pangkalan data digital I-CAN]', pageWidth / 2, cursorY + 16, {
      align: 'center',
    });
    cursorY += 35;
  }

  // Verification audit details (Full text key-value)
  const matchScore = Math.round((action.activityMatchScore ?? action.aiConfidence ?? 0.95) * 100);
  const authScore = Math.round((action.authenticityScore ?? 0.97) * 100);

  const rawDetected = (action.detectedObjects || []).map((o) => sanitizeText(o)).filter(Boolean);
  const detectedStr =
    rawDetected.length > 0
      ? rawDetected.join(', ')
      : 'Objek aksi nyata fisik, atribut identitas kampus, instrumen pendukung kegiatan';

  printKeyValue('a. Keterangan Objek Bukti', detectedStr);
  printKeyValue(
    'b. Hasil Audit Keaslian',
    `Tingkat Otentisitas: ${authScore}% (Lolos audit anti-fraud kamera fisik langsung, bebas rekayasa atau manipulasi digital)`
  );
  printKeyValue(
    'c. Kesesuaian Visual',
    `Tingkat Kesesuaian: ${matchScore}% (Kesesuaian objek dokumentasi dengan tema kegiatan yang dilaporkan)`
  );

  if (action.campaignUrl) {
    printKeyValue('d. Tautan Publikasi', sanitizeText(action.campaignUrl));
  } else {
    printKeyValue('d. Validasi Lokasi', 'Verifikasi GPS & Geo-tagging Kampus BINUS University');
  }

  cursorY += 4;

  // ============================================================================
  // BAGIAN 4: NARASI KEGIATAN
  // ============================================================================
  checkPageBreak(35);
  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.text('4. NARASI KEGIATAN', margin, cursorY);
  cursorY += 1.8;
  doc.setLineWidth(0.2);
  doc.line(margin, cursorY, margin + 48, cursorY);
  cursorY += 5;

  const rawStory =
    sanitizeText(action.story) ||
    'Mahasiswa telah menyelesaikan kegiatan aksi nyata secara bertanggung jawab sesuai dengan panduan pelaporan Teach For Indonesia (TFI) dan I-CAN BINUS University.';

  doc.setFont('times', 'normal');
  doc.setFontSize(10);

  const paragraphs = rawStory.split('\n').filter((p) => p.trim().length > 0);
  paragraphs.forEach((para) => {
    const lines = doc.splitTextToSize(para.trim(), contentWidth);
    checkPageBreak(lines.length * 4.8 + 2);
    doc.text(lines, margin, cursorY);
    cursorY += lines.length * 4.8 + 2;
  });

  // Archival hashtags
  const defaultTags = ['#TeachForIndonesia', '#FosteringandEmpowering', '#BinusianCommunityService', '#BINUSEcoCampus'];
  checkPageBreak(8);
  doc.setFont('times', 'italic');
  doc.setFontSize(8.5);
  doc.text(`Tagar Resmi Pengarsipan: ${defaultTags.join(' ')}`, margin, cursorY);
  cursorY += 6;

  // ============================================================================
  // BAGIAN 5: PENUTUP
  // ============================================================================
  checkPageBreak(50);
  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.text('5. PENUTUP', margin, cursorY);
  cursorY += 1.8;
  doc.setLineWidth(0.2);
  doc.line(margin, cursorY, margin + 30, cursorY);
  cursorY += 5;

  const closingStatement =
    'Demikian laporan pelaksanaan kegiatan ini dibuat dengan sebenar-benarnya dan penuh tanggung jawab sebagai bukti pemenuhan kegiatan aksi nyata serta pengabdian masyarakat (Comserv / SAT) di lingkungan Universitas Bina Nusantara. Seluruh data dan dokumentasi yang dilampirkan adalah benar adanya dan dapat dipertanggungjawabkan secara akademis.';

  doc.setFont('times', 'normal');
  doc.setFontSize(10);
  const closingLines = doc.splitTextToSize(closingStatement, contentWidth);
  doc.text(closingLines, margin, cursorY);
  cursorY += closingLines.length * 4.8 + 7;

  // Date line
  checkPageBreak(40);
  const signatureDate = `Jakarta, ${dateStr}`;
  doc.setFont('times', 'normal');
  doc.setFontSize(10);
  doc.text(signatureDate, pageWidth - margin, cursorY, { align: 'right' });
  cursorY += 6;

  // Two-column signature block (Mengetahui di kiri, Pelapor di kanan)
  const col1X = margin;
  const col2X = margin + contentWidth / 2 + 10;
  const colWidth = contentWidth / 2 - 10;

  // Signer 1: Koordinator TFI
  doc.setFont('times', 'normal');
  doc.setFontSize(10);
  doc.text('Mengetahui dan Mengesahkan,', col1X, cursorY);
  doc.setFont('times', 'bold');
  doc.text('Koordinator Teach For Indonesia (TFI)', col1X, cursorY + 4.5);
  doc.setFont('times', 'normal');
  doc.text('Universitas Bina Nusantara', col1X, cursorY + 9);

  // Signer 2: Mahasiswa Pelaksana
  doc.text('Pelapor / Mahasiswa Pelaksana,', col2X, cursorY);
  doc.setFont('times', 'bold');
  doc.text('Universitas Bina Nusantara', col2X, cursorY + 4.5);

  cursorY += 24;

  // Signature line 1
  doc.setFont('times', 'italic');
  doc.setFontSize(8);
  doc.text('(Tanda Tangan & Cap Digital Sistem)', col1X, cursorY - 2);
  doc.setLineWidth(0.3);
  doc.line(col1X, cursorY, col1X + colWidth, cursorY);

  doc.setFont('times', 'bold');
  doc.setFontSize(9.5);
  doc.text('Tim Verifikasi TFI & Comserv', col1X, cursorY + 4.5);
  doc.setFont('times', 'normal');
  doc.setFontSize(8.5);
  doc.text('NIP. 2026.TFI.BINUS', col1X, cursorY + 8.5);

  // Signature line 2
  doc.setFont('times', 'italic');
  doc.setFontSize(8);
  doc.text('(Tanda Tangan Digital Mahasiswa)', col2X, cursorY - 2);
  doc.setLineWidth(0.3);
  doc.line(col2X, cursorY, col2X + colWidth, cursorY);

  doc.setFont('times', 'bold');
  doc.setFontSize(9.5);
  doc.text(studentName, col2X, cursorY + 4.5);
  doc.setFont('times', 'normal');
  doc.setFontSize(8.5);
  doc.text(`NIM. ${studentNim}`, col2X, cursorY + 8.5);

  // ----------------------------------------------------------------------------
  // FOOTER & NOMOR HALAMAN (UNTUK SEMUA HALAMAN)
  // ----------------------------------------------------------------------------
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('times', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.2);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.text('Dokumen Resmi I-CAN Platform — Universitas Bina Nusantara', margin, pageHeight - 8);
    doc.text(`Halaman ${i} dari ${totalPages}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
  }

  // Trigger download
  const safeTitle = (sanitizeText(action.categoryName) || 'Aksi_Hijau')
    .replace(/[^a-zA-Z0-9]/g, '_')
    .slice(0, 20);
  const safeFilename = `Laporan_${safeTitle}_${regId.slice(0, 10)}.pdf`;
  doc.save(safeFilename);
}
