import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function TrendCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            {/* Rank circle skeleton */}
            <Skeleton className="w-8 h-8 rounded-full" />
            
            <div className="flex-1 space-y-2">
              {/* Title skeleton */}
              <Skeleton className="h-6 w-3/4" />
              
              {/* Badges skeleton */}
              <div className="flex items-center gap-2 flex-wrap">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
          </div>
          
          {/* Arrow skeleton */}
          <Skeleton className="w-5 h-5" />
        </div>
      </CardHeader>
    </Card>
  )
}

export function TrendCardSkeletonList({ count = 5 }: { count?: number }) {
  return (
    <div className="grid gap-4">
      {Array.from({ length: count }, (_, index) => (
        <TrendCardSkeleton key={index} />
      ))}
    </div>
  )
} 