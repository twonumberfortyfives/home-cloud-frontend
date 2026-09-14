import { ElementRef, Injectable, viewChild } from "@angular/core";
import { Chart } from "chart.js";
import { StorageUsagePointDto } from "../../dtos/storage-usage";

@Injectable(
    {providedIn: 'root'}
)
export class ChartService {
    private readonly USED_COLOR: string = '#222';
    private readonly FREE_COLOR: string = '#e5e5e5';

    public readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('storageChart');
    public readonly donutCanvas = viewChild.required<ElementRef<HTMLCanvasElement>>('storageDonut');

    public chart: Chart | null = null;
    public donut: Chart | null = null;

    public renderDonut(used: number, available: number): void {
        this.donut?.destroy();

        this.donut = new Chart(this.donutCanvas().nativeElement, {
            type: 'doughnut',
            data: {
                labels: ['Использовано', 'Доступно'],
                datasets: [{
                    data: [used, available],
                    backgroundColor: [this.USED_COLOR, this.FREE_COLOR],
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
    
    public renderChart(points: StorageUsagePointDto[], totalSpace: number): void {
        this.chart?.destroy();

        this.chart = new Chart(this.canvas().nativeElement, {
            type: 'line',
            data: {
                labels: points.map((point): string => new Date(point.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })),
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
}