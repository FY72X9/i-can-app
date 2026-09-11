---
type: "query"
date: "2026-09-11T07:29:17.460286+00:00"
question: "Pelajari alur kirim bukti aksi untuk disesuaikan dengan event, daily quests, dan program aksi nyata"
contributor: "graphify"
outcome: "useful"
source_nodes: ["UploadPage()", "DailyQuest", "ActionProgram", "CampusEvent", "submitGreenAction()"]
---

# Q: Pelajari alur kirim bukti aksi untuk disesuaikan dengan event, daily quests, dan program aksi nyata

## Answer

Expanded from original query via vocab: upload action event quest daily program detail form page. UploadPage menghubungkan bukti aksi (submitGreenAction) dengan eventService (getEventById, CampusEvent, EventActivity) dan questProgramService (getActionPrograms, ActionProgram, DailyQuest). Saat ini UploadPage hanya fokus pada Program Aksi Nyata (TFI) dengan mode Pra-Survei K3 vs Laporan Akhir, dan banner kecil untuk eventId. Diperlukan penyesuaian agar UploadPage mendukung secara utuh 3 tipe aksi: Event Kampus, Daily Quests (Misi Harian), dan Program Aksi Nyata TFI.

## Outcome

- Signal: useful

## Source Nodes

- UploadPage()
- DailyQuest
- ActionProgram
- CampusEvent
- submitGreenAction()