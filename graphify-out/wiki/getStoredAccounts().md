# getStoredAccounts()

> God node · 5 connections · [D:\Codes\i-can-app\src\services\authService.ts](file:///D:/Codes/i-can-app/src/services/authService.ts#L127)

## Call Trace Diagram

```mermaid
sequenceDiagram
    participant P0 as getStoredAccounts()
    participant P1 as hashPassword()
    participant P2 as registerUser()
    participant P3 as loginWithCredentials()
    participant P4 as loadData()
    participant P5 as getActions()
    participant P6 as updateActionVerification()
    participant P7 as submitGreenAction()
    participant P8 as load()
    participant P9 as load()
    participant P10 as load()
    participant P11 as handleAdminVerify()
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
    P1->>+ P3: calls
    P3-->>- P1: return
    P3->>+ P0: calls
    P0-->>- P3: return
    P3->>+ P1: calls
    P1-->>- P3: return
    P0->>+ P4: calls
    P4-->>- P0: return
    P4->>+ P5: calls
    P5-->>- P4: return
    P5->>+ P6: calls
    P6-->>- P5: return
    P5->>+ P4: calls
    P4-->>- P5: return
    P5->>+ P7: calls
    P7-->>- P5: return
    P5->>+ P8: calls
    P8-->>- P5: return
    P5->>+ P9: calls
    P9-->>- P5: return
    P5->>+ P10: calls
    P10-->>- P5: return
    P4->>+ P0: calls
    P0-->>- P4: return
    P4->>+ P11: calls
    P11-->>- P4: return
    P0->>+ P2: calls
    P2-->>- P0: return
    P0->>+ P3: calls
    P3-->>- P0: return
```

## Connections by Relation

### calls
- [[hashPassword()]] `EXTRACTED`
- [[loadData()]] `INFERRED`
- [[registerUser()]] `EXTRACTED`
- [[loginWithCredentials()]] `EXTRACTED`

### contains
- [[authService.ts]] `EXTRACTED`

---

*Part of the graphify knowledge wiki. See [[index]] to navigate.*