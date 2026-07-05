export default function PageHeader({ title }: { title: string }) {
  return (
    <h1 className="text-3xl font-bold text-foreground text-center py-4">
      {title}
    </h1>
  );
}
