import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PromptService } from '../../services/prompt.service';
import { Prompt } from '../../models/prompt.model';

@Component({
  selector: 'app-prompt-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './prompt-list.component.html',
})
export class PromptListComponent implements OnInit {
  prompts: Prompt[] = [];
  loading = true;
  error = false;

  constructor(private promptService: PromptService) {}

  ngOnInit() {
    this.promptService.getPrompts().subscribe({
      next: (data) => { this.prompts = data; this.loading = false; },
      error: () => { this.error = true; this.loading = false; }
    });
  }

  getPips(complexity: number): boolean[] {
    return Array.from({ length: 10 }, (_, i) => i < complexity);
  }

  pipClass(filled: boolean, complexity: number): string {
    if (!filled) return 'complexity-pip';
    if (complexity >= 8) return 'complexity-pip filled critical';
    if (complexity >= 5) return 'complexity-pip filled high';
    return 'complexity-pip filled';
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}
