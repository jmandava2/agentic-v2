
'use client';
import { useState } from 'react';
import { generateFarmTodos } from '@/ai/flows/generate-farm-todos';
import type { GenerateFarmTodosOutput } from '@/ai/flows/generate-farm-todos';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckSquare, ListTodo, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function Todos() {
  const [todos, setTodos] = useState<GenerateFarmTodosOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateTodos = async () => {
    setLoading(true);
    setTodos(null);
    try {
      const result = await generateFarmTodos({
        farmName: 'Namma Krushi Farm',
        weather: {
          temperature: 28,
          humidity: 72,
          forecast: 'Partly cloudy with a chance of afternoon showers.',
        },
        crop: 'Sona Masoori Rice',
        cropLifecycleStage: 'vegetative',
        farmState: {
          soilMoisture: 60,
          pestPressure: 'Low, some leafhoppers spotted.',
          diseaseRisk: 'Moderate risk of blast due to humidity.',
        },
      });
      setTodos(result);
    } catch (error) {
      console.error('Error generating todos:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate To-Dos. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-headline">AI-Powered To-Dos</CardTitle>
          <CardDescription>
            Personalized tasks for today.
          </CardDescription>
        </div>
        <Button onClick={handleGenerateTodos} disabled={loading} size="sm">
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ListTodo className="mr-2 h-4 w-4" />
          )}
          Generate
        </Button>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        {!loading && !todos && (
          <div className="text-center text-muted-foreground p-8">
            <p>Click "Generate" to get your personalized to-do list.</p>
          </div>
        )}
        {todos?.todos && (
          <ul className="space-y-3">
            {todos.todos.map((todo, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckSquare className="h-5 w-5 flex-shrink-0 text-primary" />
                <span>{todo}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
