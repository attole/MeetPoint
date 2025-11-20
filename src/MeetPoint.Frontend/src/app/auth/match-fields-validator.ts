import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function matchFieldsValidator(
  field1: string,
  field2: string
): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const f1 = group.get(field1);
    const f2 = group.get(field2);

    if (!f1 || !f2) return null;

    const mismatch = f1.value !== f2.value;
    return mismatch ? { fieldsMismatch: true } : null;
  };
}
