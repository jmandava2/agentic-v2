import { authService } from './auth';

const API_BASE_URL = 'http://127.0.0.1:8000';

interface DiseaseIdentification {
  disease_name: string;
  scientific_name: string;
  confidence: string;
  confidence_score: number;
  symptoms_observed: string[];
  affected_plant_parts: string[];
  severity: string;
}

interface EnvironmentalAnalysis {
  soil_ph_impact: string;
  moisture_conditions: string;
  temperature_range: string;
  humidity_impact: string;
  nutrient_deficiencies: string[];
  environmental_stress_factors: string[];
}

interface WeatherCorrelation {
  location: string;
  temperature_avg: number;
  temperature_min: number;
  temperature_max: number;
  humidity: number;
  rainfall: number;
  wind_speed: number;
  pressure: number;
}

interface TreatmentOption {
  treatment_name: string;
  treatment_type: string;
  active_ingredients: string[];
  application_method: string;
  dosage: string;
  frequency: string;
  timing: string;
  cost_estimate: string;
  availability: string;
  effectiveness: number;
  side_effects: string[];
}

interface PreventionStrategy {
  strategy_name: string;
  description: string;
  implementation_steps: string[];
  timing: string;
  cost: string;
  effectiveness: number;
}

interface YieldImpact {
  potential_yield_loss: number;
  economic_impact: string;
  quality_impact: string;
  market_value_impact: string;
  recovery_timeline: string;
  mitigation_potential: number;
}

interface ResearchFindings {
  disease_causes: string[];
  pathogen_lifecycle: string;
  spread_mechanisms: string[];
  host_range: string[];
  research_sources: string[];
  recent_developments: string[];
}

interface DiseaseAnalysisReport {
  analysis_id: string;
  timestamp: string;
  crop_type: string;
  location: string;
  crop_id: number;
  disease_identification: DiseaseIdentification;
  environmental_analysis: EnvironmentalAnalysis;
  weather_correlation: WeatherCorrelation;
  research_findings: ResearchFindings;
  treatment_options: TreatmentOption[];
  prevention_strategies: PreventionStrategy[];
  yield_impact: YieldImpact;
  executive_summary: string;
  immediate_actions: string[];
  long_term_recommendations: string[];
  confidence_overall: number;
  daily_log_id: number;
  todo_ids: number[];
  integration_status: string;
  database_report_id: number;
}

interface DiseaseAnalysisResponse {
  status: string;
  analysis_id: string;
  report: DiseaseAnalysisReport;
  error_message: string | null;
}

interface DiseaseAnalysisRequest {
  crop_type: string;
  symptoms_text: string;
  location: string;
  crop_id: string;
  create_logs_and_todos: boolean;
  image: File;
}

class DiseaseApiService {
  async analyzeDisease(request: DiseaseAnalysisRequest): Promise<DiseaseAnalysisResponse> {
    try {
      const formData = new FormData();
      formData.append('crop_type', request.crop_type);
      formData.append('symptoms_text', request.symptoms_text);
      formData.append('location', request.location);
      formData.append('crop_id', request.crop_id);
      formData.append('create_logs_and_todos', request.create_logs_and_todos.toString());
      formData.append('image', request.image);

      const response = await fetch(`${API_BASE_URL}/api/disease-research/analyze-with-image`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${authService.getToken()}`,
        },
        body: formData,
      });

      if (response.status === 401) {
        authService.logout();
        throw new Error('Authentication required');
      }

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Disease analysis failed: ${error}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to analyze disease:', error);
      throw error;
    }
  }
}

export const diseaseApi = new DiseaseApiService();
export type { 
  DiseaseAnalysisRequest, 
  DiseaseAnalysisResponse, 
  DiseaseAnalysisReport,
  TreatmentOption,
  PreventionStrategy,
  DiseaseIdentification,
  YieldImpact
};