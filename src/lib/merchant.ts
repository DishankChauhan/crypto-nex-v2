import { logError, logEvent } from './monitoring';

export interface MerchantConfig {
  apiKey: string;
  webhookUrl?: string;
  redirectUrl?: string;
}

class MerchantAPI {
  private apiKey: string;
  private baseUrl: string;

  constructor(config: MerchantConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = import.meta.env.PROD 
      ? 'https://api.cryptonex.com/v1'
      : 'http://localhost:3000/v1';
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      logError(error as Error, { endpoint });
      throw error;
    }
  }

  async createPayment(data: {
    amount: string;
    currency: string;
    description: string;
    metadata?: Record<string, any>;
  }) {
    const result = await this.request('/payments', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    logEvent('payment.created', { amount: data.amount, currency: data.currency });
    return result;
  }

  async getPayment(id: string) {
    return await this.request(`/payments/${id}`);
  }

  async listPayments(params: { limit?: number; offset?: number } = {}) {
    const queryParams = new URLSearchParams(params as Record<string, string>);
    return await this.request(`/payments?${queryParams}`);
  }

  async verifyWebhookSignature(payload: any, signature: string): Promise<boolean> {
    try {
      const result = await this.request('/webhooks/verify', {
        method: 'POST',
        body: JSON.stringify({ payload, signature }),
      });
      return result.valid;
    } catch (error) {
      logError(error as Error, { context: 'webhook-verification' });
      return false;
    }
  }
}