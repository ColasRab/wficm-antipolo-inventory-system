"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase-client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

interface Item {
  id: number
  item_code: string
  item_name: string
  item_type: string
  item_condition: string
}

const CONDITIONS = [
  { value: "good", label: "Good Condition", color: "bg-emerald-100 text-emerald-800" },
  { value: "damaged_working", label: "Damaged But Working", color: "bg-blue-100 text-blue-800" },
  { value: "needs_fixing", label: "Needs Fixing", color: "bg-amber-100 text-amber-800" },
  { value: "damaged", label: "Damaged", color: "bg-orange-100 text-orange-800" },
  { value: "to_dispose", label: "To Dispose", color: "bg-red-100 text-red-800" },
]

export function InventoryTable({ items, onItemsUpdate }: { items: Item[]; onItemsUpdate: () => void }) {
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const supabase = createClient()

  const getConditionColor = (condition: string) => {
    const cond = CONDITIONS.find((c) => c.value === condition)
    return cond?.color || "bg-gray-100 text-gray-800"
  }

  const getConditionLabel = (condition: string) => {
    const cond = CONDITIONS.find((c) => c.value === condition)
    return cond?.label || condition
  }

  const handleConditionChange = async (itemId: number, newCondition: string) => {
    setUpdatingId(itemId)
    const { error } = await supabase.from("items").update({ item_condition: newCondition }).eq("id", itemId)

    if (!error) {
      onItemsUpdate()
    }
    setUpdatingId(null)
  }

  if (items.length === 0) {
    return (
      <Card className="border-0 shadow-md">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No items found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-md overflow-hidden">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Code</TableHead>
                <TableHead>Item Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.item_code}</TableCell>
                  <TableCell>{item.item_name}</TableCell>
                  <TableCell>{item.item_type}</TableCell>
                  <TableCell>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getConditionColor(item.item_condition)}`}
                    >
                      {getConditionLabel(item.item_condition)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Select
                      defaultValue={item.item_condition}
                      onValueChange={(value) => handleConditionChange(item.id, value)}
                      disabled={updatingId === item.id}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CONDITIONS.map((condition) => (
                          <SelectItem key={condition.value} value={condition.value}>
                            {condition.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
