import { FileDto } from "./file-item";

export interface FileListDto {
  path: string;
  items: FileDto[];
}