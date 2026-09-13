import { Component, ElementRef, inject, OnDestroy, OnInit, Signal, signal, viewChild } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import {
    ArcElement,
    Chart,
    DoughnutController,
    Filler,
    LineController,
    LineElement,
    LinearScale,
    PointElement,
    CategoryScale,
    Tooltip
} from "chart.js";
import { NavbarComponent } from "../../shared/navbar/navbar.component";
import { StorageInfoDto, StorageUsageDto, StorageUsagePointDto } from "../../dtos/storage-usage";

Chart.register(
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    DoughnutController,
    ArcElement,
    Filler,
    Tooltip
);

const CHART_DAYS: number = 30;

const USED_COLOR: string = '#222';
const FREE_COLOR: string = '#e5e5e5';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [NavbarComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
    private readonly apiUrl: string = 'http://localhost:3000';
    private readonly httpClient: HttpClient = inject(HttpClient);
    
    public readonly fileCount = signal<number>(0);
    public readonly usedSpace = signal<number>(0);
    public readonly availableSpace = signal<number>(0);
    public readonly usedPercent = signal<number>(0);

    private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('storageChart');
    private readonly donutCanvas = viewChild.required<ElementRef<HTMLCanvasElement>>('storageDonut');

    private chart: Chart | null = null;
    private donut: Chart | null = null;

    public async ngOnInit(): Promise<void> {
        const [storageUsage, storageInfo] = await this.getStorageInfo();
        
        this.usedPercent.set(Math.round((storageInfo.usedSpace / storageInfo.totalSpace) * 100))
        this.fileCount.set(storageInfo.fileCount);
        this.availableSpace.set(storageInfo.availableSpace);
        this.usedSpace.set(storageInfo.usedSpace);

        this.renderChart(storageUsage.points, storageUsage.totalSpace);
        this.renderDonut(storageInfo.usedSpace, storageInfo.availableSpace);    
    }

    public async ngOnDestroy(): Promise<void> {
        this.chart?.destroy();
        this.donut?.destroy();
    }

    private async getStorageInfo(): Promise<[StorageUsageDto, StorageInfoDto]> {
        return Promise.all([
            firstValueFrom(this.httpClient.get<StorageUsageDto>(`${this.apiUrl}/storage-usage`)),
            firstValueFrom(this.httpClient.get<StorageInfoDto>(`${this.apiUrl}/storage-info`)),
        ]);
    }

    private renderDonut(used: number, available: number): void {
        this.donut?.destroy();

        this.donut = new Chart(this.donutCanvas().nativeElement, {
            type: 'doughnut',
            data: {
                labels: ['Использовано', 'Доступно'],
                datasets: [{
                    data: [used, available],
                    backgroundColor: [USED_COLOR, FREE_COLOR],
                    borderWidth: 0,
                    hoverOffset: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '72%',
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        displayColors: false,
                        callbacks: {
                            label: (item): string => `${item.parsed} GB`
                        }
                    }
                }
            }
        });
    }

    private renderChart(points: StorageUsagePointDto[], totalSpace: number): void {
        this.chart?.destroy();

        this.chart = new Chart(this.canvas().nativeElement, {
            type: 'line',
            data: {
                labels: points.map((point): string => this.formatDate(point.date)),
                datasets: [{
                    data: points.map((point): number => point.usedSpace),
                    borderColor: '#222',
                    borderWidth: 2,
                    backgroundColor: 'rgba(34, 34, 34, 0.08)',
                    fill: true,
                    tension: 0.3,
                    pointRadius: 0,
                    pointHoverRadius: 4,
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#222'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        displayColors: false,
                        callbacks: {
                            label: (item): string => `${item.parsed.y} GB`
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        border: { display: false },
                        ticks: {
                            color: '#999',
                            font: { size: 12 },
                            maxRotation: 0,
                            autoSkipPadding: 24
                        }
                    },
                    y: {
                        min: 0,
                        max: totalSpace,
                        grid: { color: '#e5e5e5' },
                        border: { display: false },
                        ticks: {
                            color: '#999',
                            font: { size: 12 },
                            stepSize: totalSpace / 4,
                            callback: (value): string => `${value} GB`
                        }
                    }
                }
            }
        });
    }

    private formatDate(date: string): string {
        return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    }

    public getTotalAmountOfFiles(): void {

    }
}
