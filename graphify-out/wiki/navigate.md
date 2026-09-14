# navigate

> God node · 6 connections · [D:\Codes\i-can-app\src\pages\LoginPage.tsx](file:///D:/Codes/i-can-app/src/pages/LoginPage.tsx#L47)

## Call Trace Diagram

```mermaid
sequenceDiagram
    participant P0 as navigate
    participant P1 as handleLoginSubmit()
    participant P2 as getRoleDefaultPath()
    participant P3 as ProtectedRoute()
    participant P4 as handleRegisterSubmit()
    participant P5 as async()
    participant P6 as handleDemoStudent()
    participant P7 as handleDemoVerifier()
    P0->>+ P1: calls
    P1-->>- P0: return
    P1->>+ P0: calls
    P0-->>- P1: return
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
    P0->>+ P4: calls
    P4-->>- P0: return
    P4->>+ P0: calls
    P0-->>- P4: return
    P4->>+ P2: calls
    P2-->>- P4: return
    P0->>+ P5: calls
    P5-->>- P0: return
    P5->>+ P0: calls
    P0-->>- P5: return
    P5->>+ P2: calls
    P2-->>- P5: return
    P0->>+ P6: calls
    P6-->>- P0: return
    P6->>+ P0: calls
    P0-->>- P6: return
    P0->>+ P7: calls
    P7-->>- P0: return
```

## Connections by Relation

### calls
- [[handleLoginSubmit()]] `EXTRACTED`
- [[handleRegisterSubmit()]] `EXTRACTED`
- [[async()]] `EXTRACTED`
- [[handleDemoStudent()]] `EXTRACTED`
- [[handleDemoVerifier()]] `EXTRACTED`

### contains
- [[LoginPage.tsx]] `EXTRACTED`

---

*Part of the graphify knowledge wiki. See [[index]] to navigate.*