import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'cpf',
	standalone: true
})
export class CpfPipe implements PipeTransform {
	transform(value: string): string {
		if (!value.match(/\d{11}/)) {
			return value;
		}
		return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
	}
}
