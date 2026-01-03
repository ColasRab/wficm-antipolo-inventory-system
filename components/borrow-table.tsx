"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase-client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface BorrowRecord {
  id: number
  borrower_name: string
  item: {
    item_code: string
    item_name: string
  }
  time_borrowed: string
  time_put_back: string | null
}

export function BorrowTable({
  records,
  onRecordsUpdate,
}: {
  records: BorrowRecord[]
  onRecordsUpdate: () => void
}) {
  const [returningId, setReturningId] = useState<number | null>(null)
  const supabase = createClient()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleReturn = async (recordId: number) => {
    setReturningId(recordId)
    const { error } = await supabase
      .from("borrower")
      .update({ time_put_back: new Date().toISOString() })
      .eq("id", recordId)

    if (!error) {
      onRecordsUpdate()
    }
    setReturningId(null)
  }

  const activeBorrows = records.filter((r) => !r.time_put_back)
  const returnedBorrows = records.filter((r) => r.time_put_back)

  return (
    <div className="space-y-6">
      {/* Active Borrows */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-foreground">Active Borrows ({activeBorrows.length})</h3>
        {activeBorrows.length === 0 ? (
          <Card className="border-0 shadow-md">
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">No active borrows</p>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-0 shadow-md overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item Code</TableHead>
                      <TableHead>Item Name</TableHead>
                      <TableHead>Borrower Code</TableHead>
                      <TableHead>Borrower Name</TableHead>
                      <TableHead>Borrowed Date</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeBorrows.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.item.item_code}</TableCell>
                        <TableCell>{record.item.item_name}</TableCell>
                        <TableCell>{record.borrower_name}</TableCell>
                        <TableCell>{formatDate(record.time_borrowed)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            onClick={() => handleReturn(record.id)}
                            disabled={returningId === record.id}
                            variant="outline"
                            size="sm"
                          >
                            {returningId === record.id ? "Returning..." : "Mark Returned"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Returned Borrows */}
      {returnedBorrows.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-foreground">Returned Items ({returnedBorrows.length})</h3>
          <Card className="border-0 shadow-md overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item Code</TableHead>
                      <TableHead>Item Name</TableHead>
                      <TableHead>Borrower Name</TableHead>
                      <TableHead>Borrowed Date</TableHead>
                      <TableHead>Returned Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {returnedBorrows.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.item.item_code}</TableCell>
                        <TableCell>{record.item.item_name}</TableCell>
                        <TableCell>{record.borrower_name}</TableCell>
                        <TableCell>{formatDate(record.time_borrowed)}</TableCell>
                        <TableCell>{record.time_put_back && formatDate(record.time_put_back)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
