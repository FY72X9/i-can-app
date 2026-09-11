---
type: "query"
date: "2026-09-11T10:34:34.744411+00:00"
question: "tambahkan opsi untuk menambah anggota mahasiswa di kirim bukti aksi, karena bisa saja aksi yang dilakukan berkelompok. dan di menu manajemen event penyelenggara bisa memberikan opsi berapa maksimal mahasiswa yang bisa ditambahkan. sebelum implementasi pelajari perbaikan fitur yang saya ajukan menggunakan graphify untuk melihat bagian mana yang terdampak"
contributor: "graphify"
outcome: "useful"
source_nodes: ["CampusEvent", "GreenAction", "createEvent", "submitGreenAction", "UploadPage", "AdminLtePage"]
---

# Q: tambahkan opsi untuk menambah anggota mahasiswa di kirim bukti aksi, karena bisa saja aksi yang dilakukan berkelompok. dan di menu manajemen event penyelenggara bisa memberikan opsi berapa maksimal mahasiswa yang bisa ditambahkan. sebelum implementasi pelajari perbaikan fitur yang saya ajukan menggunakan graphify untuk melihat bagian mana yang terdampak

## Answer

Expanded from original query via vocab: [action, actions, upload, event, events, organizer, member, members, group, student, submit, admin]. Traversal from start nodes [groupMembers, setGroupMembers], getEventsByOrganizer(), submitGreenAction() mapped the impact across 3 layers: (1) Data Models (CampusEvent in src/types/index.ts, eventService.ts) where maxGroupMembers needs to be added to support event-level team size limits; (2) Event Management (AdminLtePage.tsx) where event creation/edit form needs group submission toggle and max members input, and event card/table needs group badge; (3) Action Submission (UploadPage.tsx) where team members addition UI must activate for events when maxGroupMembers > 0 and pass groupMembers to submitGreenAction(); and (4) Verifier Review (AdminLtePage.tsx evidence modal & VerificationPage.tsx) ensuring panitia and admins see team members.

## Outcome

- Signal: useful

## Source Nodes

- CampusEvent
- GreenAction
- createEvent
- submitGreenAction
- UploadPage
- AdminLtePage