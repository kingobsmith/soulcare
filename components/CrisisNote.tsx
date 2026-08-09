import Link from "next/link";

export default function CrisisNote({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`rounded-xl border border-clay/30 bg-clay/10 text-ink/80 ${
        compact ? "px-4 py-3 text-xs" : "px-5 py-4 text-sm"
      }`}
    >
      Soul Care is not crisis care or a substitute for professional treatment. If you are in
      immediate danger or thinking about harming yourself or others, call emergency services
      or 988 in the U.S.{" "}
      <Link href="/crisis" className="font-semibold underline underline-offset-2">
        Get urgent help
      </Link>
      .
    </div>
  );
}
