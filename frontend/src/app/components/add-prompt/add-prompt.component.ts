import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PromptService } from '../../services/prompt.service';

@Component({
  selector: 'app-add-prompt',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-prompt.component.html',
})
export class AddPromptComponent {
  form: FormGroup;
  submitting = false;
  showToast = false;

  constructor(private fb: FormBuilder, private promptService: PromptService, private router: Router) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      content: ['', [Validators.required, Validators.minLength(20)]],
      complexity: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
    });
  }

  get title() { return this.form.get('title')!; }
  get content() { return this.form.get('content')!; }
  get complexity() { return this.form.get('complexity')!; }

  get complexityValue(): number { return this.complexity.value; }

  isInvalid(field: { invalid: boolean; dirty: boolean; touched: boolean }): boolean {
    return field.invalid && (field.dirty || field.touched);
  }

  getPips(complexity: number): boolean[] {
    return Array.from({ length: 10 }, (_, i) => i < complexity);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting = true;
    this.promptService.createPrompt(this.form.value).subscribe({
      next: (prompt) => {
        this.submitting = false;
        this.showToast = true;
        setTimeout(() => this.router.navigate(['/prompts', prompt.id]), 1200);
      },
      error: () => { this.submitting = false; }
    });
  }
}
