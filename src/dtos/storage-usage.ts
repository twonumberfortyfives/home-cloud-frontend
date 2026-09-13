export interface StorageUsagePointDto {
  date: string;
  usedSpace: number;
}

export interface StorageUsageDto {
  totalSpace: number;
  points: StorageUsagePointDto[];
}

export interface StorageInfoDto {
  availableSpace: number;
  usedSpace: number;
  totalSpace: number;
  fileCount: number;
}