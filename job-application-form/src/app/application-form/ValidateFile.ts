import { AbstractControl } from '@angular/forms';

export function ValidateFile(control: AbstractControl) {
  var allowedFileFormats = ['doc', 'docx', 'pdf', 'odt'];
  var ext = control.value.substring(control.value.lastIndexOf('.') + 1);
  if (!allowedFileFormats.includes(ext)) {
    return { invalidFile: true };
  }
  return null;
}
