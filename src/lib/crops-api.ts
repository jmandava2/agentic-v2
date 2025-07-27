import { authService } from './auth';

const API_BASE_URL = 'http://localhost:8000';

interface Crop {
  id: number;
  user_id: number;
  crop_name: string;
  crop_code: string;
  latitude: number;
  longitude: number;
  address: string;
  village: string;
  district: string;
  state: string;
  total_area_acres: number;
  cultivable_area_acres: number;
  soil_type: string;
  water_source: string;
  irrigation_type: string;
  current_crop: string;
  crop_variety: string;
  planting_date: string;
  expected_harvest_date: string;
  crop_stage: string;
  crop_health_score: number;
  previous_crops?: string;
  average_yield?: number;
  created_at: string;
  updated_at: string;
}

class CropsApiService {
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
      // Token expired or invalid, redirect to login
      authService.logout();
      throw new Error('Authentication required');
    }

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${error}`);
    }

    return response.json();
  }

  async getCrops(): Promise<Crop[]> {
    try {
      return await this.makeAuthenticatedRequest('/crops/');
    } catch (error) {
      console.error('Failed to fetch crops:', error);
      throw error;
    }
  }

  async getCrop(id: string): Promise<Crop> {
    try {
      return await this.makeAuthenticatedRequest(`/crops/${id}`);
    } catch (error) {
      console.error(`Failed to fetch crop ${id}:`, error);
      throw error;
    }
  }

  async createCrop(crop: {
    crop_name: string;
    latitude: number;
    longitude: number;
    address: string;
    village: string;
    district: string;
    state: string;
    total_area_acres: number;
    cultivable_area_acres: number;
    soil_type: string;
    water_source: string;
    irrigation_type: string;
    current_crop: string;
    crop_variety: string;
    planting_date: string;
    expected_harvest_date: string;
    crop_stage: string;
  }): Promise<Crop> {
    try {
      return await this.makeAuthenticatedRequest('/crops/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(crop),
      });
    } catch (error) {
      console.error('Failed to create crop:', error);
      throw error;
    }
  }

  async updateCrop(id: string, crop: Partial<Crop>): Promise<Crop> {
    try {
      return await this.makeAuthenticatedRequest(`/crops/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(crop),
      });
    } catch (error) {
      console.error(`Failed to update crop ${id}:`, error);
      throw error;
    }
  }

  async deleteCrop(id: string): Promise<void> {
    try {
      await this.makeAuthenticatedRequest(`/crops/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error(`Failed to delete crop ${id}:`, error);
      throw error;
    }
  }
}

export const cropsApi = new CropsApiService();
export type { Crop };