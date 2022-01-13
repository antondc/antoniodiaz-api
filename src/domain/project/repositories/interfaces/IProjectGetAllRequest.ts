export interface IProjectGetAllRequest {
  sessionId: string;
  language: string;
  sort?: 'order' | '-order' | 'createdAt' | '-createdAt' | 'updatedAt' | '-updatedAt';
  size?: number;
  offset?: number;
  filter?: {
    tags?: string[];
  };
}
