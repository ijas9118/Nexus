import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/atoms/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/organisms/dropdown-menu";
import { useTheme } from "@/components/theme/theme-provider";

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <div className="relative w-[1.2rem] h-[1.2rem]">
            <Sun className="absolute h-full w-full rotate-0 scale-100 transition-transform duration-300 ease-in-out opacity-100 dark:opacity-0 dark:rotate-90" />
            <Moon className="absolute h-full w-full rotate-90 scale-100 transition-transform duration-300 ease-in-out opacity-0 dark:opacity-100 dark:rotate-0" />
          </div>
          <span className="sr-only">Toggle theme</span>
          <span className="text-sm text-muted-foreground">⌘K</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
