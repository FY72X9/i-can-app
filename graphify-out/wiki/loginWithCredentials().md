# loginWithCredentials()

> God node · 6 connections · [D:\Codes\i-can-app\src\services\authService.ts](file:///D:/Codes/i-can-app/src/services/authService.ts#L443)

## Call Trace Diagram

```mermaid
sequenceDiagram
    participant P0 as loginWithCredentials()
    participant P1 as getStoredAccounts()
    participant P2 as hashPassword()
    participant P3 as createAccountByAdmin()
    participant P4 as registerUser()
    participant P5 as editAccountByAdmin()
    participant P6 as batchImportAccounts()
    participant P7 as normalizeUserRole()
    participant P8 as validateUserIdentifier()
    participant P9 as upsertLocalAccountToSupabase()
    participant P10 as getNeutralAvatarUrl()
    participant P11 as readLocalAccounts()
    participant P12 as updateStoredUserAccount()
    participant P13 as softDeleteAccountByAdmin()
    participant P14 as restoreAccountByAdmin()
    participant P15 as resetLegacyAccounts()
    participant P16 as getAllUsersList()
    participant P17 as syncAccountsToSupabase()
    participant P18 as mapDbUserToAccount()
    P0->>+ P1: calls
    P1-->>- P0: return
    P1->>+ P2: calls
    P2-->>- P1: return
    P2->>+ P1: calls
    P1-->>- P2: return
    P2->>+ P3: calls
    P3-->>- P2: return
    P2->>+ P4: calls
    P4-->>- P2: return
    P2->>+ P0: calls
    P0-->>- P2: return
    P2->>+ P5: calls
    P5-->>- P2: return
    P2->>+ P6: calls
    P6-->>- P2: return
    P1->>+ P3: calls
    P3-->>- P1: return
    P3->>+ P1: calls
    P1-->>- P3: return
    P3->>+ P2: calls
    P2-->>- P3: return
    P3->>+ P7: calls
    P7-->>- P3: return
    P3->>+ P8: calls
    P8-->>- P3: return
    P3->>+ P9: calls
    P9-->>- P3: return
    P3->>+ P10: calls
    P10-->>- P3: return
    P1->>+ P4: calls
    P4-->>- P1: return
    P1->>+ P0: calls
    P0-->>- P1: return
    P1->>+ P5: calls
    P5-->>- P1: return
    P1->>+ P6: calls
    P6-->>- P1: return
    P1->>+ P11: calls
    P11-->>- P1: return
    P1->>+ P12: calls
    P12-->>- P1: return
    P1->>+ P13: calls
    P13-->>- P1: return
    P1->>+ P14: calls
    P14-->>- P1: return
    P1->>+ P15: calls
    P15-->>- P1: return
    P1->>+ P16: calls
    P16-->>- P1: return
    P1->>+ P17: calls
    P17-->>- P1: return
    P0->>+ P2: calls
    P2-->>- P0: return
    P0->>+ P7: calls
    P7-->>- P0: return
    P0->>+ P18: calls
    P18-->>- P0: return
    P0->>+ P11: calls
    P11-->>- P0: return
```

## Connections by Relation

### calls
- [[getStoredAccounts()]] `EXTRACTED`
- [[hashPassword()]] `EXTRACTED`
- [[normalizeUserRole()]] `EXTRACTED`
- [[mapDbUserToAccount()]] `EXTRACTED`
- [[readLocalAccounts()]] `EXTRACTED`

### contains
- [[authService.ts]] `EXTRACTED`

---

*Part of the graphify knowledge wiki. See [[index]] to navigate.*