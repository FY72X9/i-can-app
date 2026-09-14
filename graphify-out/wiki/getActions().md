# getActions()

> God node · 8 connections · [D:\Codes\i-can-app\src\services\actionService.ts](file:///D:/Codes/i-can-app/src/services/actionService.ts#L31)

## Call Trace Diagram

```mermaid
sequenceDiagram
    participant P0 as getActions()
    participant P1 as submitGreenAction()
    participant P2 as handleSubmit()
    participant P3 as completeDailyQuest()
    participant P4 as generateActionId()
    participant P5 as updateActionVerification()
    participant P6 as handleDecision()
    participant P7 as submitRejection()
    participant P8 as loadEvent()
    participant P9 as getEventById()
    participant P10 as computeEventLeaderboard()
    participant P11 as getUserActions()
    participant P12 as loadEventLeaderboard()
    participant P13 as load()
    participant P14 as load()
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
    P0->>+ P5: calls
    P5-->>- P0: return
    P5->>+ P0: calls
    P0-->>- P5: return
    P5->>+ P6: calls
    P6-->>- P5: return
    P6->>+ P5: calls
    P5-->>- P6: return
    P5->>+ P7: calls
    P7-->>- P5: return
    P7->>+ P5: calls
    P5-->>- P7: return
    P0->>+ P8: calls
    P8-->>- P0: return
    P8->>+ P0: calls
    P0-->>- P8: return
    P8->>+ P9: calls
    P9-->>- P8: return
    P8->>+ P10: calls
    P10-->>- P8: return
    P0->>+ P11: calls
    P11-->>- P0: return
    P0->>+ P12: calls
    P12-->>- P0: return
    P0->>+ P13: calls
    P13-->>- P0: return
    P0->>+ P14: calls
    P14-->>- P0: return
```

## Connections by Relation

### calls
- [[submitGreenAction()]] `EXTRACTED`
- [[updateActionVerification()]] `EXTRACTED`
- [[loadEvent()]] `INFERRED`
- [[getUserActions()]] `EXTRACTED`
- [[loadEventLeaderboard()]] `INFERRED`
- [[load()]] `INFERRED`
- [[load()]] `INFERRED`

### contains
- [[actionService.ts]] `EXTRACTED`

---

*Part of the graphify knowledge wiki. See [[index]] to navigate.*