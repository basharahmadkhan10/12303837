# Notification System Design

## Stage 1

### Problem
Students lose track of important notifications due to high volume. A Priority Inbox is needed that always shows the top N most important unread notifications first.

### Priority Algorithm

Priority is determined by a combined score:

```
score = typeWeight × 1000 + recencyScore × 999
```

**Type Weight** (Placement > Event > Result):
| Type      | Weight |
|-----------|--------|
| Placement | 3      |
| Event     | 2      |
| Result    | 1      |

**Recency Score** (0 to 1, newer = higher):
```
recencyScore = max(0, 1 - ageMs / maxAge)
maxAge = 30 days
```

Type weight is the primary sort key (×1000 multiplier), recency is secondary (×999), so a Placement is always ranked above an Event of the same recency, and a same-type notification is ranked by how recent it is.

### Maintaining Top N Efficiently

Notifications are fetched fresh from the API each time (no local DB). A Max-Heap or `.sort()` on the scored array gives O(n log n) selection of top N. Since n is bounded (API pagination), this is efficient in practice.

New notifications arriving are handled by re-fetching on an interval (every 30 seconds). The top N is recalculated each fetch — ensuring stale notifications drop out and fresh ones enter automatically.

### Data Flow

```
API Poll (30s interval)
     ↓
fetchNotifications()
     ↓
score each notification
     ↓
sort descending by score
     ↓
slice top N
     ↓
display Priority Inbox
```

### Logging Strategy

Every significant event is logged via `Log(stack, level, package, message)`:
- API calls: `info` level, `api` package
- State changes: `debug` level, `state` package
- Errors: `error` level, appropriate package
- Fatal failures: `fatal` level

---

## Stage 2

### Frontend Architecture

**Framework**: React (TypeScript) + Material UI

**Pages**:
1. **All Notifications** (`/`) — paginated, filterable by type, highlights new arrivals
2. **Priority Inbox** — top N by score, configurable N

**Key Design Decisions**:
- `seenIds` ref tracks which notification IDs have been shown before — enables "NEW" badge on fresh arrivals without a database
- Auto-refresh every 30 seconds via `setInterval`
- MUI `Tabs` for navigation, `Pagination` for all-notifications page
- Filter by `notification_type` uses API query param directly
- Mobile-responsive via MUI `useMediaQuery`

**Component Structure**:
```
App
├── AppBar (tabs, refresh button, new-count badge)
├── Filters Row (type filter | top-N input)
├── NotifCard (per notification)
└── Pagination / Snackbar
```

**Styling**: Material UI only (no ShadCN, no Tailwind, no other CSS libraries). Vanilla CSS for minor overrides only.