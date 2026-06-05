// Simple custom 404 page to avoid context errors
export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-surface text-on-surface">
      <h1 className="text-4xl font-display">Page Not Found</h1>
    </div>
  );
}
