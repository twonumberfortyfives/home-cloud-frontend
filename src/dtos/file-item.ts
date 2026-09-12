export interface FileDto {
  id: string;
  name: string;
  path: string;
  size: number;
  mimeType: string | null;
  modifiedAt: string;
  modifiedBy: string;
  createdAt: string;
}