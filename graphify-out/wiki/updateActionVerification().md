# updateActionVerification()

> God node · 4 connections · [D:\Codes\i-can-app\src\services\actionService.ts](file:///D:/Codes/i-can-app/src/services/actionService.ts#L138)

## Call Trace Diagram

```mermaid
sequenceDiagram
    participant P0 as updateActionVerification()
    participant P1 as getActions()
    participant P2 as submitGreenAction()
    participant P3 as handleSubmit()
    participant P4 as load()
    participant P5 as load()
    participant P6 as handleDecision()
    participant P7 as confirmReject()
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
    P0->>+ P6: calls
    P6-->>- P0: return
    P6->>+ P0: calls
    P0-->>- P6: return
    P0->>+ P7: calls
    P7-->>- P0: return
    P7->>+ P0: calls
    P0-->>- P7: return
```

## Connections by Relation

### calls
- [[getActions()]] `EXTRACTED`
- [[handleDecision()]] `INFERRED`
- [[confirmReject()]] `INFERRED`

### contains
- [[actionService.ts]] `EXTRACTED`

---

*Part of the graphify knowledge wiki. See [[index]] to navigate.*