import { Component, Signal, signal } from "@angular/core";
import { NavbarComponent } from "../../shared/navbar/navbar.component";

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [NavbarComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent {
    public storageUsed: Signal<number> = signal(0);
    public totalStorage: Signal<number> = signal(0);
    public availableStorage: Signal<number> = signal(0); 
    public fileCount: Signal<number> = signal(0);

    public getAvailableStorageValue(): void {
        
    }

    public getTotalStorageStorageValue(): void {

    }

    public getTotalAmountOfFiles(): void {
        
    }
}
