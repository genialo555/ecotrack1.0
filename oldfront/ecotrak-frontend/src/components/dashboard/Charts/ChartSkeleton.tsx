'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ChartSkeletonProps {
  title?: string;
}

export function ChartSkeleton({ title = "Loading..." }: ChartSkeletonProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full flex flex-col gap-4">
          <div className="flex items-center gap-4 mb-4">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[60px]" />
          </div>
          <div className="flex-1 flex items-end gap-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 bg-muted animate-pulse rounded-t-md"
                style={{
                  height: `${Math.random() * 60 + 20}%`,
                }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-8" />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
