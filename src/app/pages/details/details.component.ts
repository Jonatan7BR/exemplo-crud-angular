import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import moment from 'moment';
import { validateCpf, validatePhone } from '../../utils/validators';
import { Person, PersonBody } from '../../models/person';
import { STATES } from '../../utils/states';
import { PeopleService } from '../../services/people.service';
import { LoaderService } from '../../services/loader.service';
import { MessageService, MessageType } from '../../services/message.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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

  title = computed(() => this.id() ? 'Editar cadastro' : 'Cadastrar pessoa');
  buttonLabel = computed(() => this.id() ? 'Atualizar' : 'Cadastrar');

  form!: FormGroup;

  readonly states = STATES.sort((a, b) => a.name.localeCompare(b.name));

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
            this.messageService.sendMessage('Ocorreu um erro ao carregar os dados', MessageType.Error);
            this.loaderService.setLoading(false);
          }
        });
      }
    });
  }

  sendData(): void {
    console.log(this.form.valid);
    if (this.form.controls['cpf'].invalid) {
      this.messageService.sendMessage('O número do CPF está inválido.', MessageType.Error);
      return;
    }

    if (this.form.controls['phone'].invalid) {
      this.messageService.sendMessage('O número de telefone está em um formato inválido.', MessageType.Error);
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
          this.messageService.sendMessage('Dados atualizados com sucesso');
          this.loaderService.setLoading(false);
          this.router.navigateByUrl('/');
        },
        error: () => {
          this.messageService.sendMessage('Não foi possível atualizar os dados do cadastro.', MessageType.Error);
          this.loaderService.setLoading(false);
        }
      });
    } else {
      this.peopleService.registerPerson(body).subscribe({
        next: () => {
          this.messageService.sendMessage('Dados cadastrados com sucesso');
          this.loaderService.setLoading(false);
          this.router.navigateByUrl('/');
        },
        error: () => {
          this.messageService.sendMessage('Não foi possível realizar o cadastro dos dados.', MessageType.Error);
          this.loaderService.setLoading(false);
        }
      });
    }
  }
}
