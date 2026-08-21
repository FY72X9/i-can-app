# navigate

> God node · 5 connections · [D:\Codes\i-can-app\src\pages\LoginPage.tsx](file:///D:/Codes/i-can-app/src/pages/LoginPage.tsx#L41)

## Call Trace Diagram

```mermaid
sequenceDiagram
    participant P0 as navigate
    participant P1 as handleLoginSubmit()
    participant P2 as handleRegisterSubmit()
    participant P3 as handleDemoStudent()
    participant P4 as handleDemoVerifier()
    P0->>+ P1: calls
    P1-->>- P0: return
    P1->>+ P0: calls
    P0-->>- P1: return
    P0->>+ P2: calls
    P2-->>- P0: return
    P2->>+ P0: calls
    P0-->>- P2: return
    P0->>+ P3: calls
    P3-->>- P0: return
    P3->>+ P0: calls
    P0-->>- P3: return
    P0->>+ P4: calls
    P4-->>- P0: return
    P4->>+ P0: calls
    P0-->>- P4: return
```

## Connections by Relation

### calls
- [[handleLoginSubmit()]] `EXTRACTED`
- [[handleRegisterSubmit()]] `EXTRACTED`
- [[handleDemoStudent()]] `EXTRACTED`
- [[handleDemoVerifier()]] `EXTRACTED`

### contains
- [[LoginPage.tsx]] `EXTRACTED`

---

*Part of the graphify knowledge wiki. See [[index]] to navigate.*