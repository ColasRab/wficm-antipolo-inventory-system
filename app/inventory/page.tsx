"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase-client"
import { InventoryTable } from "@/components/inventory-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { AddItemModal } from "@/components/add-item-modal"

interface Item {
  id: number
  item_code: string
  item_name: string
  item_type: string
  item_condition: string
}

export default function InventoryPage() {
  const [items, setItems] = useState<Item[]>([])
  const [filteredItems, setFilteredItems] = useState<Item[]>([])
  const [searchCode, setSearchCode] = useState("")
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchItems()
  }, [])

  async function fetchItems() {
    setLoading(true)
    const { data } = await supabase.from("items").select("*")
    if (data) {
      setItems(data)
      setFilteredItems(data)
    }
    setLoading(false)
  }

  const handleSearch = (code: string) => {
    setSearchCode(code)
    if (code.trim() === "") {
      setFilteredItems(items)
    } else {
      const filtered = items.filter((item) => item.item_code.toLowerCase().includes(code.toLowerCase()))
      setFilteredItems(filtered)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-4xl font-bold text-foreground mb-2">Inventory</h2>
            <p className="text-muted-foreground">Search and manage inventory items</p>
          </div>
          <AddItemModal onItemAdded={fetchItems} />
        </div>

        <Card className="border-0 shadow-md mb-6">
          <CardHeader>
            <CardTitle>Search Items</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Enter item code..."
              value={searchCode}
              onChange={(e) => handleSearch(e.target.value)}
              className="max-w-md"
            />
            <p className="text-sm text-muted-foreground mt-2">
              {filteredItems.length} of {items.length} items shown
            </p>
          </CardContent>
        </Card>

        {loading ? (
          <Card className="border-0 shadow-md">
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Loading inventory...</p>
            </CardContent>
          </Card>
        ) : (
          <InventoryTable items={filteredItems} onItemsUpdate={fetchItems} />
        )}
      </div>
    </main>
  )
}
