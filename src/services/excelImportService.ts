// ==============================================================================
// I-CAN PLATFORM — EXCEL STUDENT IMPORT SERVICE
// Powered by SheetJS (xlsx) for in-browser high-performance parsing & validation
// ==============================================================================

import * as XLSX from 'xlsx';
import { UserProfile } from '@/types';

export interface ParsedStudentRow {
  rowNumber: number; // Row index in Excel (2-based for data rows, assuming row 1 is header)
  nim: string;
  fullName: string;
  email: string;
  facultyName: string;
  status: 'valid' | 'duplicate_system' | 'duplicate_file' | 'invalid';
  errors: string[];
  warnings: string[];
  existingUser?: UserProfile;
}

export interface ExcelParseResult {
  fileName: string;
  sheetName: string;
  totalRows: number;
  validRows: ParsedStudentRow[];
  duplicateRows: ParsedStudentRow[];
  invalidRows: ParsedStudentRow[];
  allRows: ParsedStudentRow[];
  detectedHeaders: {
    nim: string | null;
    fullName: string | null;
    email: string | null;
    program: string | null;
  };
  missingHeaders: string[];
}

/**
 * Normalizes header string to assist fuzzy matching
 */
function normalizeHeaderKey(key: string): string {
  return key
    .toLowerCase()
    .replace(/[_\-\s]+/g, ' ')
    .trim();
}

/**
 * Identifies column mapping for NIM, Nama Lengkap, Email BINUS, and Program
 */
function matchHeaders(headers: string[]): {
  nimCol: number;
  nameCol: number;
  emailCol: number;
  progCol: number;
  detected: {
    nim: string | null;
    fullName: string | null;
    email: string | null;
    program: string | null;
  };
  missing: string[];
} {
  let nimCol = -1;
  let nameCol = -1;
  let emailCol = -1;
  let progCol = -1;

  const detected = {
    nim: null as string | null,
    fullName: null as string | null,
    email: null as string | null,
    program: null as string | null,
  };

  headers.forEach((h, idx) => {
    if (!h) return;
    const clean = normalizeHeaderKey(String(h));

    // NIM matching
    if (nimCol === -1 && (clean === 'nim' || clean.includes('nim') || clean.includes('student id') || clean.includes('nomor induk'))) {
      nimCol = idx;
      detected.nim = String(h);
    }
    // Nama Lengkap matching
    else if (nameCol === -1 && (clean === 'nama lengkap' || clean === 'nama' || clean.includes('full name') || clean.includes('fullname') || clean.includes('student name'))) {
      nameCol = idx;
      detected.fullName = String(h);
    }
    // Email BINUS matching
    else if (emailCol === -1 && (clean === 'email binus' || clean === 'email' || clean.includes('binus email') || clean.includes('email binusian') || clean.includes('mail'))) {
      emailCol = idx;
      detected.email = String(h);
    }
    // Program matching
    else if (progCol === -1 && (clean === 'program' || clean === 'program studi' || clean === 'prodi' || clean === 'jurusan' || clean === 'fakultas' || clean === 'faculty' || clean.includes('study program'))) {
      progCol = idx;
      detected.program = String(h);
    }
  });

  const missing: string[] = [];
  if (nimCol === -1) missing.push('NIM');
  if (nameCol === -1) missing.push('Nama Lengkap');
  if (emailCol === -1) missing.push('Email BINUS');
  if (progCol === -1) missing.push('Program');

  return { nimCol, nameCol, emailCol, progCol, detected, missing };
}

/**
 * Safely coerces a cell value to trimmed string, handling numbers like 2602158890
 */
function cellToString(val: any): string {
  if (val === null || val === undefined) return '';
  if (typeof val === 'number') {
    // If it's an integer, avoid exponential or float formatting
    return Math.trunc(val).toString();
  }
  return String(val).trim();
}

/**
 * Parses an Excel (.xlsx, .xls) or .csv file and validates each student record
 */
