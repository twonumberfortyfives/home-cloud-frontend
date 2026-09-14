import { inject, Injectable } from "@angular/core";
import { StorageInfoDto, StorageUsageDto } from "../../dtos/storage-usage";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";

@Injectable(
    {providedIn: 'root'}
)
export class StorageInfoService {
    private readonly apiUrl: string = 'http://localhost:3000';
    private readonly httpClient: HttpClient = inject(HttpClient);

    public async getStorageInfo(): Promise<[StorageUsageDto, StorageInfoDto]> {
        return Promise.all([
            firstValueFrom(this.httpClient.get<StorageUsageDto>(`${this.apiUrl}/storage-usage`)),
            firstValueFrom(this.httpClient.get<StorageInfoDto>(`${this.apiUrl}/storage-info`)),
        ]);
    }
}