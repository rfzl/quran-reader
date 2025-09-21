import { Switch } from "@/components/ui/switch"
import { useTheme } from "next-themes"

export default function Toolbar() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex items-center gap-4 mb-4">
      <Switch
        checked={theme === "dark"}
        onCheckedChange={(v) => setTheme(v ? "dark" : "light")}
        id="dark-mode-switch"
      />
      <label htmlFor="dark-mode-switch">Dark Mode</label>
    </div>
  )
}