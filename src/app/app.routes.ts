import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

const DetailsComponent = () => import('./pages/details/details.component').then(c => c.DetailsComponent);

export const routes: Routes = [
	{ 
		path: '', 
		pathMatch: 'full', 
		component: HomeComponent, 
		title: 'CRUD' 
	},
	{ 
		path: 'novo',
		loadComponent: DetailsComponent, 
		title: 'Cadastrar pessoa'
	},
	{ 
		path: 'editar/:id', 
		loadComponent: DetailsComponent,
		title: 'Editar cadastro' 
	}
];
