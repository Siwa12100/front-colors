export interface FolderDto {
  id: number;
  name: string;
  workspace_id: number;
  parent_folder_id: number | null;
  pictures: number[];
}
