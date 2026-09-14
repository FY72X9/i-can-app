# normalizeUserRole()

> God node · 6 connections · [D:\Codes\i-can-app\src\services\authService.ts](file:///D:/Codes/i-can-app/src/services/authService.ts#L9)

## Call Trace Diagram

```mermaid
sequenceDiagram
    participant P0 as normalizeUserRole()
    participant P1 as createAccountByAdmin()
    participant P2 as getStoredAccounts()
    participant P3 as hashPassword()
    participant P4 as registerUser()
    participant P5 as loginWithCredentials()
    participant P6 as editAccountByAdmin()
    participant P7 as batchImportAccounts()
    participant P8 as readLocalAccounts()
    participant P9 as updateStoredUserAccount()
    participant P10 as softDeleteAccountByAdmin()
    participant P11 as restoreAccountByAdmin()
    participant P12 as resetLegacyAccounts()
    participant P13 as getAllUsersList()
    participant P14 as syncAccountsToSupabase()
    participant P15 as validateUserIdentifier()
    participant P16 as upsertLocalAccountToSupabase()
    participant P17 as getNeutralAvatarUrl()
    P0->>+ P1: calls
    P1-->>- P0: return
    P1->>+ P2: calls
    P2-->>- P1: return
    P2->>+ P3: calls
    P3-->>- P2: return
    P2->>+ P1: calls
    P1-->>- P2: return
    P2->>+ P4: calls
    P4-->>- P2: return
    P2->>+ P5: calls
    P5-->>- P2: return
    P2->>+ P6: calls
    P6-->>- P2: return
    P2->>+ P7: calls
    P7-->>- P2: return
    P2->>+ P8: calls
    P8-->>- P2: return
    P2->>+ P9: calls
    P9-->>- P2: return
    P2->>+ P10: calls
    P10-->>- P2: return
    P2->>+ P11: calls
    P11-->>- P2: return
    P2->>+ P12: calls
    P12-->>- P2: return
    P2->>+ P13: calls
    P13-->>- P2: return
    P2->>+ P14: calls
    P14-->>- P2: return
    P1->>+ P3: calls
    P3-->>- P1: return
    P1->>+ P0: calls
    P0-->>- P1: return
    P1->>+ P15: calls
    P15-->>- P1: return
    P1->>+ P16: calls
    P16-->>- P1: return
    P1->>+ P17: calls
    P17-->>- P1: return
    P0->>+ P4: calls
    P4-->>- P0: return
    P0->>+ P5: calls
    P5-->>- P0: return
    P0->>+ P6: calls
    P6-->>- P0: return
    P0->>+ P7: calls
    P7-->>- P0: return
```

## Connections by Relation

### calls
- [[createAccountByAdmin()]] `EXTRACTED`
- [[registerUser()]] `EXTRACTED`
- [[loginWithCredentials()]] `EXTRACTED`
- [[editAccountByAdmin()]] `EXTRACTED`
- [[batchImportAccounts()]] `EXTRACTED`

### contains
- [[authService.ts]] `EXTRACTED`

---

*Part of the graphify knowledge wiki. See [[index]] to navigate.*