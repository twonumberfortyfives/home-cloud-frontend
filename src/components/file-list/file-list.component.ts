import { Component } from '@angular/core';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

@Component({
  selector: 'app-file-list',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './file-list.component.html',
  styleUrl: './file-list.component.css'
})
export class FileListComponent {
    
}