import Foundation

@MainActor
final class InventoryViewModel: ObservableObject {
    @Published private(set) var items: [InventoryItem] = []
    @Published private(set) var isLoading = false
    @Published var errorMessage: String?

    private let sqliteService = SQLiteService()

    func loadInventory() {
        isLoading = true
        errorMessage = nil

        do {
            try sqliteService.openDatabase(named: "inventory")
            items = try sqliteService.fetchInventory()
            sqliteService.close()
        } catch {
            errorMessage = error.localizedDescription
        }

        isLoading = false
    }
}
