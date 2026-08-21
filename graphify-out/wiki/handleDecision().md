# handleDecision()

> God node · 2 connections · [D:\Codes\i-can-app\src\pages\VerificationPage.tsx](file:///D:/Codes/i-can-app/src/pages/VerificationPage.tsx#L119)

## Call Trace Diagram

```mermaid
sequenceDiagram
    participant P0 as handleDecision()
    participant P1 as updateActionVerification()
    participant P2 as getActions()
    participant P3 as submitGreenAction()
    participant P4 as load()
    participant P5 as load()
    participant P6 as confirmReject()
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
```

## Connections by Relation

### calls
- [[updateActionVerification()]] `INFERRED`

### contains
- [[VerificationPage.tsx]] `EXTRACTED`

---

*Part of the graphify knowledge wiki. See [[index]] to navigate.*