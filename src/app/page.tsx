
import { FarmInfoCard } from '@/components/dashboard/FarmInfoCard';
import { WeatherCard } from '@/components/dashboard/WeatherCard';
import { Todos } from '@/components/dashboard/Todos';
import { Advisories } from '@/components/dashboard/Advisories';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <FarmInfoCard />
        </div>
        <WeatherCard />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Todos />
        <Advisories />
      </div>
    </div>
  );
}
