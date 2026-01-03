"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

const CONDITIONS = [
  { value: "good", label: "Good Condition" },
  { value: "damaged_working", label: "Damaged But Working" },
  { value: "needs_fixing", label: "Needs Fixing" },
  { value: "damaged", label: "Damaged" },
  { value: "to_dispose", label: "To Dispose" },
]

export function AddItemModal({ onItemAdded }: { onItemAdded: () => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    item_code: "",
    item_name: "",
    item_type: "",
    item_condition: "good",
  })
  const supabase = createClient()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.item_code || !formData.item_name || !formData.item_type) {
      alert("Please fill in all required fields")
      return
    }

    setLoading(true)
    const { error } = await supabase.from("items").insert([formData])

    if (error) {
      alert("Error adding item: " + error.message)
    } else {
      setFormData({
        item_code: "",
        item_name: "",
        item_type: "",
        item_condition: "good",
      })
      setOpen(false)
      onItemAdded()
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">Add New Item</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="item_code">Item Code *</Label>
            <Input
              id="item_code"
              placeholder="e.g., CHR-001"
              value={formData.item_code}
              onChange={(e) => handleInputChange("item_code", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="item_name">Item Name *</Label>
            <Input
              id="item_name"
              placeholder="e.g., Altar Cloth"
              value={formData.item_name}
              onChange={(e) => handleInputChange("item_name", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="item_type">Item Type *</Label>
            <Input
              id="item_type"
              placeholder="e.g., Fabric"
              value={formData.item_type}
              onChange={(e) => handleInputChange("item_type", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="condition">Item Condition</Label>
            <Select
              value={formData.item_condition}
              onValueChange={(value) => handleInputChange("item_condition", value)}
            >
              <SelectTrigger id="condition">
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
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Adding..." : "Add Item"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
