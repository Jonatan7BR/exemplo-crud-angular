import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const validateCpf = (): ValidatorFn => 
    (control: AbstractControl<string>): ValidationErrors | null => {
        const { value } = control;
        if (!value) {
            return null;
        }

        if (!/^\d{11}$/.test(value) || /^(.)\1+$/.test(value)) {
            return { invalidCpf: true };
        }

        const digits = [...value].map(digit => +digit);
        const sum1 = digits.slice(0, 9).map((d, i) => d * (10 - i)).reduce((p, c) => p + c) % 11;
        const sum2 = digits.slice(0, 10).map((d, i) => d * (11 - i)).reduce((p, c) => p + c) % 11;

        const vd1 = sum1 < 2 ? 0 : 11 - sum1;
        const vd2 = sum2 < 2 ? 0 : 11 - sum2;

        if (vd1 !== digits[9] || vd2 !== digits[10]) {
            return { invalidCpf: true };
        }
        return null;
    };

export const validatePhone = (): ValidatorFn =>
    (control: AbstractControl<string>): ValidationErrors | null => 
        /^\d{10,11}$/.test(control.value) ? null : { invalidPhone: true };
