# load()

> God node · 2 connections · [D:\Codes\i-can-app\src\pages\VerificationPage.tsx](file:///D:/Codes/i-can-app/src/pages/VerificationPage.tsx#L109)

## Call Trace Diagram

```mermaid
sequenceDiagram
    participant P0 as load()
    participant P1 as getActions()
    participant P2 as updateActionVerification()
    participant P3 as handleDecision()
    participant P4 as confirmReject()
    participant P5 as submitGreenAction()
    participant P6 as handleSubmit()
    participant P7 as load()
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
    P1->>+ P5: calls
    P5-->>- P1: return
    P5->>+ P1: calls
    P1-->>- P5: return
    P5->>+ P6: calls
    P6-->>- P5: return
    P1->>+ P0: calls
    P0-->>- P1: return
    P1->>+ P7: calls
    P7-->>- P1: return
    P7->>+ P1: calls
    P1-->>- P7: return
```

## Connections by Relation

### calls
- [[getActions()]] `INFERRED`

### contains
- [[VerificationPage.tsx]] `EXTRACTED`

---

*Part of the graphify knowledge wiki. See [[index]] to navigate.*