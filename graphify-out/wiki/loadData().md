# loadData()

> God node · 4 connections · [D:\Codes\i-can-app\src\pages\AdminLtePage.tsx](file:///D:/Codes/i-can-app/src/pages/AdminLtePage.tsx#L51)

## Call Trace Diagram

```mermaid
sequenceDiagram
    participant P0 as loadData()
    participant P1 as getActions()
    participant P2 as updateActionVerification()
    participant P3 as handleAdminVerify()
    participant P4 as handleDecision()
    participant P5 as confirmReject()
    participant P6 as submitGreenAction()
    participant P7 as handleSubmit()
    participant P8 as load()
    participant P9 as load()
    participant P10 as load()
    participant P11 as getStoredAccounts()
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
    P1->>+ P0: calls
    P0-->>- P1: return
    P1->>+ P6: calls
    P6-->>- P1: return
    P6->>+ P1: calls
    P1-->>- P6: return
    P6->>+ P7: calls
    P7-->>- P6: return
    P1->>+ P8: calls
    P8-->>- P1: return
    P8->>+ P1: calls
    P1-->>- P8: return
    P1->>+ P9: calls
    P9-->>- P1: return
    P9->>+ P1: calls
    P1-->>- P9: return
    P1->>+ P10: calls
    P10-->>- P1: return
    P0->>+ P11: calls
    P11-->>- P0: return
    P0->>+ P3: calls
    P3-->>- P0: return
```

## Connections by Relation

### calls
- [[getActions()]] `INFERRED`
- [[getStoredAccounts()]] `INFERRED`
- [[handleAdminVerify()]] `EXTRACTED`

### contains
- [[AdminLtePage.tsx]] `EXTRACTED`

---

*Part of the graphify knowledge wiki. See [[index]] to navigate.*