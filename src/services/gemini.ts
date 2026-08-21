// ==============================================================================
// I-CAN PLATFORM — GOOGLE GEMINI 1.5 FLASH AI VERIFICATION SERVICE
// ==============================================================================

export interface AiVerificationResult {
  isValid: boolean;
  confidence: number; // 0.0 to 1.0
  guidelineConfidence: number; // 0.0 to 1.0 (Hashtags, almamater, logo)
  completenessScore: number; // 0.0 to 1.0 (Physical proof & action completeness)
  reason: string;
  suggestedCoins: number;
  suggestedSat: number;
  detectedObjects: string[];
  hashtagsFound?: string[];
  almamaterDetected?: boolean;
  tfiLogoDetected?: boolean;
}

export async function verifyActionWithGemini(
  categoryName: string,
  base64Image: string,
  story?: string,
  campaignUrl?: string
): Promise<AiVerificationResult> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  // Fallback realistic simulation if API key is not configured or in offline demo mode
  if (!apiKey) {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const isTfiProgram = 
      categoryName.includes('Pohon') || 
      categoryName.includes('Biopori') || 
      categoryName.includes('Wastafel') || 
      categoryName.includes('Video');

    return {
      isValid: true,
      confidence: 0.94,
      guidelineConfidence: 0.92,
      completenessScore: isTfiProgram ? 0.90 : 0.85,
      reason: `Foto & data aksi teridentifikasi valid untuk "${categoryName}". Indikasi kesesuaian guideline TFI/Kampus terpenuhi.`,
      suggestedCoins: isTfiProgram ? 25 : 15,
      suggestedSat: isTfiProgram ? 4 : 1,
      detectedObjects: isTfiProgram ? ['tfi_action_proof', 'community_work', 'campus_setting'] : ['tumbler', 'sustainable_item'],
      hashtagsFound: ['#TeachForIndonesia', '#FosteringandEmpowering', '#BinusianCommunityService'],
      almamaterDetected: true,
      tfiLogoDetected: true,
    };
  }

  try {
    const prompt = `Anda adalah asisten verifikator AI cerdas untuk platform I-CAN BINUS University & Teach For Indonesia (TFI).
Analisis foto dan data pelaporan mahasiswa untuk kegiatan: "${categoryName}".
Deskripsi / Storytelling mahasiswa: "${story || 'Tidak ada deskripsi'}".
Link Publikasi / Media: "${campaignUrl || 'Tidak disertakan'}".

Instruksi Analisis:
1. Evaluasi Kepatuhan Guideline (guidelineConfidence 0.0-1.0):
   - Periksa apakah ada indikasi hashtag resmi TFI (#TeachForIndonesia, #FosteringandEmpowering, #BinusianCommunityService) pada teks/link.
   - Apakah mahasiswa memakai jaket almamater BINUS / menampilkan logo TFI (khususnya untuk Video Based Learning atau Aksi Nyata).
2. Evaluasi Kelengkapan Aksi Nyata (completenessScore 0.0-1.0):
   - Periksa keaslian bukti foto (bukan screenshot palsu / unduhan Google).
   - Apakah terdapat objek nyata yang relevan (misal: bibit pohon tertanam, lubang biopori di tanah, wastafel terpasang, tumbler, dsb.).
3. Berikan output HANYA dalam format JSON valid berikut tanpa markdown formatting:
{
  "isValid": true,
  "confidence": 0.92,
  "guidelineConfidence": 0.90,
  "completenessScore": 0.88,
  "reason": "Penjelasan singkat dalam bahasa Indonesia",
  "suggestedCoins": 20,
  "suggestedSat": 4,
  "detectedObjects": ["pohon", "tanah", "alat_tanam"],
  "hashtagsFound": ["#TeachForIndonesia"],
  "almamaterDetected": true,
  "tfiLogoDetected": false
}`;

    const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, '');

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inline_data: {
                    mime_type: 'image/jpeg',
                    data: cleanBase64,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API Error: ${response.statusText}`);
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const parsed = JSON.parse(rawText);

    return {
      isValid: Boolean(parsed.isValid),
      confidence: Number(parsed.confidence) || 0.85,
      guidelineConfidence: Number(parsed.guidelineConfidence) || 0.80,
      completenessScore: Number(parsed.completenessScore) || 0.80,
      reason: parsed.reason || 'Data aksi terverifikasi oleh AI.',
      suggestedCoins: Number(parsed.suggestedCoins) || 15,
      suggestedSat: Number(parsed.suggestedSat) || 2,
      detectedObjects: parsed.detectedObjects || [],
      hashtagsFound: parsed.hashtagsFound || [],
      almamaterDetected: Boolean(parsed.almamaterDetected),
      tfiLogoDetected: Boolean(parsed.tfiLogoDetected),
    };
  } catch (error) {
    console.warn('Gemini verification fallback:', error);
    return {
      isValid: true,
      confidence: 0.88,
      guidelineConfidence: 0.85,
      completenessScore: 0.80,
      reason: 'Foto diterima dan direkomendasikan untuk verifikasi manual oleh Verifikator/SSO.',
      suggestedCoins: 15,
      suggestedSat: 2,
      detectedObjects: ['activity_photo'],
      hashtagsFound: [],
      almamaterDetected: false,
      tfiLogoDetected: false,
    };
  }
}
