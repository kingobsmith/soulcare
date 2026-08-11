import Link from "next/link";
import { GLOBAL_REACH } from "@/components/PricingGrids";

const VIDEO_ID = "N8Jrxi3L0W4";

export default function HeroVideo() {
  const embed = `https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${VIDEO_ID}&controls=0&playsinline=1&rel=0&modestbranding=1&showinfo=0`;

  return (
    <section className="relative flex min-h-[88vh] items-end overflow-hidden bg-ink text-parchment">
      <div className="absolute inset-0" aria-hidden>
        <iframe
          src={embed}
          title="Soul Care"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/40" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-16 pt-32">
        <p className="eyebrow text-brass">Soul Care</p>
        <h1 className="mt-4 max-w-2xl font-display text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl">
          A liaison between you and your care team.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-parchment/80">
          Angel listens daily. Your therapist, doctor, and pastor stay connected when you&apos;re
          ready.
        </p>
        <p className="mt-3 max-w-2xl text-sm text-parchment/60">{GLOBAL_REACH}</p>
        <div className="mt-8 flex flex-wrap gap-4">
          <a href="#plans" className="btn-gold">
            View plans &amp; checkout
          </a>
          <Link href="/signup" className="btn-secondary border-parchment/30 text-parchment hover:bg-parchment hover:text-ink">
            Create account
          </Link>
        </div>
        <p className="mt-6 max-w-lg text-xs text-parchment/50">
          Not crisis care. In an emergency call 911 or <strong>988</strong> (U.S.).
        </p>
      </div>
    </section>
  );
}
