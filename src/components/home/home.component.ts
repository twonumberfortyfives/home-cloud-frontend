import { Component, ElementRef, inject, OnDestroy, OnInit, signal, viewChild } from "@angular/core";
import { NavbarComponent } from "../../shared/components/navbar/navbar.component";
import { StorageInfoService } from "../../shared/services/storage-info.service";
import { ChartService } from "../../shared/services/chart.service";

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [NavbarComponent],
    providers: [StorageInfoService],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
    private readonly _storageInfoService: StorageInfoService = inject(StorageInfoService);
    private readonly _chartService: ChartService = inject(ChartService);

    public readonly chartCanvas = viewChild.required<ElementRef<HTMLCanvasElement>>('storageChart');
    public readonly donutCanvas = viewChild.required<ElementRef<HTMLCanvasElement>>('storageDonut');

    public readonly fileCount = signal<number>(0);
    public readonly usedSpace = signal<number>(0);
    public readonly availableSpace = signal<number>(0);
    public readonly totalSpace = signal<number>(0);
    public readonly usedPercent = signal<number>(0);
    
    public async ngOnInit(): Promise<void> {
        const [storageUsage, storageInfo] = await this._storageInfoService.getStorageInfo();
        
        this.usedPercent.set(Math.round((storageInfo.usedSpace / storageInfo.totalSpace) * 100))
        this.fileCount.set(storageInfo.fileCount);
        this.availableSpace.set(storageInfo.availableSpace);
        this.usedSpace.set(storageInfo.usedSpace);
        this.totalSpace.set(storageInfo.totalSpace);

        this._chartService.renderChart(this.chartCanvas().nativeElement, storageUsage.points, storageUsage.totalSpace);
        this._chartService.renderDonut(this.donutCanvas().nativeElement, storageInfo.usedSpace, storageInfo.availableSpace);
    }

    public async ngOnDestroy(): Promise<void> {
        this._chartService.chart?.destroy();
        this._chartService.donut?.destroy();
    }
}
