"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function QRScanner() {
  return (
    <Card className="border-0 shadow-md bg-amber-50 border-l-4 border-amber-400">
      <CardHeader>
        <CardTitle className="text-amber-900">QR Code Scanner</CardTitle>
      </CardHeader>
      <CardContent>
        <Button disabled className="gap-2">
          📸 Open Camera
        </Button>
        <p className="text-sm text-amber-800 mt-3">
          <strong>Status:</strong> QR code scanning is currently in development. Coming soon!
        </p>
      </CardContent>
    </Card>
  )
}
