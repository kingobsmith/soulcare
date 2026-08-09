import Link from "next/link";
import Section from "@/components/Section";

export default function NotFound() {
  return (
    <Section tone="parchment" className="text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-2 font-display text-3xl font-semibold">Page not found</h1>
      <p className="mt-3 text-ink/70">
        The page you're looking for doesn't exist or has moved.
      </p>
      <Link href="/" className="btn-primary mt-6 inline-flex">
        Back to home
      </Link>
    </Section>
  );
}
