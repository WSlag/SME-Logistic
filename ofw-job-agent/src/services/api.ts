import axios from 'axios';
import type { Job, Application, Conversation, Message } from '../types/models';

const api = axios.create({ baseURL: 'https://example.mock/api' });

export const JobService = {
  async listJobs(): Promise<Job[]> {
    return [
      { id: '1', title: 'Registered Nurse', agencyId: 'a1', location: 'Riyadh', country: 'Saudi Arabia', salary: 'SAR 3,500/mo', description: 'Provide nursing care in a hospital setting.', requirements: ['PRC License', '2+ yrs experience'], createdAt: new Date().toISOString() },
      { id: '2', title: 'Household Service Worker', agencyId: 'a2', location: 'Dubai', country: 'UAE', salary: 'AED 1,650/mo', description: 'Assist with household chores and childcare.', createdAt: new Date().toISOString() }
    ];
  },
  async getJob(id: string): Promise<Job | undefined> {
    const all = await this.listJobs();
    return all.find(j => j.id === id);
  }
};

export const ApplicationService = {
  async apply(jobId: string, userId: string): Promise<Application> {
    return { id: Math.random().toString(36).slice(2), jobId, userId, status: 'applied', createdAt: new Date().toISOString() };
  }
};

export const ChatService = {
  async listConversations(): Promise<Conversation[]> {
    return [{ id: 'c1', participantIds: ['u1', 'agency1'], lastMessageAt: new Date().toISOString() }];
  },
  async listMessages(conversationId: string): Promise<Message[]> {
    return [
      { id: 'm1', conversationId, senderId: 'agency1', text: 'Hello! How can we help?', createdAt: new Date().toISOString() },
      { id: 'm2', conversationId, senderId: 'u1', text: 'I want to know more about the job.', createdAt: new Date().toISOString() }
    ];
  }
};
