"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase-client"
import { BorrowForm } from "@/components/borrow-form"
import { BorrowTable } from "@/components/borrow-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface BorrowRecord {
  id: number
  borrower_name: string
  item: {
    item_code: string
    item_name: string
  }  // single object, not array
  time_borrowed: string
  time_put_back: string | null
}

export default function BorrowPage() {
  const [borrowRecords, setBorrowRecords] = useState<BorrowRecord[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchBorrowRecords()
  }, [])

async function fetchBorrowRecords() {
  setLoading(true)

  const { data, error } = await supabase
    .from("borrower")
    .select(`
      id,
      borrower_name,
      item_code,
      time_borrowed,
      time_put_back,
      items(item_code, item_name)
    `)
    .order("time_borrowed", { ascending: false })

  if (error) {
    console.error("Error fetching borrow records:", error)
    setLoading(false)
    return
  }

  if (data) {
    const mappedData = data
      .filter((record: any) => record.items)
      .map((record: any) => ({
        id: record.id,
        borrower_name: record.borrower_name,
        item: record.items,
        time_borrowed: record.time_borrowed,
        time_put_back: record.time_put_back,
      }))
    setBorrowRecords(mappedData)
  }

  setLoading(false)
}



  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-foreground mb-2">Borrow Items</h2>
          <p className="text-muted-foreground">Record borrowed items and manage returns</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <BorrowForm onSuccess={fetchBorrowRecords} />
          </div>
          <Card className="border-0 shadow-md h-fit">
            <CardHeader>
              <CardTitle>Quick Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="font-semibold text-foreground">Total Borrowed:</p>
                <p className="text-2xl font-bold text-primary">
                  {borrowRecords.filter((b) => !b.time_put_back).length}
                </p>
              </div>
              <div>
                <p className="font-semibold text-foreground">Total Records:</p>
                <p className="text-2xl font-bold text-primary">{borrowRecords.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {loading ? (
          <Card className="border-0 shadow-md">
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Loading borrow records...</p>
            </CardContent>
          </Card>
        ) : (
          <BorrowTable records={borrowRecords} onRecordsUpdate={fetchBorrowRecords} />
        )}
      </div>
    </main>
  )
}
