# useAuthStore

> God node · 4 connections · [D:\Codes\i-can-app\src\stores\authStore.ts](file:///D:/Codes/i-can-app/src/stores/authStore.ts#L55)

## Call Trace Diagram

```mermaid
sequenceDiagram
    participant P0 as useAuthStore
    participant P1 as ProtectedRoute()
    participant P2 as CallbackPage()
    participant P3 as AppLayout
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
- [[ProtectedRoute()]] `INFERRED`
- [[CallbackPage()]] `INFERRED`
- [[AppLayout]] `INFERRED`

### contains
- [[authStore.ts]] `EXTRACTED`

---

*Part of the graphify knowledge wiki. See [[index]] to navigate.*