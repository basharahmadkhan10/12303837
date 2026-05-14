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

Notifications are fetched fresh from the API each time (no local DB). A `.sort()` on the scored array gives O(n log n) selection of top N. Since n is bounded (API pagination), this is efficient in practice.

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
- State changes: `debug` level, `page` package
- Errors: `error` level, appropriate package
- Fatal failures: `fatal` level

---

## Stage 2

### Frontend Architecture

**Framework**: React (TypeScript) + Vanilla CSS (inline styles)

**Pages**:
1. **All Notifications** (`/`) — filterable by type (All / Event / Result / Placement), highlights new arrivals with "NEW" badge
2. **Priority Inbox** (`/priority`) — top N by score, configurable N via number input

**Key Design Decisions**:
- `seenIds` ref tracks which notification IDs have been shown before — enables "NEW" badge on fresh arrivals without a database
- `isFirstLoad` ref ensures that on initial page load and filter change, all visible notifications are marked as seen immediately (no false "NEW" badges)
- Auto-refresh every 30 seconds via `setInterval` — interval restarts on filter change
- Auto-refresh does not trigger loading spinner; spinner only shows on first load for better UX
- Filter by `notification_type` uses API query param directly
- Mobile-responsive via inline CSS (fluid widths, wrapping flex layouts)

**Component Structure**:
```
App
├── Navbar (app title, All Notifications link, Priority Inbox link)
├── Home Page (/)
│   ├── Header (title, date, item count)
│   ├── Tab Filter (All | Event | Result | Placement)
│   └── NotificationCard (per notification)
└── Priority Page (/priority)
    ├── Header (title, subtitle)
    ├── Top-N Control (number input)
    └── NotificationCard with rank number (per notification)
```

**NotificationCard**:
- Shows type badge (PLACEMENT / EVENT / RESULT) with distinct styling per type
- Shows "● NEW" indicator for unseen notifications
- Shows formatted timestamp (e.g. "May 13, 06:09 PM")
- Shows rank number (01, 02, 03...) on Priority Inbox, dot indicator on All Notifications

**Styling**: Vanilla CSS via inline styles only (no external CSS libraries). Typography uses Georgia serif for content, Courier New monospace for labels and metadata — newspaper-inspired design.

### Note
API token expired during testing. Screenshots captured show the working state of the application. Full functionality includes both desktop and mobile responsive views.
