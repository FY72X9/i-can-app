# getLocalEvents()

> God node · 8 connections · [D:\Codes\i-can-app\src\services\eventService.ts](file:///D:/Codes/i-can-app/src/services/eventService.ts#L71)

## Call Trace Diagram

```mermaid
sequenceDiagram
    participant P0 as getLocalEvents()
    participant P1 as saveLocalEvents()
    participant P2 as createEvent()
    participant P3 as generateId()
    participant P4 as mapModelToDb()
    participant P5 as updateEvent()
    participant P6 as getEventById()
    participant P7 as mapPatchToDb()
    participant P8 as deleteEvent()
    participant P9 as getEvents()
    participant P10 as getEventsByOrganizer()
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
    P2->>+ P3: calls
    P3-->>- P2: return
    P2->>+ P4: calls
    P4-->>- P2: return
    P1->>+ P5: calls
    P5-->>- P1: return
    P5->>+ P0: calls
    P0-->>- P5: return
    P5->>+ P6: calls
    P6-->>- P5: return
    P5->>+ P1: calls
    P1-->>- P5: return
    P5->>+ P7: calls
    P7-->>- P5: return
    P1->>+ P8: calls
    P8-->>- P1: return
    P8->>+ P0: calls
    P0-->>- P8: return
    P8->>+ P1: calls
    P1-->>- P8: return
    P0->>+ P9: calls
    P9-->>- P0: return
    P0->>+ P6: calls
    P6-->>- P0: return
    P0->>+ P2: calls
    P2-->>- P0: return
    P0->>+ P5: calls
    P5-->>- P0: return
    P0->>+ P8: calls
    P8-->>- P0: return
    P0->>+ P10: calls
    P10-->>- P0: return
```

## Connections by Relation

### calls
- [[saveLocalEvents()]] `EXTRACTED`
- [[getEvents()]] `EXTRACTED`
- [[getEventById()]] `EXTRACTED`
- [[createEvent()]] `EXTRACTED`
- [[updateEvent()]] `EXTRACTED`
- [[deleteEvent()]] `EXTRACTED`
- [[getEventsByOrganizer()]] `EXTRACTED`

### contains
- [[eventService.ts]] `EXTRACTED`

---

*Part of the graphify knowledge wiki. See [[index]] to navigate.*