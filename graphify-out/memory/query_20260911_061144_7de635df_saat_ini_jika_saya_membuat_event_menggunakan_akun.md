---
type: "query"
date: "2026-09-11T06:11:44.810553+00:00"
question: "saat ini jika saya membuat event menggunakan akun organizer/superadmin, jika belum tanggalnya tidak tampil di dashboard. saya mau ada tampilan event walaupun belum dibuka hari ini, misal upcoming event, event hari ini, event yang berlalu."
contributor: "graphify"
outcome: "useful"
source_nodes: ["src_services_eventservice_getactiveevents", "src_pages_homepage_homepage", "src_pages_eventspage_eventspage", "src_pages_adminltepage_adminltepage"]
---

# Q: saat ini jika saya membuat event menggunakan akun organizer/superadmin, jika belum tanggalnya tidak tampil di dashboard. saya mau ada tampilan event walaupun belum dibuka hari ini, misal upcoming event, event hari ini, event yang berlalu.

## Answer

Expanded from original query via vocab: [event, admin, update, homepage, eventspage, getactiveevents, getevents]. Traversed impact across graph nodes: src_services_eventservice_getactiveevents, src_pages_homepage_homepage, src_pages_eventspage_eventspage, src_pages_adminltepage_adminltepage, src_pages_eventdetailpage_eventdetailpage, src_components_common_qrscannermodal. Root cause: getActiveEvents() filters out future startDate, and HomePage hides section if activeEvents is empty. Solution: introduce timeline categorization (TODAY, UPCOMING, PAST) in eventService and render timeline tabs/sections in HomePage, EventsPage, and AdminLtePage.

## Outcome

- Signal: useful

## Source Nodes

- src_services_eventservice_getactiveevents
- src_pages_homepage_homepage
- src_pages_eventspage_eventspage
- src_pages_adminltepage_adminltepage