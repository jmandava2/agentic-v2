
'use client';

import { Line, LineChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';

const chartConfig = {
  price: {
    label: 'Price',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

type MarketChartProps = {
  data: { label: string; price: number }[];
};

export function MarketChart({ data }: MarketChartProps) {
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <LineChart
        accessibilityLayer
        data={data}
        margin={{
          top: 5,
          right: 20,
          left: -10,
          bottom: 5,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          tickFormatter={(value) => value.slice(0, 6)}
        />
        <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            width={40}
            domain={['dataMin', 'dataMax']}
            allowDataOverflow={true}
        />
        <ChartTooltip
          cursor={true}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Line 
            dataKey="price" 
            type="monotone"
            stroke="var(--color-price)" 
            strokeWidth={2}
            dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
}
