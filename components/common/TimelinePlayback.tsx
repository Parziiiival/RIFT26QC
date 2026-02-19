"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Transaction } from "@/lib/types";

interface TimelinePlaybackProps {
  transactions: Transaction[];
  onTimeChange?: (timestamp: string, visibleTransactions: Transaction[]) => void;
}

export function TimelinePlayback({ transactions, onTimeChange }: TimelinePlaybackProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("");

  // Sort transactions by timestamp
  const sortedTransactions = [...transactions]
    .filter((t) => t.timestamp)
    .sort((a, b) => {
      const timeA = new Date(a.timestamp || "").getTime();
      const timeB = new Date(b.timestamp || "").getTime();
      return timeA - timeB;
    });

  const minTime = sortedTransactions[0]?.timestamp || "";
  const maxTime = sortedTransactions[sortedTransactions.length - 1]?.timestamp || "";

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setIsPlaying(false);
          return 100;
        }
        return prev + 1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    if (sortedTransactions.length === 0) return;

    const index = Math.floor((progress / 100) * (sortedTransactions.length - 1));
    const tx = sortedTransactions[index];
    if (tx?.timestamp) {
      setCurrentTime(tx.timestamp);

      // Get all transactions up to this point
      const visibleTxs = sortedTransactions.filter((t) => {
        const time = new Date(t.timestamp || "").getTime();
        const currentTimeMs = new Date(tx.timestamp || "").getTime();
        return time <= currentTimeMs;
      });

      onTimeChange?.(tx.timestamp, visibleTxs);
    }
  }, [progress, sortedTransactions, onTimeChange]);

  const handleReset = () => {
    setProgress(0);
    setIsPlaying(false);
    setCurrentTime(minTime);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Time Travel Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {/* Timeline slider */}
          <div>
            <Slider
              value={[progress]}
              onValueChange={(value) => setProgress(value[0])}
              max={100}
              step={1}
              className="w-full"
            />
          </div>

          {/* Time display */}
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">Start</p>
              <p className="font-mono text-xs">{minTime.substring(0, 10)}</p>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground text-xs">Current</p>
              <p className="font-mono text-xs">{currentTime.substring(0, 10)}</p>
            </div>
            <div className="text-right">
              <p className="text-muted-foreground text-xs">End</p>
              <p className="font-mono text-xs">{maxTime.substring(0, 10)}</p>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              {sortedTransactions.length} total transactions
            </p>
            <p className="text-sm font-semibold mt-1">
              {Math.floor((progress / 100) * sortedTransactions.length)} visible
            </p>
          </div>

          {/* Controls */}
          <div className="flex gap-2 justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              className="gap-2"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Play
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
