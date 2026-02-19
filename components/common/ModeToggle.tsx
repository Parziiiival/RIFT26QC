"use client";

import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface ModeToggleProps {
  investigatorMode: boolean;
  onToggle: (mode: boolean) => void;
}

export function ModeToggle({ investigatorMode, onToggle }: ModeToggleProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-border">
      <span className="text-xs font-semibold text-muted-foreground uppercase">Mode:</span>
      <Button
        variant={!investigatorMode ? "default" : "ghost"}
        size="sm"
        onClick={() => onToggle(false)}
        className="text-xs"
      >
        <EyeOff className="w-3 h-3 mr-1" />
        Analyst
      </Button>
      <Button
        variant={investigatorMode ? "default" : "ghost"}
        size="sm"
        onClick={() => onToggle(true)}
        className="text-xs"
      >
        <Eye className="w-3 h-3 mr-1" />
        Investigator
      </Button>
    </div>
  );
}
