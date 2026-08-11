export default function Section({
  children,
  className = "",
  tone = "parchment",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "parchment" | "white" | "ink";
  id?: string;
}) {
  const bg =
    tone === "white" ? "bg-white" : tone === "ink" ? "bg-ink text-parchment" : "bg-parchment";
  return (
    <section id={id} className={`${bg} ${className}`}>
      <div className="mx-auto max-w-6xl px-6 py-20">{children}</div>
    </section>
  );
}
