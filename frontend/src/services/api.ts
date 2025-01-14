import axios from 'axios';
import { TimerData, AnimationData } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://of-assigned-lip-neighbors.trycloudflare.com';

// @ts-ignore
const TG = window.Telegram.WebApp;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, // 5 second timeout
});

const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      throw new Error('Unable to reach the server. Please check your connection and try again.');
    }
    throw new Error(error.response.data?.message || 'An error occurred while fetching data');
  }
  throw error;
};

export const getTimerData = async (): Promise<TimerData> => {
  try {
    const { data } = await api.get<TimerData>('/api/timer');
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getAnimationData = async (): Promise<AnimationData> => {
  try {
    const { data } = await api.get<AnimationData>('/api/animation');
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const triggerExplore = async (): Promise<void> => {
  try {
    await api.post('/api/explore');
  } catch (error) {
    throw handleApiError(error);
  }
};

export { TG };