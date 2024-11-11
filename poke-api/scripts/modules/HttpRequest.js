import axios from "axios";

export class HttpRequest {
  constructor(baseURL) {
    this.client = axios.create({
      baseURL: baseURL,
    });
  }

  async get(endpoint) {
    try {
      const response = await this.client.get(endpoint);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error.message}`);
    }
  }
}
