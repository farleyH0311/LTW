import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class VertexService {
  private apiKey = process.env.GEMINI_API_KEY;
  private endpoint = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent`;

  async ask(prompt: string): Promise<string> {
    try {
      const res = await axios.post(
        `${this.endpoint}?key=${this.apiKey}`,
        {
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }],
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = res.data as any;
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Không có phản hồi.';
    } catch (e) {
      console.error('Gemini API error:', e.response?.data || e.message);
      return 'Lỗi khi gọi Gemini API.';
    }
  }
}
