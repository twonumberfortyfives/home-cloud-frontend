import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouterOutlet, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { provideHttpClient } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { FileListComponent } from './components/file-list/file-list.component';
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

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`
})
class App {}

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent},
  { path: 'files', component: FileListComponent}
];


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


bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
  ]
})
  .catch((err) => console.error(err));
