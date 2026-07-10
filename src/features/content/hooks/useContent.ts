import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contentApi, SearchParams, DocumentData, CollectionData } from '../api/content.api';

export const useDocuments = (params?: SearchParams) => {
  return useQuery({
    queryKey: ['documents', params],
    queryFn: () => contentApi.getDocuments(params),
  });
};

export const useDocument = (id: string | null) => {
  return useQuery({
    queryKey: ['document', id],
    queryFn: () => contentApi.getDocument(id!),
    enabled: !!id,
  });
};

export const useCreateDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<DocumentData>) => contentApi.createDocument(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
};

export const useUpdateDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DocumentData> }) =>
      contentApi.updateDocument(id, data),
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['document', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['versions', variables.id] });
    },
  });
};

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => contentApi.deleteDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
};

export const useGenerateContent = () => {
  return useMutation({
    mutationFn: (data: { templateId: string; providerId: string; variables: Record<string, string> }) =>
      contentApi.generate(data),
  });
};

export const useTemplates = () => {
  return useQuery({
    queryKey: ['templates'],
    queryFn: () => contentApi.getTemplates(),
  });
};

export const useVersions = (id: string | null) => {
  return useQuery({
    queryKey: ['versions', id],
    queryFn: () => contentApi.getVersions(id!),
    enabled: !!id,
  });
};

export const useRestoreVersion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, versionNumber }: { id: string; versionNumber: number }) =>
      contentApi.restoreVersion(id, versionNumber),
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['document', variables.id] });
    },
  });
};

export const useCollections = () => {
  return useQuery({
    queryKey: ['collections'],
    queryFn: () => contentApi.getCollections(),
  });
};

export const useCreateCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<CollectionData>) => contentApi.createCollection(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
    },
  });
};

export const useUpdateCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CollectionData> }) =>
      contentApi.updateCollection(id, data),
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      queryClient.invalidateQueries({ queryKey: ['collections', variables.id] });
    },
  });
};

export const useDeleteCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => contentApi.deleteCollection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      queryClient.invalidateQueries({ queryKey: ['documents'] }); // unlinked items
    },
  });
};
