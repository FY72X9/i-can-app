# handleAdminVerify()

> God node · 3 connections · [D:\Codes\i-can-app\src\pages\AdminLtePage.tsx](file:///D:/Codes/i-can-app/src/pages/AdminLtePage.tsx#L83)

## Call Trace Diagram

```mermaid
sequenceDiagram
    participant P0 as handleAdminVerify()
    participant P1 as updateActionVerification()
    participant P2 as getActions()
    participant P3 as loadData()
    participant P4 as submitGreenAction()
    participant P5 as load()
    participant P6 as load()
    participant P7 as load()
    participant P8 as handleDecision()
    participant P9 as confirmReject()
    participant P10 as getStoredAccounts()
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
    P2->>+ P5: calls
    P5-->>- P2: return
    P2->>+ P6: calls
    P6-->>- P2: return
    P2->>+ P7: calls
    P7-->>- P2: return
    P1->>+ P0: calls
    P0-->>- P1: return
    P1->>+ P8: calls
    P8-->>- P1: return
    P8->>+ P1: calls
    P1-->>- P8: return
    P1->>+ P9: calls
    P9-->>- P1: return
    P9->>+ P1: calls
    P1-->>- P9: return
    P0->>+ P3: calls
    P3-->>- P0: return
    P3->>+ P2: calls
    P2-->>- P3: return
    P3->>+ P10: calls
    P10-->>- P3: return
    P3->>+ P0: calls
    P0-->>- P3: return
```

## Connections by Relation

### calls
- [[updateActionVerification()]] `INFERRED`
- [[loadData()]] `EXTRACTED`

### contains
- [[AdminLtePage.tsx]] `EXTRACTED`

---

*Part of the graphify knowledge wiki. See [[index]] to navigate.*