# getActions()

> God node · 5 connections · [D:\Codes\i-can-app\src\services\actionService.ts](file:///D:/Codes/i-can-app/src/services/actionService.ts#L12)

## Call Trace Diagram

```mermaid
sequenceDiagram
    participant P0 as getActions()
    participant P1 as updateActionVerification()
    participant P2 as handleDecision()
    participant P3 as confirmReject()
    participant P4 as submitGreenAction()
    participant P5 as load()
    participant P6 as load()
    P0->>+ P1: calls
    P1-->>- P0: return
    P1->>+ P0: calls
    P0-->>- P1: return
    P1->>+ P2: calls
    P2-->>- P1: return
    P2->>+ P1: calls
    P1-->>- P2: return
    P1->>+ P3: calls
    P3-->>- P1: return
    P3->>+ P1: calls
    P1-->>- P3: return
    P0->>+ P4: calls
    P4-->>- P0: return
    P4->>+ P0: calls
    P0-->>- P4: return
    P0->>+ P5: calls
    P5-->>- P0: return
    P5->>+ P0: calls
    P0-->>- P5: return
    P0->>+ P6: calls
    P6-->>- P0: return
    P6->>+ P0: calls
    P0-->>- P6: return
```

## Connections by Relation

### calls
- [[updateActionVerification()]] `EXTRACTED`
- [[submitGreenAction()]] `EXTRACTED`
- [[load()]] `INFERRED`
- [[load()]] `INFERRED`

### contains
- [[actionService.ts]] `EXTRACTED`

---

*Part of the graphify knowledge wiki. See [[index]] to navigate.*