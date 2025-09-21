import Link from "next/link"

export default function SurahCard({ surah }: { surah: any }) {
  return (
    <Link href={`/surah/${surah.nomor}`} className="block rounded-xl border border-border bg-card shadow-sm hover:shadow-lg hover:border-primary transition p-4 group">
      <div className="flex items-center justify-between mb-1">
        <span className="font-bold text-lg text-primary group-hover:text-accent transition">{surah.nama_latin}</span>
        <span className="font-arabic text-2xl">{surah.nama}</span>
      </div>
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{surah.arti}</span>
        <span>{surah.jumlah_ayat} ayat</span>
      </div>
    </Link>
  )
}