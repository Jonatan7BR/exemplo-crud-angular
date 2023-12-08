import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const validateCpf = (): ValidatorFn => 
    (control: AbstractControl<string>): ValidationErrors | null => {
        const { value } = control;
        if (!value) {
            return null;
        }

        if (!value.match(/^\d{11}$/) || value.match(/^(.)\1+$/)) {
            return { invalidCpf: true };
        }

        const digits = [...value].map(digit => +digit);
        const sum1 = digits.slice(0, 9).map((d, i) => d * (10 - i)).reduce((p, c) => p + c);
        const sum2 = digits.slice(0, 10).map((d, i) => d * (11 - i)).reduce((p, c) => p + c);

        const vd1 = 11 - (sum1 % 11);
        const vd2 = 11 - (sum2 % 11);

        if (vd1 !== digits[10] || vd2 !== digits[11]) {
            return { invalidCpf: true };
        }
        return null;
    };

export const validatePhone = (): ValidatorFn =>
    (control: AbstractControl<string>): ValidationErrors | null => 
        control.value.match(/^\d{10,11}$/) ? null : { invalidPhone: true };
