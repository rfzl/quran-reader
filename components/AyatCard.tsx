import { Play } from "lucide-react"

export default function AyatCard({ ayat, surahNomor }: { ayat: any, surahNomor: number }) {
  if (!ayat) return null;

  return (
    <div className="rounded-lg bg-card border border-border p-4 shadow-sm hover:shadow transition">
      <div className="flex items-center justify-between mb-2">
        <span className="text-muted-foreground text-sm">Ayat {ayat.nomor_ayat}</span>
        <button className="p-2 rounded-full bg-accent hover:bg-accent/80 transition" aria-label="Play audio">
          <Play className="w-4 h-4" />
        </button>
      </div>
      <div className="font-arabic text-2xl mb-2">{ayat.teks_arab}</div>
      <div className="text-base mb-1 text-primary/90">{ayat.teks_latin}</div>
      <div className="text-sm text-muted-foreground">{ayat.teks_indonesia}</div>
    </div>
  )
}