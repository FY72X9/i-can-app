# getStoredAccounts()

> God node · 4 connections · [D:\Codes\i-can-app\src\services\authService.ts](file:///D:/Codes/i-can-app/src/services/authService.ts#L85)

## Call Trace Diagram

```mermaid
sequenceDiagram
    participant P0 as getStoredAccounts()
    participant P1 as hashPassword()
    participant P2 as registerUser()
    participant P3 as loginWithCredentials()
    P0->>+ P1: calls
    P1-->>- P0: return
    P1->>+ P0: calls
    P0-->>- P1: return
    P1->>+ P2: calls
    P2-->>- P1: return
    P2->>+ P0: calls
    P0-->>- P2: return
    P2->>+ P1: calls
    P1-->>- P2: return
    P1->>+ P3: calls
    P3-->>- P1: return
    P3->>+ P0: calls
    P0-->>- P3: return
    P3->>+ P1: calls
    P1-->>- P3: return
    P0->>+ P2: calls
    P2-->>- P0: return
    P0->>+ P3: calls
    P3-->>- P0: return
```

## Connections by Relation

### calls
- [[hashPassword()]] `EXTRACTED`
- [[registerUser()]] `EXTRACTED`
- [[loginWithCredentials()]] `EXTRACTED`

### contains
- [[authService.ts]] `EXTRACTED`

---

*Part of the graphify knowledge wiki. See [[index]] to navigate.*