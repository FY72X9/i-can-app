# submitGreenAction()

> God node · 3 connections · [D:\Codes\i-can-app\src\services\actionService.ts](file:///D:/Codes/i-can-app/src/services/actionService.ts#L69)

## Call Trace Diagram

```mermaid
sequenceDiagram
    participant P0 as submitGreenAction()
    participant P1 as getActions()
    participant P2 as updateActionVerification()
    participant P3 as handleDecision()
    participant P4 as confirmReject()
    participant P5 as load()
    participant P6 as load()
    participant P7 as handleSubmit()
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
    P1->>+ P0: calls
    P0-->>- P1: return
    P1->>+ P5: calls
    P5-->>- P1: return
    P5->>+ P1: calls
    P1-->>- P5: return
    P1->>+ P6: calls
    P6-->>- P1: return
    P6->>+ P1: calls
    P1-->>- P6: return
    P0->>+ P7: calls
    P7-->>- P0: return
    P7->>+ P0: calls
    P0-->>- P7: return
```

## Connections by Relation

### calls
- [[getActions()]] `EXTRACTED`
- [[handleSubmit()]] `INFERRED`

### contains
- [[actionService.ts]] `EXTRACTED`

---

*Part of the graphify knowledge wiki. See [[index]] to navigate.*