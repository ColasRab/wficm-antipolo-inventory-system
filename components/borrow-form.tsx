"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export function BorrowForm({ onSuccess }: { onSuccess: () => void }) {
  const [itemCode, setItemCode] = useState("")
  const [borrowerName, setBorrowerName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!itemCode || !borrowerName) {
      setError("All fields are required")
      setLoading(false)
      return
    }

    // Find item by code
    const { data: items } = await supabase.from("items").select("id").eq("item_code", itemCode).single()

    if (!items) {
      setError("Item code not found")
      setLoading(false)
      return
    }

    // Create borrow record
    const { error: borrowError } = await supabase.from("borrower").insert([
      {
        borrower_name: borrowerName,
        item_id: items.id,
      },
    ])

    if (borrowError) {
      setError("Failed to record borrow. " + borrowError.message)
    } else {
      setItemCode("")
      setBorrowerName("")
      onSuccess()
    }

    setLoading(false)
  }

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle>Record Borrowed Item</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="item-code">Item Code</Label>
            <Input
              id="item-code"
              placeholder="Enter item code"
              value={itemCode}
              onChange={(e) => setItemCode(e.target.value)}
              disabled={loading}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="borrower-name">Borrower Name</Label>
            <Input
              id="borrower-name"
              placeholder="Enter borrower name"
              value={borrowerName}
              onChange={(e) => setBorrowerName(e.target.value)}
              disabled={loading}
              className="mt-1"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Recording..." : "Record Borrow"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
