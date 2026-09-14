import { Component, inject, OnInit, signal } from '@angular/core';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FileItemComponent } from '../file-item/file-item.component';
import { FileDto } from '../../dtos/file-item';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, take } from 'rxjs';

@Component({
  selector: 'app-file-list',
  standalone: true,
  imports: [NavbarComponent, FileItemComponent],
  templateUrl: './file-list.component.html',
  styleUrl: './file-list.component.css'
})
export class FileListComponent implements OnInit {
  public readonly files = signal<FileDto[]>([]);
  public readonly isLoading = signal<boolean>(false);
  public readonly error = signal<string | null>(null);
  
  private readonly httpClient = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000';
  
  async ngOnInit(): Promise<void> {
    await this.getAllFiles();
  }

  public async getAllFiles(): Promise<void> {
    const files = await firstValueFrom(
      this.httpClient.get<FileDto[]>(`${this.apiUrl}/files`)
    );

    this.files.set(files);
  }

  public async onDownload(file: FileDto): Promise<void> {}

  public async onDelete(file: FileDto): Promise<void> {}

  public async onUpload(): Promise<void> {}

  public async onCreateFolder(): Promise<void> {}
}