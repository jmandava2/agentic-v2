import { authService } from './auth';

const API_BASE_URL = 'https://ktz54m33-8000.inc1.devtunnels.ms';

interface Scheme {
  title: string;
  description: string;
  scheme_link: string;
  department: string;
  eligibility: string;
  benefits: string;
  application_process?: string;
  target_beneficiaries: string;
  state_or_central: string;
}

interface SchemeSearchResponse {
  status: string;
  query: string;
  total_schemes: number;
  schemes: Scheme[];
  search_metadata: {
    exa_results: number;
    structured_results: number;
    enhanced_query: string;
  };
}

interface SchemeSearchRequest {
  query: string;
  max_results: number;
}

class SchemesApiService {
  private async makeAuthenticatedRequest(endpoint: string, options: RequestInit = {}) {
    const headers = {
      ...authService.getAuthHeaders(),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      authService.logout();
      throw new Error('Authentication required');
    }

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${error}`);
    }

    return response.json();
  }

  async searchSchemes(request: SchemeSearchRequest): Promise<SchemeSearchResponse> {
    try {
      return await this.makeAuthenticatedRequest('/schemes/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
    } catch (error) {
      console.error('Failed to search schemes:', error);
      throw error;
    }
  }

  async getRecommendedSchemes(crops: any[]): Promise<SchemeSearchResponse> {
    try {
      // Generate query based on farmer's crops
      const cropNames = crops.map(crop => crop.crop_name || crop.current_crop).filter(Boolean);
      const uniqueCrops = [...new Set(cropNames)];
      
      let query = '';
      if (uniqueCrops.length > 0) {
        query = `government schemes subsidies for ${uniqueCrops.join(', ')} farming agriculture`;
      } else {
        query = 'government schemes subsidies for farmers agriculture';
      }

      return await this.searchSchemes({
        query,
        max_results: 10,
      });
    } catch (error) {
      console.error('Failed to get recommended schemes:', error);
      throw error;
    }
  }
}

export const schemesApi = new SchemesApiService();
export type { Scheme, SchemeSearchResponse, SchemeSearchRequest };