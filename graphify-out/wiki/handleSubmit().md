# handleSubmit()

> God node · 2 connections · [D:\Codes\i-can-app\src\pages\UploadPage.tsx](file:///D:/Codes/i-can-app/src/pages/UploadPage.tsx#L169)

## Call Trace Diagram

```mermaid
sequenceDiagram
    participant P0 as handleSubmit()
    participant P1 as submitGreenAction()
    participant P2 as getActions()
    participant P3 as updateActionVerification()
    participant P4 as load()
    participant P5 as load()
    P0->>+ P1: calls
    P1-->>- P0: return
    P1->>+ P2: calls
    P2-->>- P1: return
    P2->>+ P3: calls
    P3-->>- P2: return
    P2->>+ P1: calls
    P1-->>- P2: return
    P2->>+ P4: calls
    P4-->>- P2: return
    P2->>+ P5: calls
    P5-->>- P2: return
    P1->>+ P0: calls
    P0-->>- P1: return
```

## Connections by Relation

### calls
- [[submitGreenAction()]] `INFERRED`

### contains
- [[UploadPage.tsx]] `EXTRACTED`

---

*Part of the graphify knowledge wiki. See [[index]] to navigate.*