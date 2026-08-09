import Link from "next/link";

const columns = [
  {
    title: "Soul Care",
    links: [
      { href: "/about", label: "About" },
      { href: "/how-it-works", label: "How it works" },
      { href: "/resources", label: "Resources" },
      { href: "/faq", label: "FAQ" }
    ]
  },
  {
    title: "Get involved",
    links: [
      { href: "/providers/apply", label: "Provider application" },
      { href: "/affiliates", label: "Affiliate program" },
      { href: "/membership", label: "Membership" }
    ]
  },
  {
    title: "Legal & safety",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
      { href: "/crisis", label: "Crisis resources" },
      { href: "/contact", label: "Contact" }
    ]
  }
];

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-ink text-parchment">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="font-display text-lg font-semibold">Soul Care</div>
            <p className="mt-3 max-w-xs text-sm text-parchment/60">
              A faith-rooted care-navigation platform connecting people to a private
              listening companion and vetted, licensed providers.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <div className="text-xs font-semibold uppercase tracking-widest text-brass">
                {col.title}
              </div>
              <ul className="mt-4 space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-parchment/70 hover:text-parchment">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-4 border-t border-parchment/10 pt-6 text-xs text-parchment/50 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Soul Care. All rights reserved.</p>
          <p className="max-w-xl">
            Soul Care is not crisis care or a substitute for professional treatment. If you
            are in immediate danger or thinking about harming yourself or others, call
            emergency services or 988 in the U.S.
          </p>
        </div>
      </div>
    </footer>
  );
}
