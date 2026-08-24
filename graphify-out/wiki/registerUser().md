# registerUser()

> God node · 3 connections · [D:\Codes\i-can-app\src\services\authService.ts](file:///D:/Codes/i-can-app/src/services/authService.ts#L159)

## Call Trace Diagram

```mermaid
sequenceDiagram
    participant P0 as registerUser()
    participant P1 as getStoredAccounts()
    participant P2 as hashPassword()
    participant P3 as loginWithCredentials()
    participant P4 as loadData()
    participant P5 as getActions()
    participant P6 as handleAdminVerify()
    P0->>+ P1: calls
    P1-->>- P0: return
    P1->>+ P2: calls
    P2-->>- P1: return
    P2->>+ P1: calls
    P1-->>- P2: return
    P2->>+ P0: calls
    P0-->>- P2: return
    P2->>+ P3: calls
    P3-->>- P2: return
    P1->>+ P4: calls
    P4-->>- P1: return
    P4->>+ P5: calls
    P5-->>- P4: return
    P4->>+ P1: calls
    P1-->>- P4: return
    P4->>+ P6: calls
    P6-->>- P4: return
    P1->>+ P0: calls
    P0-->>- P1: return
    P1->>+ P3: calls
    P3-->>- P1: return
    P3->>+ P1: calls
    P1-->>- P3: return
    P3->>+ P2: calls
    P2-->>- P3: return
    P0->>+ P2: calls
    P2-->>- P0: return
```

## Connections by Relation

### calls
- [[getStoredAccounts()]] `EXTRACTED`
- [[hashPassword()]] `EXTRACTED`

### contains
- [[authService.ts]] `EXTRACTED`

---

*Part of the graphify knowledge wiki. See [[index]] to navigate.*