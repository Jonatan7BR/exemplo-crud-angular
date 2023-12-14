import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import moment from 'moment';
import { validateCpf, validatePhone } from '../../utils/validators';
import { Person } from '../../models/person';
import { STATES } from '../../utils/states';
import { PeopleService } from '../../services/people.service';
import { LoaderService } from '../../services/loader.service';

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
        this.loaderService.setLoading(true);
        this.peopleService.getPerson(+this.id()).subscribe(person => {
          this.form.patchValue({ ...person });
          this.loaderService.setLoading(false);
        });
      }
    });
  }

  sendData(): void {
    if (this.form.invalid) {
      return;
    }

    this.router.navigateByUrl('/');
  }
}
