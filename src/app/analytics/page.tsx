
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { 
  MapPin, 
  Maximize, 
  BarChart, 
  CalendarClock, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target,
  Users,
  ShoppingCart,
  Lightbulb,
  AlertTriangle,
  RefreshCw,
  Loader2,
  Search,
  Settings
} from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, BarChart as RechartsBarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { analyticsApi, type BusinessAnalysisResponse, type BusinessAnalysisRequest } from '@/lib/analytics-api';


const InfoRow = ({ icon, label, value, colorClass }: { icon: React.ReactNode; label: string; value: string | number, colorClass: string }) => (
    <div className="flex items-start gap-4">
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg text-black", colorClass)}>
            {icon}
        </div>
        <div>
            <p className="font-semibold text-muted-foreground">{label}</p>
            <p className="text-foreground">{value}</p>
        </div>
    </div>
);

const MetricCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend, 
  trendValue 
}: { 
  title: string; 
  value: string | number; 
  subtitle?: string; 
  icon: React.ReactNode; 
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
          {trend && trendValue && (
            <div className={`flex items-center gap-1 text-xs ${
              trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-muted-foreground'
            }`}>
              {trend === 'up' ? <TrendingUp className="h-3 w-3" /> : 
               trend === 'down' ? <TrendingDown className="h-3 w-3" /> : null}
              {trendValue}
            </div>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

const cropOptions = [
    { value: "all", label: "All Crops" },
    { value: "rice", label: "Rice" },
    { value: "wheat", label: "Wheat" },
    { value: "corn", label: "Corn" },
    { value: "sugarcane", label: "Sugarcane" },
    { value: "cotton", label: "Cotton" },
    { value: "soybean", label: "Soybean" },
    { value: "tomato", label: "Tomato" },
    { value: "potato", label: "Potato" },
    { value: "onion", label: "Onion" },
];

const analysisTypeOptions = [
    { value: "comprehensive", label: "Comprehensive Analysis" },
    { value: "market_analysis", label: "Market Analysis" },
    { value: "cost_analysis", label: "Cost Analysis" },
    { value: "roi_analysis", label: "ROI Analysis" },
    { value: "competitive_analysis", label: "Competitive Analysis" },
];

const locationOptions = [
    { value: "Karnataka", label: "Karnataka" },
    { value: "Tamil Nadu", label: "Tamil Nadu" },
    { value: "Andhra Pradesh", label: "Andhra Pradesh" },
    { value: "Maharashtra", label: "Maharashtra" },
    { value: "Punjab", label: "Punjab" },
    { value: "Haryana", label: "Haryana" },
    { value: "Uttar Pradesh", label: "Uttar Pradesh" },
    { value: "West Bengal", label: "West Bengal" },
    { value: "Gujarat", label: "Gujarat" },
    { value: "Rajasthan", label: "Rajasthan" },
];

export default function AnalyticsPage() {
    const { t } = useLanguage();
    const [analyticsData, setAnalyticsData] = useState<BusinessAnalysisResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(true);

    const form = useForm<BusinessAnalysisRequest>({
        defaultValues: {
            crop_types: ["all"],
            location: "Karnataka",
            farm_size_acres: "12",
            analysis_type: "comprehensive",
            analysis_period_months: 12,
            create_logs_and_todos: true,
        },
    });

    const loadAnalyticsData = async (formData: BusinessAnalysisRequest) => {
        setLoading(true);
        setError(null);
        try {
            const response = await analyticsApi.getBusinessAnalysis(formData);
            setAnalyticsData(response);
            setShowForm(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load analytics data');
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = (data: BusinessAnalysisRequest) => {
        loadAnalyticsData(data);
    };

    const handleNewAnalysis = () => {
        setShowForm(true);
        setAnalyticsData(null);
        setError(null);
    };

    if (showForm) {
        return (
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <h1 className="font-headline text-3xl font-bold">{t('analytics.title')}</h1>
                    {analyticsData && (
                        <Button onClick={handleNewAnalysis} variant="outline">
                            <Settings className="h-4 w-4 mr-2" />
                            New Analysis
                        </Button>
                    )}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Search className="h-5 w-5" />
                            Business Intelligence Analysis
                        </CardTitle>
                        <CardDescription>
                            Configure your farm analysis parameters to get comprehensive business insights
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="crop_types"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Crop Types</FormLabel>
                                                <Select 
                                                    onValueChange={(value) => field.onChange([value])}
                                                    defaultValue={field.value[0]}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select crop type" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {cropOptions.map((option) => (
                                                            <SelectItem key={option.value} value={option.value}>
                                                                {option.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormDescription>
                                                    Select the crop type for analysis
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="location"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Location</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select location" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {locationOptions.map((option) => (
                                                            <SelectItem key={option.value} value={option.value}>
                                                                {option.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormDescription>
                                                    Select your farm location
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="farm_size_acres"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Farm Size (Acres)</FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        placeholder="Enter farm size in acres" 
                                                        type="number"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Enter your total farm size in acres
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="analysis_type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Analysis Type</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select analysis type" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {analysisTypeOptions.map((option) => (
                                                            <SelectItem key={option.value} value={option.value}>
                                                                {option.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormDescription>
                                                    Choose the type of analysis you want
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="analysis_period_months"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Analysis Period (Months)</FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        placeholder="Enter analysis period" 
                                                        type="number"
                                                        min="1"
                                                        max="24"
                                                        {...field}
                                                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Analysis period in months (1-24)
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="create_logs_and_todos"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="text-base">
                                                        Create Logs and Todos
                                                    </FormLabel>
                                                    <FormDescription>
                                                        Generate actionable logs and todo items from analysis
                                                    </FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <Button type="submit" disabled={loading} className="min-w-[150px]">
                                        {loading ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Analyzing...
                                            </>
                                        ) : (
                                            <>
                                                <Search className="h-4 w-4 mr-2" />
                                                Start Analysis
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                {error && (
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-2 text-red-600">
                                <AlertTriangle className="h-5 w-5" />
                                <span>Error: {error}</span>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex items-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>Loading analytics data...</span>
                </div>
            </div>
        );
    }

    if (!analyticsData) return null;

    const { report } = analyticsData;

    // Prepare chart data
    const priceData = [
        { month: 'Current', price: report.market_trends.current_price },
        { month: '1 Month', price: report.market_trends.price_forecast_1_month },
        { month: '3 Months', price: report.market_trends.price_forecast_3_months },
        { month: '6 Months', price: report.market_trends.price_forecast_6_months },
    ];

    const roiData = [
        { name: 'Investment', value: report.roi_analysis.total_investment },
        { name: 'Revenue', value: report.roi_analysis.total_revenue },
        { name: 'Profit', value: report.roi_analysis.net_profit },
    ];

    const competitiveData = [
        { name: 'Your Farm', value: report.competitive_analysis.market_share_estimate },
        { name: 'Others', value: 100 - report.competitive_analysis.market_share_estimate },
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="font-headline text-3xl font-bold">{t('analytics.title')}</h1>
                <Button onClick={handleNewAnalysis} variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    New Analysis
                </Button>
            </div>

            {/* Farm Details */}
            <Card>
                <CardHeader>
                    <CardTitle>Farm Analysis Details</CardTitle>
                    <CardDescription>Analysis ID: {report.analysis_id}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InfoRow
                            icon={<MapPin />}
                            label="Location"
                            value="Karnataka"
                        />
                        <InfoRow
                            icon={<Maximize />}
                            label="Farm Size"
                            value={`${report.farm_size_acres} Acres`}
                        />
                        <InfoRow
                            icon={<BarChart />}
                            label="Analysis Period"
                            value={report.analysis_period}
                        />
                        <InfoRow
                            icon={<CalendarClock />}
                            label="Confidence Score"
                            value={`${(report.confidence_score * 100).toFixed(1)}%`}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="ROI Percentage"
                    value={`${report.roi_analysis.roi_percentage.toFixed(1)}%`}
                    icon={<TrendingUp />}
                    trend="neutral"
                />
                <MetricCard
                    title="Current Market Price"
                    value={`₹${report.market_trends.current_price.toFixed(2)}`}
                    subtitle="per unit"
                    icon={<DollarSign />}
                    trend={report.market_trends.price_trend_30_days === 'increasing' ? 'up' : 'down'}
                    trendValue={report.market_trends.price_trend_30_days}
                />
                <MetricCard
                    title="Market Share"
                    value={`${report.competitive_analysis.market_share_estimate}%`}
                    icon={<Target />}
                    trend="neutral"
                />
                <MetricCard
                    title="Premium Market Potential"
                    value={`${report.consumer_insights.premium_market_potential}%`}
                    icon={<Users />}
                    trend="up"
                    trendValue="Growing"
                />
            </div>

            {/* Executive Summary */}
            <Card>
                <CardHeader>
                    <CardTitle>Executive Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                        {report.executive_summary}
                    </p>
                </CardContent>
            </Card>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Price Forecast Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Price Forecast</CardTitle>
                        <CardDescription>Market price trends and predictions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer
                            config={{
                                price: {
                                    label: "Price (₹)",
                                    color: "hsl(var(--chart-1))",
                                },
                            }}
                            className="h-[300px]"
                        >
                            <LineChart data={priceData}>
                                <XAxis dataKey="month" />
                                <YAxis />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Line 
                                    type="monotone" 
                                    dataKey="price" 
                                    stroke="var(--color-price)" 
                                    strokeWidth={2}
                                    dot={{ fill: "var(--color-price)" }}
                                />
                            </LineChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                {/* Market Share Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Market Share</CardTitle>
                        <CardDescription>Your position in the market</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer
                            config={{
                                share: {
                                    label: "Market Share",
                                    color: "hsl(var(--chart-2))",
                                },
                            }}
                            className="h-[300px]"
                        >
                            <PieChart>
                                <Pie
                                    data={competitiveData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, value }) => `${name}: ${value}%`}
                                >
                                    {competitiveData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <ChartTooltip content={<ChartTooltipContent />} />
                            </PieChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Market Trends */}
            <Card>
                <CardHeader>
                    <CardTitle>Market Trends & Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-semibold mb-2">Market Volatility</h4>
                            <Badge variant={report.market_trends.market_volatility === 'high' ? 'destructive' : 'secondary'}>
                                {report.market_trends.market_volatility}
                            </Badge>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">Demand Forecast</h4>
                            <p className="text-sm text-muted-foreground">{report.market_trends.demand_forecast}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">Seasonal Pattern</h4>
                            <p className="text-sm text-muted-foreground">{report.market_trends.seasonal_pattern}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">Supply-Demand Balance</h4>
                            <p className="text-sm text-muted-foreground">{report.market_trends.supply_demand_balance}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* GTM Strategy */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5" />
                        Go-to-Market Strategy
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h4 className="font-semibold mb-2">Recommended Channels</h4>
                        <div className="flex flex-wrap gap-2">
                            {report.gtm_strategy.recommended_channels.map((channel, index) => (
                                <Badge key={index} variant="outline">{channel}</Badge>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">Pricing Strategy</h4>
                        <p className="text-sm text-muted-foreground">{report.gtm_strategy.pricing_strategy}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">Target Markets</h4>
                        <div className="flex flex-wrap gap-2">
                            {report.gtm_strategy.target_markets.map((market, index) => (
                                <Badge key={index} variant="secondary">{market}</Badge>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lightbulb className="h-5 w-5" />
                            Immediate Actions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {report.immediate_actions.map((action, index) => (
                                <li key={index} className="flex items-start gap-2">
                                    <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                                    <span className="text-sm">{action}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Target className="h-5 w-5" />
                            Strategic Initiatives
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {report.strategic_initiatives.map((initiative, index) => (
                                <li key={index} className="flex items-start gap-2">
                                    <div className="h-2 w-2 rounded-full bg-secondary mt-2 flex-shrink-0" />
                                    <span className="text-sm">{initiative}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
