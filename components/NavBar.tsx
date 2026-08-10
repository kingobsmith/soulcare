import Link from "next/link";

const links = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/membership", label: "Membership" },
  { href: "/providers", label: "For providers" },
  { href: "/affiliates", label: "Affiliate Program", bold: true },
  { href: "/resources", label: "Resources" },
  { href: "/about", label: "About" },
];

export default function NavBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-parchment/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-xl font-semibold tracking-tight text-ink">
          Soul Care
        </Link>
        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm transition hover:text-ink ${
                l.bold ? "font-semibold text-teal" : "text-ink/70"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/affiliates"
            className="hidden text-sm font-semibold text-teal hover:text-teal-dark md:block lg:hidden"
          >
            Affiliate Program
          </Link>
          <Link href="/login" className="hidden text-sm font-medium text-ink/70 hover:text-ink sm:block">
            Log in
          </Link>
          <Link href="/signup" className="btn-primary">
            Sign up now
          </Link>
        </div>
      </div>
    </header>
  );
}
