export interface Case {
  id: string;
  user_id: string;
  title: string;
  description: string;
  status: boolean;
  created_at: string;
  updated_at: string;
}

export type Document = {
  id: number;
  title: string;
  file_path: string;
  file_type: string;
};