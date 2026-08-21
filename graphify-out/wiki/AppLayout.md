# AppLayout

> God node · 2 connections · [D:\Codes\i-can-app\src\App.tsx](file:///D:/Codes/i-can-app/src/App.tsx#L28)

## Call Trace Diagram

```mermaid
sequenceDiagram
    participant P0 as AppLayout
    participant P1 as useAuthStore
    participant P2 as ProtectedRoute()
    participant P3 as CallbackPage()
    P0->>+ P1: calls
    P1-->>- P0: return
    P1->>+ P2: calls
    P2-->>- P1: return
    P2->>+ P1: calls
    P1-->>- P2: return
    P1->>+ P3: calls
    P3-->>- P1: return
    P3->>+ P1: calls
    P1-->>- P3: return
    P1->>+ P0: calls
    P0-->>- P1: return
```

## Connections by Relation

### calls
- [[useAuthStore]] `INFERRED`

### contains
- [[App.tsx]] `EXTRACTED`

---

*Part of the graphify knowledge wiki. See [[index]] to navigate.*