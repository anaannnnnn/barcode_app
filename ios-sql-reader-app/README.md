# iOS SQL Reader App (Starter Repo)

This is a starter repository for an iOS SwiftUI app that connects to a local SQL database (SQLite) and reads data.

## What this starter includes

- SwiftUI app entry point
- `SQLiteService` using native `SQLite3`
- `InventoryItem` model
- `InventoryViewModel` for loading data asynchronously
- `InventoryListView` to display rows from SQL query results

## Suggested Xcode setup

1. Open Xcode and create a new **iOS App** project named `SQLReaderApp`.
2. Replace generated Swift files with the files in this folder.
3. In your app target, add **libsqlite3.tbd**:
   - Target → Build Phases → Link Binary With Libraries → `+` → `libsqlite3.tbd`
4. Ensure your SQLite DB file (for example `inventory.db`) is in app bundle resources.

## Database expectations

The sample code expects a table:

```sql
CREATE TABLE inventory (
  id INTEGER PRIMARY KEY,
  sku TEXT NOT NULL,
  name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  updated_at TEXT NOT NULL
);
```

## Example usage

`SQLiteService` runs this query by default:

```sql
SELECT id, sku, name, quantity, updated_at
FROM inventory
ORDER BY updated_at DESC;
```

Update the SQL query and model mapping as needed for your schema.

## Notes for production

- Use parameterized queries for user input.
- Add better error handling/reporting.
- If you need remote SQL (Postgres/MySQL/SQL Server), connect through a secure API backend instead of direct DB access from iOS.
