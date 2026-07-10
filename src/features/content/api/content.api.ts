import { apiClient } from '../../../api/client';

export interface DocumentData {
  _id?: string;
  title: string;
  category: string;
  contentType: string;
  editorMode: 'markdown' | 'rich-text';
  generatedContent: string;
  status?: 'draft' | 'published' | 'archived';
  tags?: string[];
  wordCount?: number;
  readingTime?: number;
  aiProvider?: string;
  isFavorite?: boolean;
  collectionId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CollectionData {
  _id?: string;
  name: string;
  description: string;
  visibility: 'private' | 'public';
  createdAt?: string;
  updatedAt?: string;
}

export interface SearchParams {
  search?: string;
  category?: string;
  contentType?: string;
  status?: 'draft' | 'published' | 'archived';
  isFavorite?: boolean;
  collectionId?: string;
  tag?: string;
  limit?: number;
  skip?: number;
}

export const contentApi = {
  getDocuments: async (params?: SearchParams) => {
    const res = await apiClient.get<{ success: boolean; data: DocumentData[]; total: number }>('/content', { params });
    return res.data;
  },

  getDocument: async (id: string) => {
    const res = await apiClient.get<{ success: boolean; data: DocumentData }>(`/content/${id}`);
    return res.data;
  },

  createDocument: async (data: Partial<DocumentData>) => {
    const res = await apiClient.post<{ success: boolean; data: DocumentData }>('/content', data);
    return res.data;
  },

  updateDocument: async (id: string, data: Partial<DocumentData>) => {
    const res = await apiClient.put<{ success: boolean; data: DocumentData }>(`/content/${id}`, data);
    return res.data;
  },

  deleteDocument: async (id: string) => {
    const res = await apiClient.delete<{ success: boolean; message: string }>(`/content/${id}`);
    return res.data;
  },

  generate: async (data: { templateId: string; providerId: string; variables: Record<string, string> }) => {
    const res = await apiClient.post<{ success: boolean; data: { text: string; templateName: string; contentType: string; category: string } }>('/content/generate', data);
    return res.data;
  },

  getTemplates: async () => {
    const res = await apiClient.get<{ success: boolean; data: any[] }>('/content/templates');
    return res.data;
  },

  getVersions: async (id: string) => {
    const res = await apiClient.get<{ success: boolean; data: any[] }>(`/content/${id}/versions`);
    return res.data;
  },

  restoreVersion: async (id: string, versionNumber: number) => {
    const res = await apiClient.post<{ success: boolean; data: DocumentData }>(`/content/${id}/restore`, { versionNumber });
    return res.data;
  },

  getCollections: async () => {
    const res = await apiClient.get<{ success: boolean; data: CollectionData[] }>('/collections');
    return res.data;
  },

  createCollection: async (data: Partial<CollectionData>) => {
    const res = await apiClient.post<{ success: boolean; data: CollectionData }>('/collections', data);
    return res.data;
  },

  updateCollection: async (id: string, data: Partial<CollectionData>) => {
    const res = await apiClient.put<{ success: boolean; data: CollectionData }>(`/collections/${id}`, data);
    return res.data;
  },

  deleteCollection: async (id: string) => {
    const res = await apiClient.delete<{ success: boolean; message: string }>(`/collections/${id}`);
    return res.data;
  },
};
