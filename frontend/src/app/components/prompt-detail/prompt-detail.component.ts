import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PromptService } from '../../services/prompt.service';
import { Prompt } from '../../models/prompt.model';

@Component({
  selector: 'app-prompt-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './prompt-detail.component.html',
})
export class PromptDetailComponent implements OnInit {
  prompt: Prompt | null = null;
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private promptService: PromptService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.promptService.getPrompt(id).subscribe({
      next: (data) => { this.prompt = data; this.loading = false; },
      error: () => { this.error = true; this.loading = false; }
    });
  }

  goBack() { this.router.navigate(['/prompts']); }

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
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }
}
