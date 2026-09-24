export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-white">{title}</h1>
      {description && <p className="mt-1 text-sm text-neutral-400">{description}</p>}
    </div>
  );
}
