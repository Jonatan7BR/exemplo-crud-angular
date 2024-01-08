import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { validateCpf, validatePhone } from '../../utils/validators';
import { PersonBody } from '../../models/person';
import { STATES } from '../../utils/states';
import { PeopleService } from '../../services/people.service';
import { LoaderService } from '../../services/loader.service';
import { MessageService, MessageType } from '../../services/message.service';
import { ConfirmModalComponent } from '../../components/confirm-modal/confirm-modal.component';

@Component({
	selector: 'app-details',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, ConfirmModalComponent],
	templateUrl: './details.component.html',
	styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit {
	private activatedRoute = inject(ActivatedRoute);
	private formBuilder = inject(FormBuilder);
	private router = inject(Router);
	private peopleService = inject(PeopleService);
	private loaderService = inject(LoaderService);
	private messageService = inject(MessageService);

	private id = signal('');

	deleteModalVisible = signal(false);

	title = computed(() => (this.id() ? 'Editar cadastro' : 'Cadastrar pessoa'));
	buttonLabel = computed(() => (this.id() ? 'Atualizar' : 'Cadastrar'));
	deletable = computed(() => !!this.id());

	form!: FormGroup;

	readonly states = STATES.sort((a, b) => a.name.localeCompare(b.name));
	readonly deleteModalText = signal('Deseja excluir este cadastro?');

	ngOnInit(): void {
		this.form = this.formBuilder.group({
			name: new FormControl<string>('', Validators.required),
			cpf: new FormControl<string>('', [Validators.required, validateCpf]),
			birthday: new FormControl<string>('', Validators.required),
			email: new FormControl<string>('', [Validators.required, Validators.email]),
			phone: new FormControl<string>('', [Validators.required, validatePhone]),
			city: new FormControl<string>('', Validators.required),
			state: new FormControl<string>('', Validators.required)
		});

		this.activatedRoute.params.subscribe(params => {
			this.id.set(params['id']);

			if (this.id()) {
				if (!parseInt(this.id())) {
					this.router.navigateByUrl('/');
					return;
				}

				this.loaderService.setLoading(true);
				this.peopleService.getPerson(+this.id()).subscribe({
					next: person => {
						this.form.patchValue({ ...person });
						this.loaderService.setLoading(false);
					},
					error: () => {
						this.messageService.showMessage('Ocorreu um erro ao carregar os dados', MessageType.Error);
						this.loaderService.setLoading(false);
					}
				});
			}
		});
	}

	sendData(): void {
		console.log(this.form.valid);
		if (this.form.controls['cpf'].invalid) {
			this.messageService.showMessage('O número do CPF está inválido.', MessageType.Error);
			return;
		}

		if (this.form.controls['phone'].invalid) {
			this.messageService.showMessage('O número de telefone está em um formato inválido.', MessageType.Error);
			return;
		}

		const formData = this.form.getRawValue();
		const body: PersonBody = {
			name: formData['name'],
			cpf: formData['cpf'],
			birthday: formData['birthday'],
			email: formData['email'],
			phone: formData['phone'],
			city: formData['city'],
			state: formData['state']
		};

		this.loaderService.setLoading(true);
		if (this.id()) {
			this.peopleService.updatePerson(+this.id(), body).subscribe({
				next: () => {
					this.messageService.showMessage('Dados atualizados com sucesso');
					this.loaderService.setLoading(false);
					this.router.navigateByUrl('/');
				},
				error: () => {
					this.messageService.showMessage(
						'Não foi possível atualizar os dados do cadastro.',
						MessageType.Error
					);
					this.loaderService.setLoading(false);
				}
			});
		} else {
			this.peopleService.registerPerson(body).subscribe({
				next: () => {
					this.messageService.showMessage('Dados cadastrados com sucesso');
					this.loaderService.setLoading(false);
					this.router.navigateByUrl('/');
				},
				error: () => {
					this.messageService.showMessage(
						'Não foi possível realizar o cadastro dos dados.',
						MessageType.Error
					);
					this.loaderService.setLoading(false);
				}
			});
		}
	}

	confirmDelete(): void {
		this.deleteModalVisible.set(true);
	}

	deleteData(event: boolean): void {
		this.deleteModalVisible.set(false);
		if (!event) {
			return;
		}
		this.loaderService.setLoading(true);
		this.peopleService.removePerson(+this.id()).subscribe({
			next: () => {
				this.messageService.showMessage('Dados excluídos com sucesso');
				this.loaderService.setLoading(false);
				this.router.navigateByUrl('/');
			},
			error: () => {
				this.messageService.showMessage('Não foi possível excluir os dados', MessageType.Error);
				this.loaderService.setLoading(false);
			}
		});
	}
}
