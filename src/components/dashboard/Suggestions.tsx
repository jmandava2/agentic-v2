
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';
import type { Crop } from '@/lib/crops-api';

// Mock suggestions based on crop name
const mockSuggestions: { [key: string]: { title: string; description: string }[] } = {
  'Sona Masoori Rice': [
    {
      title: 'Optimize Irrigation',
      description: 'Based on the current vegetative stage and humidity, consider reducing irrigation by 10% to prevent blast risk without affecting growth.',
    },
    {
      title: 'Nutrient Management',
      description: 'A top dressing of nitrogen is recommended in the next 7 days to support maximum tillering. Our soil analysis shows sufficient phosphorus.',
    },
    {
      title: 'Pest Monitoring',
      description: 'Low levels of leafhoppers detected. While not critical, continue monitoring. No pesticide application is needed at this time.',
    },
  ],
  'Tomato': [
    {
      title: 'Staking & Pruning',
      description: 'Ensure all plants are properly staked to support fruit weight. Prune lower suckers to improve air circulation and direct energy to fruit development.',
    },
    {
      title: 'Calcium Supplement',
      description: 'To prevent blossom-end rot, a foliar spray of calcium nitrate is recommended this week.',
    },
  ],
  default: [
    {
        title: 'General Advice',
        description: 'Ensure regular monitoring of your crops for any signs of pests or diseases. Maintain optimal soil moisture levels.'
    }
  ]
};

export function Suggestions({ crop }: { crop: Crop }) {
  const suggestions = mockSuggestions[crop.crop_name] || mockSuggestions.default;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
            <Lightbulb />
            Suggestions for {crop.crop_name}
        </CardTitle>
        <CardDescription>AI-powered recommendations to improve your yield.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {suggestions.map((item, index) => (
            <div key={index} className="p-3 bg-secondary rounded-lg">
              <p className="font-semibold">{item.title}</p>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
