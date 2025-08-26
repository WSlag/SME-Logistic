export type User = { id: string; fullName: string; email: string; phone?: string; avatarUrl?: string; role: 'jobseeker' | 'agency'; createdAt: string; };

export type Agency = { id: string; name: string; logoUrl?: string; description?: string; location?: string; createdAt: string; };

export type Job = { id: string; title: string; agencyId: string; location: string; country: string; salary?: string; description: string; requirements?: string[]; createdAt: string; };

export type Application = { id: string; jobId: string; userId: string; status: 'applied' | 'review' | 'interview' | 'offer' | 'rejected'; createdAt: string; };

export type Conversation = { id: string; participantIds: string[]; lastMessageAt?: string; };

export type Message = { id: string; conversationId: string; senderId: string; text: string; createdAt: string; };

export type Rating = { id: string; agencyId: string; userId: string; score: number; comment?: string; createdAt: string; };
