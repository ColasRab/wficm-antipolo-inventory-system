import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Stats {
  goodCondition: number
  damagedWorking: number
  needsFixing: number
  damaged: number
  toDispose: number
}

export function InventoryStats({ stats }: { stats: Stats }) {
  const statCards = [
    {
      label: "Good Condition",
      value: stats.goodCondition,
      color: "bg-emerald-100 text-emerald-800",
      description: "Items in perfect condition",
    },
    {
      label: "Damaged But Working",
      value: stats.damagedWorking,
      color: "bg-blue-100 text-blue-800",
      description: "Items that need monitoring",
    },
    {
      label: "Needs Fixing",
      value: stats.needsFixing,
      color: "bg-amber-100 text-amber-800",
      description: "Items requiring repair",
    },
    {
      label: "Damaged",
      value: stats.damaged,
      color: "bg-orange-100 text-orange-800",
      description: "Non-functional items",
    },
    {
      label: "To Dispose",
      value: stats.toDispose,
      color: "bg-red-100 text-red-800",
      description: "Items to be disposed",
    },
  ]

  const total = Object.values(stats).reduce((a, b) => a + b, 0)

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {statCards.map((stat) => (
          <Card key={stat.label} className="border-0 shadow-md">
            <CardHeader className={`${stat.color} rounded-t-lg`}>
              <CardTitle className="text-sm font-semibold">{stat.label}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Total Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-5xl font-bold text-primary">{total}</div>
        </CardContent>
      </Card>
    </div>
  )
}
