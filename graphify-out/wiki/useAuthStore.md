# useAuthStore

> God node · 3 connections · [D:\Codes\i-can-app\src\stores\authStore.ts](file:///D:/Codes/i-can-app/src/stores/authStore.ts#L51)

## Call Trace Diagram

```mermaid
sequenceDiagram
    participant P0 as useAuthStore
    participant P1 as AppLayout()
    participant P2 as LoginPage()
    P0->>+ P1: calls
    P1-->>- P0: return
    P1->>+ P0: calls
    P0-->>- P1: return
    P0->>+ P2: calls
    P2-->>- P0: return
    P2->>+ P0: calls
    P0-->>- P2: return
```

## Connections by Relation

### calls
- [[AppLayout()]] `INFERRED`
- [[LoginPage()]] `INFERRED`

### contains
- [[authStore.ts]] `EXTRACTED`

---

*Part of the graphify knowledge wiki. See [[index]] to navigate.*