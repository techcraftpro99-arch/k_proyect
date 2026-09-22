export function GradientBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="gradient-blob -left-32 top-0 h-96 w-96"
        style={{ backgroundColor: "rgba(58, 137, 255, 0.22)" }}
      />
      <div
        className="gradient-blob right-0 top-1/4 h-80 w-80"
        style={{ backgroundColor: "rgba(158, 0, 255, 0.18)" }}
      />
      <div
        className="gradient-blob bottom-0 left-1/3 h-72 w-72"
        style={{ backgroundColor: "rgba(58, 137, 255, 0.15)" }}
      />
      <div
        className="gradient-blob -right-20 bottom-1/4 h-64 w-64"
        style={{ backgroundColor: "rgba(158, 0, 255, 0.12)" }}
      />
    </div>
  );
}
