
import { Card, CardContent } from "@/components/ui/card";

interface DashboardCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: string;
  className?: string;
}

const DashboardCard = ({
  title,
  value,
  subtitle,
  icon,
  color = "bg-lending-light text-lending-primary",
  className,
}: DashboardCardProps) => {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center">
          {icon && (
            <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 ${color}`}>
              {icon}
            </div>
          )}
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-xl font-bold">{value}</p>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
