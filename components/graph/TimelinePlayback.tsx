"use client";

import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Transaction } from "@/lib/types";

interface TimelinePlaybackProps {
  transactions: Transaction[];
  onTimeRangeChange: (startDate: Date, endDate: Date) => void;
  onPlaybackChange?: (isPlaying: boolean) => void;
}

export function TimelinePlayback({
  transactions,
  onTimeRangeChange,
  onPlaybackChange,
}: TimelinePlaybackProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Calculate date range from transactions
  useEffect(() => {
    if (transactions.length === 0) return;

    const dates = transactions
      .map((t) => {
        if (typeof t.timestamp === "string") {
          const date = new Date(t.timestamp);
          if (!isNaN(date.getTime())) return date;
        }
        return null;
      })
      .filter((d): d is Date => d !== null);

    if (dates.length === 0) return;

    const min = new Date(Math.min(...dates.map((d) => d.getTime())));
    const max = new Date(Math.max(...dates.map((d) => d.getTime())));

    setStartDate(min);
    setEndDate(max);
  }, [transactions]);

  // Playback animation
  useEffect(() => {
    if (!isPlaying || progress >= 100) {
      setIsPlaying(false);
      onPlaybackChange?.(false);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 1, 100));
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying, progress, onPlaybackChange]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    onPlaybackChange?.(!isPlaying);
  };

  const handleReset = () => {
    setProgress(0);
    setIsPlaying(false);
    onPlaybackChange?.(false);
  };

  const handleProgressChange = (value: number[]) => {
    setProgress(value[0]);
    setIsPlaying(false);
    onPlaybackChange?.(false);
  };

  const calculateCurrentRange = () => {
    if (!startDate || !endDate) return { start: null, end: null };

    const totalMs = endDate.getTime() - startDate.getTime();
    const currentMs = (totalMs * progress) / 100;
    const current = new Date(startDate.getTime() + currentMs);

    onTimeRangeChange(startDate, current);

    return {
      start: startDate.toLocaleDateString(),
      end: current.toLocaleDateString(),
    };
  };

  const range = calculateCurrentRange();

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Transaction Timeline</h3>
        <div className="text-sm text-muted-foreground">
          {startDate && endDate
            ? `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
            : "Loading..."}
        </div>
      </div>

      <div className="space-y-3">
        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePlayPause}
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
          <div className="ml-auto text-sm font-semibold text-foreground">
            {progress}%
          </div>
        </div>

        {/* Progress Slider */}
        <Slider
          value={[progress]}
          onValueChange={handleProgressChange}
          max={100}
          step={1}
          className="w-full"
        />

        {/* Current Time Range */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="p-2 rounded-lg bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground">Start</p>
            <p className="font-mono text-foreground">{range.start || "—"}</p>
          </div>
          <div className="p-2 rounded-lg bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground">Current</p>
            <p className="font-mono text-foreground">{range.end || "—"}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
