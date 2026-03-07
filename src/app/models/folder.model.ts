export interface Folder {
  id: number;
  name: string;
  workspaceId: number;
  parentFolderId: number | null;
  pictureIds: number[];
}
