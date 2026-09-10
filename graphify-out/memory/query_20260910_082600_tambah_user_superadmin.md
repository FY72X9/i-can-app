---
type: "query"
date: "2026-09-10T08:26:00.000000+00:00"
question: "lanjut ke fungsi untuk tambah user di dashboard superadmin, sebelum melakukan perubahan pelajari dulu menggunakan graphify apa yang akan diubah dan terkena dampaknya"
contributor: "graphify"
outcome: "useful"
source_nodes: ["AdminLtePage.tsx", "authStore.ts", "authService.ts", "createAccountByAdmin()", "useAuthStore", "getStoredAccounts()", "usersList"]
---

# Q: lanjut ke fungsi untuk tambah user di dashboard superadmin, sebelum melakukan perubahan pelajari dulu menggunakan graphify apa yang akan diubah dan terkena dampaknya

## Answer

Expanded via vocab: [user, users, admin, account, auth, role, form, modal, create, add, submit, store].
Graphify BFS/DFS traversal reveals:
1. AdminLtePage.tsx: State showUserForm and userFormData already exist, along with trigger button + Tambah Pengguna and handler handleUserFormSubmit(). However, the Modal UI was not yet rendered in the JSX.
2. authStore.ts: Contains createUserAccount() with SUPERADMIN role check that delegates to createAccountByAdmin().
3. authService.ts: Contains createAccountByAdmin() with Web Crypto SHA-256 password hashing and duplicate NIM/Email validation.
4. Downstream Impact:
   - AdminLtePage.tsx: totalUsers stat counter, usersList table, selectedUserForGrant dropdown in Manual Grant, and Login As fast switch.
   - LoginPage.tsx: Direct credential login using NIM/Email + Password.
   - ProtectedRoute.tsx: Automatic role-based landing redirection.

## Outcome

- Signal: useful

## Source Nodes

- AdminLtePage.tsx
- authStore.ts
- authService.ts
- createAccountByAdmin()
- useAuthStore
- getStoredAccounts()
- usersList
