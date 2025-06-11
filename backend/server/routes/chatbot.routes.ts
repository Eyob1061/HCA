import express, { Request, Response, NextFunction } from 'express';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.js';
import axios, { AxiosError } from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Interface for chat message
interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Interface for request body
interface ChatRequest {
  message: string;
  conversationHistory: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
}

// Extend the Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
        [key: string]: any;
      };
    }
  }
}

const router = express.Router();

// Chat with AI
router.post('/chat', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { message, conversationHistory = [] } = req.body;
    const user = req.user; // This comes from the authenticate middleware
    
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'Chat service is not properly configured.'
      });
    }

    // Prepare the conversation history for the AI
    const messages = [
      {
        role: 'system',
        content: `You are a helpful health assistant. Provide accurate health information but always remind users to consult with a healthcare professional for medical advice.`
      },
      ...conversationHistory.slice(-4), // Keep last 4 messages for context
      { role: 'user', content: message }
    ];

    // Call OpenAI API
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0.7,
        max_tokens: 500
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );

    const aiResponse = response.data.choices[0].message.content;
    
    res.json({
      success: true,
      message: aiResponse
    });
  } catch (err) {
    const error = err as Error | AxiosError;
    console.error('Chatbot error:', error.message || 'Unknown error');
    
    let statusCode = 500;
    let errorMessage = 'An unknown error occurred';
    
    if (axios.isAxiosError(error)) {
      statusCode = error.response?.status || 500;
      errorMessage = error.response?.data?.error?.message || error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    res.status(statusCode).json({
      success: false,
      message: 'Error processing your request',
      error: errorMessage
    });
  }
});

export default router;
