import Foundation

struct InventoryItem: Identifiable {
    let id: Int64
    let sku: String
    let name: String
    let quantity: Int
    let updatedAt: String
}
