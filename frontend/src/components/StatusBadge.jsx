export default function StatusBadge({ status }) {
  const colorMap = {
    open: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    resolved: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-600',
  }

  const colorClass = colorMap[status] || 'bg-gray-100 text-gray-600'

  const displayText = status
    ? status
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    : ''

  return (
    <span className={`text-xs px-2 py-1 rounded-full ${colorClass}`}>
      {displayText}
    </span>
  )
}
