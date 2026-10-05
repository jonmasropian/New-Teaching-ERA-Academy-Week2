export default function PriorityBadge({ priority }) {
  const colorMap = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800',
  }

  const colorClass = colorMap[priority] || 'bg-gray-100 text-gray-600'

  const displayText = priority
    ? priority.charAt(0).toUpperCase() + priority.slice(1)
    : ''

  return (
    <span className={`text-xs px-2 py-1 rounded-full ${colorClass}`}>
      {displayText}
    </span>
  )
}
