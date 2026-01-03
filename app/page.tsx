import * as supabaseServer from "@/lib/supabase-server"
import { InventoryStats } from "@/components/inventory-stats"

export default async function Home() {
  const supabase = await supabaseServer.createServerSupabaseClient()

  // Fetch all items
  const { data: items } = await supabase.from("items").select("*")

  // Calculate stats
  const stats = {
    goodCondition: items?.filter((i) => i.item_condition === "good").length || 0,
    damagedWorking: items?.filter((i) => i.item_condition === "damaged_working").length || 0,
    needsFixing: items?.filter((i) => i.item_condition === "needs_fixing").length || 0,
    damaged: items?.filter((i) => i.item_condition === "damaged").length || 0,
    toDispose: items?.filter((i) => i.item_condition === "to_dispose").length || 0,
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-foreground mb-2">Dashboard</h2>
          <p className="text-muted-foreground">Inventory status overview</p>
        </div>

        <InventoryStats stats={stats} />
      </div>
    </main>
  )
}
