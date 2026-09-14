# getStoredAccounts()

> God node · 14 connections · [D:\Codes\i-can-app\src\services\authService.ts](file:///D:/Codes/i-can-app/src/services/authService.ts#L175)

## Call Trace Diagram

```mermaid
sequenceDiagram
    participant P0 as getStoredAccounts()
    participant P1 as hashPassword()
    participant P2 as createAccountByAdmin()
    participant P3 as normalizeUserRole()
    participant P4 as validateUserIdentifier()
    participant P5 as upsertLocalAccountToSupabase()
    participant P6 as getNeutralAvatarUrl()
    participant P7 as registerUser()
    participant P8 as loginWithCredentials()
    participant P9 as editAccountByAdmin()
    participant P10 as batchImportAccounts()
    participant P11 as readLocalAccounts()
    participant P12 as updateStoredUserAccount()
    participant P13 as softDeleteAccountByAdmin()
    participant P14 as restoreAccountByAdmin()
    participant P15 as resetLegacyAccounts()
    participant P16 as getAllUsersList()
    participant P17 as syncAccountsToSupabase()
    P0->>+ P1: calls
    P1-->>- P0: return
    P1->>+ P0: calls
    P0-->>- P1: return
    P1->>+ P2: calls
    P2-->>- P1: return
    P2->>+ P0: calls
    P0-->>- P2: return
    P2->>+ P1: calls
    P1-->>- P2: return
    P2->>+ P3: calls
    P3-->>- P2: return
    P2->>+ P4: calls
    P4-->>- P2: return
    P2->>+ P5: calls
    P5-->>- P2: return
    P2->>+ P6: calls
    P6-->>- P2: return
    P1->>+ P7: calls
    P7-->>- P1: return
    P7->>+ P0: calls
    P0-->>- P7: return
    P7->>+ P1: calls
    P1-->>- P7: return
    P7->>+ P3: calls
    P3-->>- P7: return
    P7->>+ P4: calls
    P4-->>- P7: return
    P7->>+ P5: calls
    P5-->>- P7: return
    P7->>+ P6: calls
    P6-->>- P7: return
    P1->>+ P8: calls
    P8-->>- P1: return
    P1->>+ P9: calls
    P9-->>- P1: return
    P1->>+ P10: calls
    P10-->>- P1: return
    P0->>+ P2: calls
    P2-->>- P0: return
    P0->>+ P7: calls
    P7-->>- P0: return
    P0->>+ P8: calls
    P8-->>- P0: return
    P0->>+ P9: calls
    P9-->>- P0: return
    P0->>+ P10: calls
    P10-->>- P0: return
    P0->>+ P11: calls
    P11-->>- P0: return
    P0->>+ P12: calls
    P12-->>- P0: return
    P0->>+ P13: calls
    P13-->>- P0: return
    P0->>+ P14: calls
    P14-->>- P0: return
    P0->>+ P15: calls
    P15-->>- P0: return
    P0->>+ P16: calls
    P16-->>- P0: return
    P0->>+ P17: calls
    P17-->>- P0: return
```

## Connections by Relation

### calls
- [[hashPassword()]] `EXTRACTED`
- [[createAccountByAdmin()]] `EXTRACTED`
- [[registerUser()]] `EXTRACTED`
- [[loginWithCredentials()]] `EXTRACTED`
- [[editAccountByAdmin()]] `EXTRACTED`
- [[batchImportAccounts()]] `EXTRACTED`
- [[readLocalAccounts()]] `EXTRACTED`
- [[updateStoredUserAccount()]] `EXTRACTED`
- [[softDeleteAccountByAdmin()]] `EXTRACTED`
- [[restoreAccountByAdmin()]] `EXTRACTED`
- [[resetLegacyAccounts()]] `EXTRACTED`
- [[getAllUsersList()]] `EXTRACTED`
- [[syncAccountsToSupabase()]] `EXTRACTED`

### contains
- [[authService.ts]] `EXTRACTED`

---

*Part of the graphify knowledge wiki. See [[index]] to navigate.*