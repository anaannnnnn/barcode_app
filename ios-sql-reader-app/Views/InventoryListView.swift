import SwiftUI

struct InventoryListView: View {
    @StateObject private var viewModel = InventoryViewModel()

    var body: some View {
        NavigationStack {
            Group {
                if viewModel.isLoading {
                    ProgressView("Loading inventory...")
                } else if let errorMessage = viewModel.errorMessage {
                    VStack(spacing: 12) {
                        Text("Could not load data")
                            .font(.headline)
                        Text(errorMessage)
                            .font(.subheadline)
                            .foregroundStyle(.secondary)
                            .multilineTextAlignment(.center)
                        Button("Retry") {
                            viewModel.loadInventory()
                        }
                    }
                    .padding()
                } else {
                    List(viewModel.items) { item in
                        VStack(alignment: .leading, spacing: 4) {
                            Text(item.name)
                                .font(.headline)
                            Text("SKU: \(item.sku)")
                                .font(.subheadline)
                                .foregroundStyle(.secondary)
                            HStack {
                                Text("Qty: \(item.quantity)")
                                Spacer()
                                Text(item.updatedAt)
                                    .foregroundStyle(.secondary)
                            }
                            .font(.caption)
                        }
                        .padding(.vertical, 4)
                    }
                    .listStyle(.plain)
                }
            }
            .navigationTitle("Inventory")
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Refresh") {
                        viewModel.loadInventory()
                    }
                }
            }
        }
        .onAppear {
            viewModel.loadInventory()
        }
    }
}

#Preview {
    InventoryListView()
}
