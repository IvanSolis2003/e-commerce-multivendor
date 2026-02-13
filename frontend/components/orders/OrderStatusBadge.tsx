import { getOrderStatusLabel, getOrderStatusColor, getOrderStatusIcon } from '@/lib/utils/format';

interface OrderStatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
}

export function OrderStatusBadge({ status, size = 'md' }: OrderStatusBadgeProps) {
  const statusColor = getOrderStatusColor(status);
  const statusLabel = getOrderStatusLabel(status);
  const statusIcon = getOrderStatusIcon(status);

  // Tamaños diferentes según el prop
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${statusColor} ${sizeClasses[size]}`}>
      <span>{statusIcon}</span>
      <span>{statusLabel}</span>
    </span>
  );
}