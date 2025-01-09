'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ChartErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ChartError({
  title = "Error Loading Chart",
  message = "An error occurred while loading the chart data. Please try again.",
  onRetry,
}: ChartErrorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium text-destructive flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full flex flex-col items-center justify-center gap-4">
          <p className="text-muted-foreground text-center max-w-md">
            {message}
          </p>
          {onRetry && (
            <Button
              variant="outline"
              onClick={onRetry}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
