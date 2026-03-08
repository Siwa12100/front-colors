export interface Workspace {
  id: number;
  userId: number;
  name: string;
  isSystem: boolean;
  favorites: number[];
  sources: number[];
}
