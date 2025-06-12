// ✅ File: vertex.service.ts
import { Injectable } from '@nestjs/common';
import { GoogleAuth } from 'google-auth-library';
import axios from 'axios';

@Injectable()
export class VertexService {
  private projectId = process.env.GCP_PROJECT_ID;
  private location = 'us-central1';
  private model = 'gemini-1.5-pro';
  private apiEndpoint = `https://us-central1-aiplatform.googleapis.com/v1/projects/${process.env.GCP_PROJECT_ID}/locations/us-central1/publishers/google/models/${this.model}:streamGenerateContent`;

  private authClient = new GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });

  async ask(prompt: string): Promise<string> {
    const client = await this.authClient.getClient();
    const token = await client.getAccessToken();

    const res = await axios.post(
      this.apiEndpoint,
      {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token.token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = res.data as any;
    const candidates = data.candidates || [];
    return candidates[0]?.content?.parts?.[0]?.text || 'Không có phản hồi.';
  }
}
