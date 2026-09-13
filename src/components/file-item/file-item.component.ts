import { Component, input, output } from '@angular/core';
import { FileDto } from '../../dtos/file-item';

@Component({
  selector: 'app-file-item',
  standalone: true,
  templateUrl: './file-item.component.html',
  styleUrl: './file-item.component.css'
})
export class FileItemComponent {

  file = input.required<FileDto>();
  download = output<FileDto>();
  delete = output<FileDto>();
}