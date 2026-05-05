import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.ComponentProps<"input"> {
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
}

function Input({ className, type, startContent, endContent, ...props }: InputProps) {
  return (
    <div className="relative flex items-center w-full">
      {startContent && (
        <div className="absolute left-3 inset-y-0 flex items-center justify-center text-muted-foreground pointer-events-none">
          {startContent}
        </div>
      )}
      <input
        type={type}
        data-slot="input"
        className={cn(
          "h-9 w-full min-w-0 rounded-md border border-input bg-transparent py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
          startContent ? "pl-10" : "pl-3",
          endContent ? "pr-10" : "pr-3",
          className
        )}
        {...props}
      />
      {endContent && (
        <div className="absolute right-3 inset-y-0 flex items-center justify-center text-muted-foreground">
          {endContent}
        </div>
      )}
    </div>
  )
}

export { Input }
