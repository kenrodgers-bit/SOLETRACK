export default function AlertBadge({ show, children = 'Low stock' }) {
  if (!show) return null;
  return <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">{children}</span>;
}
