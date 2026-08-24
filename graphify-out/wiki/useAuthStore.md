# useAuthStore

> God node · 4 connections · [D:\Codes\i-can-app\src\stores\authStore.ts](file:///D:/Codes/i-can-app/src/stores/authStore.ts#L103)

## Call Trace Diagram

```mermaid
sequenceDiagram
    participant P0 as useAuthStore
    participant P1 as AppLayout()
    participant P2 as ProtectedRoute()
    participant P3 as CallbackPage()
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
```

## Connections by Relation

### calls
- [[AppLayout()]] `INFERRED`
- [[ProtectedRoute()]] `INFERRED`
- [[CallbackPage()]] `INFERRED`

### contains
- [[authStore.ts]] `EXTRACTED`

---

*Part of the graphify knowledge wiki. See [[index]] to navigate.*