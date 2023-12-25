import { Component, HostBinding, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import moment from 'moment';
import { Person } from '../../models/person';
import { CpfPipe } from '../../pipes/cpf.pipe';
import { Router } from '@angular/router';
import { PeopleService } from '../../services/people.service';
import { LoaderService } from '../../services/loader.service';
import { MessageService, MessageType } from '../../services/message.service';

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [CommonModule, CpfPipe],
	templateUrl: './home.component.html',
	styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
	private router = inject(Router);
	private peopleService = inject(PeopleService);
	private loaderService = inject(LoaderService);
	private messageService = inject(MessageService);

	peopleData = signal<Person[]>([]);

	ngOnInit(): void {
		this.loaderService.setLoading(true);
		this.peopleService.getPeople().subscribe({
			next: people => {
				this.peopleData.set(people);
				this.loaderService.setLoading(false);
			},
			error: () => {
				this.messageService.sendMessage('Ocorreu um erro ao carregar os dados', MessageType.Error);
				this.loaderService.setLoading(false);
			}
		});
	}

	goToEditPage(id: number): void {
		this.router.navigateByUrl(`/editar/${id}`);
	}

	goToNewPage(): void {
		this.router.navigateByUrl('/novo');
	}
}
