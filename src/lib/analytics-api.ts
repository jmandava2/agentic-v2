

const API_BASE_URL = 'http://localhost:8000';

interface BusinessAnalysisRequest {
  crop_types: string[];
  location: string;
  farm_size_acres: string;
  analysis_type: string;
  analysis_period_months: number;
  create_logs_and_todos: boolean;
}

interface CostAnalysis {
  seeds_cost: number;
  fertilizer_cost: number;
  pesticide_cost: number;
  labor_cost: number;
  equipment_cost: number;
  irrigation_cost: number;
  transportation_cost: number;
  storage_cost: number;
  other_costs: number;
  total_cost_per_acre: number;
  cost_per_unit: number;
}

interface ROIAnalysis {
  total_investment: number;
  total_revenue: number;
  gross_profit: number;
  net_profit: number;
  roi_percentage: number;
  payback_period_months: number;
  break_even_price: number;
  profit_margin: number;
}

interface MarketTrends {
  current_price: number;
  price_trend_30_days: string;
  price_trend_90_days: string;
  seasonal_pattern: string;
  price_forecast_1_month: number;
  price_forecast_3_months: number;
  price_forecast_6_months: number;
  demand_forecast: string;
  market_volatility: string;
  supply_demand_balance: string;
}

interface GTMStrategy {
  recommended_channels: string[];
  pricing_strategy: string;
  target_markets: string[];
  competitive_advantages: string[];
  market_entry_timing: string;
  distribution_strategy: string;
  marketing_recommendations: string[];
  partnership_opportunities: string[];
}

interface ConsumerInsights {
  target_demographics: string[];
  demand_drivers: string[];
  price_sensitivity: number;
  quality_preferences: string[];
  seasonal_demand_patterns: string;
  premium_market_potential: number;
  organic_demand_trend: string;
  local_vs_export_preference: string;
}

interface CompetitiveAnalysis {
  market_share_estimate: number;
  key_competitors: string[];
  competitive_pricing: {
    local_farms: number;
    cooperatives: number;
  };
  differentiation_opportunities: string[];
  market_gaps: string[];
  competitive_threats: string[];
  competitive_advantages: string[];
}

interface FinancialProjections {
  revenue_forecast_1_year: number;
  profit_projection_1_year: number;
  cash_flow_analysis: string;
  working_capital_needs: number;
  investment_recommendations: string[];
  funding_requirements: number;
  financial_risks: string[];
  mitigation_strategies: string[];
}

interface Visualization {
  chart_type: string;
  title: string;
  description: string;
  data_points: number;
  time_period: string;
  image_base64: string;
}

interface OptimizationRecommendations {
  cost_reduction_opportunities: string[];
  revenue_enhancement_strategies: string[];
  operational_improvements: string[];
  technology_adoption: string[];
  market_expansion_opportunities: string[];
  risk_mitigation_actions: string[];
  sustainability_initiatives: string[];
  capacity_building_needs: string[];
}

interface BusinessAnalysisReport {
  analysis_id: string;
  timestamp: string;
  farmer_id: number;
  crop_types: string[];
  analysis_period: string;
  farm_size_acres: number;
  cost_analysis: CostAnalysis;
  roi_analysis: ROIAnalysis;
  market_trends: MarketTrends;
  gtm_strategy: GTMStrategy;
  consumer_insights: ConsumerInsights;
  competitive_analysis: CompetitiveAnalysis;
  financial_projections: FinancialProjections;
  visualizations: Visualization[];
  optimization_recommendations: OptimizationRecommendations;
  immediate_actions: string[];
  strategic_initiatives: string[];
  executive_summary: string;
  confidence_score: number;
  daily_log_id: string | null;
  todo_ids: string[];
  integration_status: string;
}

interface BusinessAnalysisResponse {
  status: string;
  analysis_id: string;
  report: BusinessAnalysisReport;
  error_message: string | null;
}

class AnalyticsApiService {
  private async makeAuthenticatedRequest(endpoint: string, options: RequestInit = {}) {
    const headers = {
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJyaXNodWJAZ21haWwuY29tIiwiZXhwIjoxNzUzNTg5MTc3fQ.nO0ivX4cLwk50OYKtt7u2q8Gj4Ib4xhXQiKVgilY53E',
      'Content-Type': 'application/json',
      'accept': 'application/json',
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${error}`);
    }

    return response.json();
  }

  async getBusinessAnalysis(request: BusinessAnalysisRequest): Promise<BusinessAnalysisResponse> {
    try {
      return await this.makeAuthenticatedRequest('/api/business-intelligence/analyze', {
        method: 'POST',
        body: JSON.stringify(request),
      });
    } catch (error) {
      console.error('Failed to fetch business analysis:', error);
      throw error;
    }
  }
}

export const analyticsApi = new AnalyticsApiService();
export type { 
  BusinessAnalysisRequest, 
  BusinessAnalysisResponse, 
  BusinessAnalysisReport,
  CostAnalysis,
  ROIAnalysis,
  MarketTrends,
  GTMStrategy,
  ConsumerInsights,
  CompetitiveAnalysis,
  FinancialProjections,
  OptimizationRecommendations
};