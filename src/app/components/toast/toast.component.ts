import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="toast" [class.visible]="visible">
      <span class="toast-icon">⚠</span>
      <span class="toast-text">{{ message }}</span>
    </div>
  `,
    styles: [`
    .toast {
      position: fixed;
      bottom: 32px;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      background: #1e1e1e;
      border: 1px solid #e63946;
      color: #f1f1f1;
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      padding: 14px 22px;
      border-radius: 2px;
      display: flex;
      align-items: center;
      gap: 10px;
      opacity: 0;
      transition: opacity 0.3s ease, transform 0.3s ease;
      pointer-events: none;
      z-index: 999;
      white-space: nowrap;
    }
    .toast.visible {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
    .toast-icon {
      color: #e63946;
    }
  `]
})
export class ToastComponent implements OnChanges {
    @Input() message = '';
    visible = false;
    private timer: any;

    ngOnChanges(): void {
        if (!this.message) return;
        clearTimeout(this.timer);
        this.visible = true;
        this.timer = setTimeout(() => this.visible = false, 5000);
    }
}