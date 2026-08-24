# updateActionVerification()

> God node · 5 connections · [D:\Codes\i-can-app\src\services\actionService.ts](file:///D:/Codes/i-can-app/src/services/actionService.ts#L347)

## Call Trace Diagram

```mermaid
sequenceDiagram
    participant P0 as updateActionVerification()
    participant P1 as getActions()
    participant P2 as loadData()
    participant P3 as getStoredAccounts()
    participant P4 as handleAdminVerify()
    participant P5 as submitGreenAction()
    participant P6 as handleSubmit()
    participant P7 as load()
    participant P8 as load()
    participant P9 as load()
    participant P10 as handleDecision()
    participant P11 as confirmReject()
    P0->>+ P1: calls
    P1-->>- P0: return
    P1->>+ P0: calls
    P0-->>- P1: return
    P1->>+ P2: calls
    P2-->>- P1: return
    P2->>+ P1: calls
    P1-->>- P2: return
    P2->>+ P3: calls
    P3-->>- P2: return
    P2->>+ P4: calls
    P4-->>- P2: return
    P1->>+ P5: calls
    P5-->>- P1: return
    P5->>+ P1: calls
    P1-->>- P5: return
    P5->>+ P6: calls
    P6-->>- P5: return
    P1->>+ P7: calls
    P7-->>- P1: return
    P7->>+ P1: calls
    P1-->>- P7: return
    P1->>+ P8: calls
    P8-->>- P1: return
    P8->>+ P1: calls
    P1-->>- P8: return
    P1->>+ P9: calls
    P9-->>- P1: return
    P9->>+ P1: calls
    P1-->>- P9: return
    P0->>+ P4: calls
    P4-->>- P0: return
    P0->>+ P10: calls
    P10-->>- P0: return
    P0->>+ P11: calls
    P11-->>- P0: return
```

## Connections by Relation

### calls
- [[getActions()]] `EXTRACTED`
- [[handleAdminVerify()]] `INFERRED`
- [[handleDecision()]] `INFERRED`
- [[confirmReject()]] `INFERRED`

### contains
- [[actionService.ts]] `EXTRACTED`

---

*Part of the graphify knowledge wiki. See [[index]] to navigate.*