export async function parseStudentExcel(
  file: File,
  existingAccounts: UserProfile[] = []
): Promise<ExcelParseResult> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array', cellDates: true });

  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) {
    throw new Error('File Excel tidak memiliki lembar kerja (worksheet).');
  }

  const worksheet = workbook.Sheets[firstSheetName];
  // Convert sheet to array of arrays
  const rawRows: any[][] = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    blankrows: false,
    defval: '',
  });

  if (rawRows.length === 0) {
    throw new Error('File Excel kosong atau tidak memiliki data.');
  }

  // Find header row: scan first 5 rows to locate header matching NIM or Nama
  let headerRowIndex = 0;
  let headerMatch = matchHeaders(rawRows[0].map(cellToString));

  for (let r = 0; r < Math.min(rawRows.length, 5); r++) {
    const candidateMatch = matchHeaders(rawRows[r].map(cellToString));
    // If at least 2 key headers matched, consider this the header row
    const matchedCount = 4 - candidateMatch.missing.length;
    if (matchedCount >= 2) {
      headerRowIndex = r;
      headerMatch = candidateMatch;
      break;
    }
  }

  const { nimCol, nameCol, emailCol, progCol, detected, missing } = headerMatch;

  if (missing.length > 2) {
    throw new Error(
      `Format header Excel tidak sesuai. Kolom wajib yang tidak ditemukan: ${missing.join(', ')}. Pastikan baris header memuat kolom: NIM, Nama Lengkap, Email BINUS, Program.`
    );
  }

  // Prepare existing lookup sets
  const existingByNim = new Map<string, UserProfile>();
  const existingByEmail = new Map<string, UserProfile>();
  existingAccounts.forEach((acc) => {
    if (acc.nim) existingByNim.set(acc.nim.toLowerCase().trim(), acc);
    if (acc.email) existingByEmail.set(acc.email.toLowerCase().trim(), acc);
  });

  // Track duplicates within file
  const seenFileNims = new Set<string>();
  const seenFileEmails = new Set<string>();

  const allRows: ParsedStudentRow[] = [];
  const validRows: ParsedStudentRow[] = [];
  const duplicateRows: ParsedStudentRow[] = [];
  const invalidRows: ParsedStudentRow[] = [];

  // Data rows start after headerRowIndex
  for (let i = headerRowIndex + 1; i < rawRows.length; i++) {
    const row = rawRows[i];
    if (!row || row.length === 0) continue;

    const rawNim = nimCol !== -1 ? cellToString(row[nimCol]) : '';
    const rawName = nameCol !== -1 ? cellToString(row[nameCol]) : '';
    const rawEmail = emailCol !== -1 ? cellToString(row[emailCol]) : '';
    const rawProg = progCol !== -1 ? cellToString(row[progCol]) : '';

    // Ignore row if completely empty
    if (!rawNim && !rawName && !rawEmail && !rawProg) {
      continue;
    }

    const rowNumber = i + 1; // 1-indexed spreadsheet row
    const errors: string[] = [];
    const warnings: string[] = [];

    // 1. Validate NIM
    let cleanNim = rawNim.replace(/\D/g, ''); // Extract digits
    if (!cleanNim) {
      errors.push('NIM tidak boleh kosong.');
    } else if (cleanNim.length !== 10) {
      errors.push(`NIM harus 10 digit angka (ditemukan ${cleanNim.length} digit: "${rawNim}").`);
    }

    // 2. Validate Nama Lengkap
    const cleanName = rawName.trim();
    if (!cleanName) {
      errors.push('Nama lengkap tidak boleh kosong.');
    } else if (cleanName.length < 2) {
      errors.push('Nama lengkap terlalu pendek.');
    }

    // 3. Validate Email
    const cleanEmail = rawEmail.trim().toLowerCase();
    if (!cleanEmail) {
      errors.push('Email tidak boleh kosong.');
    } else if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      errors.push(`Format email tidak valid ("${rawEmail}").`);
    } else if (!cleanEmail.endsWith('@binus.ac.id') && !cleanEmail.endsWith('@binus.edu')) {
      warnings.push('Domain email disarankan menggunakan @binus.ac.id');
    }

    // 4. Validate Program
    let cleanProg = rawProg.trim();
    if (!cleanProg) {
      cleanProg = 'School of Computer Science';
      warnings.push('Program kosong, menggunakan default "School of Computer Science".');
    }

    // Check duplicate within file
    let status: ParsedStudentRow['status'] = errors.length > 0 ? 'invalid' : 'valid';
    let matchedExisting: UserProfile | undefined;

    if (status === 'valid') {
      const lowerNim = cleanNim.toLowerCase();
      const lowerEmail = cleanEmail.toLowerCase();

      if (seenFileNims.has(lowerNim)) {
        status = 'duplicate_file';
        errors.push(`NIM ${cleanNim} terduplikasi di dalam file ini.`);
      } else if (seenFileEmails.has(lowerEmail)) {
        status = 'duplicate_file';
        errors.push(`Email ${cleanEmail} terduplikasi di dalam file ini.`);
      } else {
        seenFileNims.add(lowerNim);
        seenFileEmails.add(lowerEmail);

        // Check duplicate against existing system accounts
        const existingNimAcc = existingByNim.get(lowerNim);
        const existingEmailAcc = existingByEmail.get(lowerEmail);

        if (existingNimAcc || existingEmailAcc) {
          status = 'duplicate_system';
          matchedExisting = existingNimAcc || existingEmailAcc;
          warnings.push(
            `Akun sudah terdaftar di sistem (${matchedExisting?.fullName || 'Akun ada'}).`
          );
        }
      }
    }

    const studentRow: ParsedStudentRow = {
      rowNumber,
      nim: cleanNim || rawNim,
      fullName: cleanName,
      email: cleanEmail,
      facultyName: cleanProg,
      status,
      errors,
      warnings,
      existingUser: matchedExisting,
    };

    allRows.push(studentRow);
    if (status === 'valid') {
      validRows.push(studentRow);
    } else if (status === 'duplicate_system' || status === 'duplicate_file') {
      duplicateRows.push(studentRow);
    } else {
      invalidRows.push(studentRow);
    }
  }

  return {
    fileName: file.name,
    sheetName: firstSheetName,
    totalRows: allRows.length,
    validRows,
    duplicateRows,
    invalidRows,
    allRows,
    detectedHeaders: detected,
    missingHeaders: missing,
  };
}

