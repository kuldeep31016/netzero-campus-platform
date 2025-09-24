// TODO: Re-enable when Firebase is properly configured
// import { auth } from './firebase';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  private async getAuthToken(): Promise<string | null> {
    // TODO: Replace with actual Firebase auth token
    // if (auth.currentUser) {
    //   return await auth.currentUser.getIdToken();
    // }
    return 'mock-auth-token';
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getAuthToken();
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth methods
  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async updateProfile(data: any) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Dashboard methods
  async getDashboardStats(dateRange = '7d') {
    return this.request(`/dashboard/stats?range=${dateRange}`);
  }

  async getDashboardChartData(dateRange = '7d', metric = 'energy') {
    return this.request(`/dashboard/chart?range=${dateRange}&metric=${metric}`);
  }

  // Energy methods
  async getEnergyData(filters: any = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/energy?${queryParams}`);
  }

  async addEnergyReading(data: any) {
    return this.request('/energy', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateEnergyReading(id: string, data: any) {
    return this.request(`/energy/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteEnergyReading(id: string) {
    return this.request(`/energy/${id}`, {
      method: 'DELETE',
    });
  }

  // Water methods
  async getWaterData(filters: any = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/water?${queryParams}`);
  }

  async addWaterReading(data: any) {
    return this.request('/water', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Waste methods
  async getWasteData(filters: any = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/waste?${queryParams}`);
  }

  async addWasteReading(data: any) {
    return this.request('/waste', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Mobility methods
  async getMobilityData(filters: any = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/mobility?${queryParams}`);
  }

  async addMobilityReading(data: any) {
    return this.request('/mobility', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Gamification methods
  async getChallenges() {
    return this.request('/gamification/challenges');
  }

  async getUserBadges() {
    return this.request('/gamification/badges');
  }

  async joinChallenge(challengeId: string) {
    return this.request(`/gamification/challenges/${challengeId}/join`, {
      method: 'POST',
    });
  }

  async getLeaderboard() {
    return this.request('/gamification/leaderboard');
  }

  // AI recommendations
  async getRecommendations() {
    return this.request('/ai/recommendations');
  }

  // Admin methods
  async getAllUsers() {
    return this.request('/admin/users');
  }

  async updateUserRole(userId: string, role: string) {
    return this.request(`/admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  }

  async getSystemStats() {
    return this.request('/admin/stats');
  }

  async exportData(type: string, dateRange: string) {
    return this.request(`/admin/export/${type}?range=${dateRange}`);
  }
}

export default new ApiService();