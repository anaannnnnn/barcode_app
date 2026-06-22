import Foundation
import SQLite3

final class SQLiteService {
    private var db: OpaquePointer?

    deinit {
        close()
    }

    func openDatabase(named fileName: String, fileExtension: String = "db") throws {
        guard let fileURL = Bundle.main.url(forResource: fileName, withExtension: fileExtension) else {
            throw SQLiteError.databaseFileNotFound(fileName: "\(fileName).\(fileExtension)")
        }

        if sqlite3_open(fileURL.path, &db) != SQLITE_OK {
            let message = String(cString: sqlite3_errmsg(db))
            throw SQLiteError.openFailed(message: message)
        }
    }

    func fetchInventory() throws -> [InventoryItem] {
        let query = """
        SELECT id, sku, name, quantity, updated_at
        FROM inventory
        ORDER BY updated_at DESC;
        """

        var statement: OpaquePointer?
        defer { sqlite3_finalize(statement) }

        if sqlite3_prepare_v2(db, query, -1, &statement, nil) != SQLITE_OK {
            let message = String(cString: sqlite3_errmsg(db))
            throw SQLiteError.queryPrepareFailed(message: message)
        }

        var items: [InventoryItem] = []

        while sqlite3_step(statement) == SQLITE_ROW {
            let item = InventoryItem(
                id: sqlite3_column_int64(statement, 0),
                sku: String(cString: sqlite3_column_text(statement, 1)),
                name: String(cString: sqlite3_column_text(statement, 2)),
                quantity: Int(sqlite3_column_int(statement, 3)),
                updatedAt: String(cString: sqlite3_column_text(statement, 4))
            )
            items.append(item)
        }

        return items
    }

    func close() {
        if db != nil {
            sqlite3_close(db)
            db = nil
        }
    }
}

enum SQLiteError: Error, LocalizedError {
    case databaseFileNotFound(fileName: String)
    case openFailed(message: String)
    case queryPrepareFailed(message: String)

    var errorDescription: String? {
        switch self {
        case .databaseFileNotFound(let fileName):
            return "Database file not found: \(fileName)"
        case .openFailed(let message):
            return "Failed to open SQLite database: \(message)"
        case .queryPrepareFailed(let message):
            return "Failed to prepare SQL query: \(message)"
        }
    }
}