/**
 * Generates and triggers download of a standardized Excel template for BINUS students
 */
export function downloadStudentTemplate(format: 'xlsx' | 'csv' = 'xlsx'): void {
  const sampleData = [
    ['NIM', 'Nama Lengkap', 'Email BINUS', 'Program'],
    ['2602158890', 'Budi Santoso', 'budi.santoso@binus.ac.id', 'Computer Science'],
    ['2602158891', 'Siti Rahmawati', 'siti.rahmawati@binus.ac.id', 'Information Systems'],
    ['2602158892', 'Kevin Wijaya', 'kevin.wijaya@binus.ac.id', 'Visual Communication Design'],
    ['2602158893', 'Putri Ayu Lestari', 'putri.lestari@binus.ac.id', 'Cyber Security'],
    ['2602158894', 'Michael Jonathan', 'michael.jonathan@binus.ac.id', 'Data Science'],
  ];

  const ws = XLSX.utils.aoa_to_sheet(sampleData);

  // Set column widths for optimal display in Excel
  ws['!cols'] = [
    { wch: 16 }, // NIM
    { wch: 26 }, // Nama Lengkap
    { wch: 32 }, // Email BINUS
    { wch: 30 }, // Program
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Template Mahasiswa');
  const fileName = `Template_Import_Mahasiswa_BINUS.${format}`;
  try {
    const wbout = XLSX.write(wb, { bookType: format, type: 'array' });
    const mimeType =
      format === 'xlsx'
        ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        : 'text/csv;charset=utf-8;';
    const blob = new Blob([wbout], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (err) {
    console.error('Failed to download template via blob, fallback to XLSX.writeFile:', err);
    XLSX.writeFile(wb, fileName, { bookType: format });
  }
}

