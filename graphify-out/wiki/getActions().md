# getActions()

> God node · 7 connections · [D:\Codes\i-can-app\src\services\actionService.ts](file:///D:/Codes/i-can-app/src/services/actionService.ts#L209)

## Call Trace Diagram

```mermaid
sequenceDiagram
    participant P0 as getActions()
    participant P1 as updateActionVerification()
    participant P2 as handleAdminVerify()
    participant P3 as loadData()
    participant P4 as handleDecision()
    participant P5 as confirmReject()
    participant P6 as getStoredAccounts()
    participant P7 as hashPassword()
    participant P8 as registerUser()
    participant P9 as loginWithCredentials()
    participant P10 as submitGreenAction()
    participant P11 as load()
    participant P12 as load()
    participant P13 as load()
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
    P1->>+ P4: calls
    P4-->>- P1: return
    P4->>+ P1: calls
    P1-->>- P4: return
    P1->>+ P5: calls
    P5-->>- P1: return
    P5->>+ P1: calls
    P1-->>- P5: return
    P0->>+ P3: calls
    P3-->>- P0: return
    P3->>+ P0: calls
    P0-->>- P3: return
    P3->>+ P6: calls
    P6-->>- P3: return
    P6->>+ P7: calls
    P7-->>- P6: return
    P6->>+ P3: calls
    P3-->>- P6: return
    P6->>+ P8: calls
    P8-->>- P6: return
    P6->>+ P9: calls
    P9-->>- P6: return
    P3->>+ P2: calls
    P2-->>- P3: return
    P0->>+ P10: calls
    P10-->>- P0: return
    P0->>+ P11: calls
    P11-->>- P0: return
    P0->>+ P12: calls
    P12-->>- P0: return
    P0->>+ P13: calls
    P13-->>- P0: return
```

## Connections by Relation

### calls
- [[updateActionVerification()]] `EXTRACTED`
- [[loadData()]] `INFERRED`
- [[submitGreenAction()]] `EXTRACTED`
- [[load()]] `INFERRED`
- [[load()]] `INFERRED`
- [[load()]] `INFERRED`

### contains
- [[actionService.ts]] `EXTRACTED`

---

*Part of the graphify knowledge wiki. See [[index]] to navigate.*