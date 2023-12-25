import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DetailsComponent } from './pages/details/details.component';

export const routes: Routes = [
	{ path: '', pathMatch: 'full', component: HomeComponent, title: 'CRUD' },
	{ path: 'novo', component: DetailsComponent, title: 'Cadastrar pessoa' },
	{ path: 'editar/:id', component: DetailsComponent, title: 'Editar cadastro' }
];
