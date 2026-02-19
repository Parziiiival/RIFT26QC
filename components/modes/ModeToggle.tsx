"use client"

interface ModeToggleProps {
  mode: "analyst" | "investigator"
  onModeChange: (mode: "analyst" | "investigator") => void
}

export function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="flex items-center gap-2 bg-card-hover rounded-lg p-1 border border-card-hover">
      <button
        onClick={() => onModeChange("analyst")}
        className={`px-4 py-2 rounded-md font-medium transition-all text-sm ${
          mode === "analyst"
            ? "bg-accent text-background"
            : "text-muted hover:text-foreground"
        }`}
      >
        Analyst
      </button>
      <button
        onClick={() => onModeChange("investigator")}
        className={`px-4 py-2 rounded-md font-medium transition-all text-sm ${
          mode === "investigator"
            ? "bg-accent text-background"
            : "text-muted hover:text-foreground"
        }`}
      >
        Investigator
      </button>
    </div>
  )
}
