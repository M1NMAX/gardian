import { getFetch } from '@lib/fetch';
import { Template } from '@prisma/client';

const baseUrl = process.env.NEXT_PUBLIC_API_URL + '/templates/';

export async function getTemplates(): Promise<Template[]> {
  const res = await getFetch(baseUrl);
  return res;
}

export async function getTemplate(tid: string): Promise<Template> {
  const res = await getFetch(baseUrl + tid);
  return res;
}
