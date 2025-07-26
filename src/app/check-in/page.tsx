
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HealthCheckPane } from '@/components/check-in/HealthCheckPane';
import { YieldLogPane } from '@/components/check-in/YieldLogPane';

export default function CheckInPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <Tabs defaultValue="health-check">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="health-check">Health Check</TabsTrigger>
          <TabsTrigger value="yield-log">Yield Log</TabsTrigger>
        </TabsList>
        <TabsContent value="health-check">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">
                Crop Health Check-in
              </CardTitle>
              <CardDescription>
                Capture an image of your crop to get an AI health analysis.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HealthCheckPane />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="yield-log">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Log Your Yield</CardTitle>
              <CardDescription>
                Keep a record of your harvest data.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <YieldLogPane />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
