// src/lib/api/contacts.api.ts
//
// Pure API methods & TanStack Query mutations for Citizen Contact submissions.

import { useMutation } from '@tanstack/react-query';
import { api } from './config/axios-client';
import { ApiResponse, ContactSubmission } from '@/types/api.types';

export interface ContactCreatePayload {
  sender_name: string;
  sender_email: string;
  phone?: string | null;
  subject: string;
  message: string;
}

export async function submitContactForm(payload: ContactCreatePayload): Promise<ContactSubmission> {
  const { data } = await api.post<ApiResponse<ContactSubmission>>('/contacts', payload);
  return data.data;
}

export function useSubmitContact() {
  return useMutation({
    mutationFn: submitContactForm,
  });
}
