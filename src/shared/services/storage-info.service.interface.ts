import { StorageInfoDto, StorageUsageDto } from "../../dtos/storage-usage";

export interface IStorageInfoService {
    getStorageInfo(): Promise<[StorageUsageDto, StorageInfoDto]>;
}