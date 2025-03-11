import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    const response = await fetch('https://api.chatpdf.com/v1/chats/message', {
      method: 'POST',
      headers: {
          "Content-Type": "application/json",
          "x-api-key": "sec_mrzfCVztWdht3qHwMiRgGHr4f18ZVlFG" // Replace with your API key
      },
      body: JSON.stringify({
          sourceId: "cha_wESuoY0WgcVnxbvriIyfC",
          messages: [{role: "user", content: message}]
      }),
    });
  

    if (!response.ok) {
      throw new Error(`ChatPDF API error: ${response.statusText}`);
    }

    const data = await response.json();

    res.status(200).json({ response: data.content || 'No response' });
  } catch (error) {
    console.error('ChatPDF API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
