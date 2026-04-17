export interface Prompt {
  id: string;
  title: string;
  content: string;
  complexity: number;
  created_at: string;
  view_count?: number;
}

export interface CreatePromptDto {
  title: string;
  content: string;
  complexity: number;
}
