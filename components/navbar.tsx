"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function Navbar() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="border-b border-border bg-card shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Church Inventory</h1>
          <div className="flex gap-8">
            <Link
              href="/"
              className={`font-medium transition-colors ${
                isActive("/")
                  ? "text-primary border-b-2 border-primary pb-1"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Home
            </Link>
            <Link
              href="/inventory"
              className={`font-medium transition-colors ${
                isActive("/inventory")
                  ? "text-primary border-b-2 border-primary pb-1"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Inventory
            </Link>
            <Link
              href="/borrow"
              className={`font-medium transition-colors ${
                isActive("/borrow")
                  ? "text-primary border-b-2 border-primary pb-1"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Borrow
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
