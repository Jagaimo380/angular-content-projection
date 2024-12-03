import {
  Component,
  ContentChild,
  TemplateRef,
  Directive,
  Input,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Directive({
  selector: '[appContent3Directive]',
  standalone: true,
})
export class Content3Directive {
  constructor(public templateRef: TemplateRef<unknown>) {}
}

@Component({
  selector: 'app-content4',
  imports: [CommonModule],
  standalone: true,
  template: `
    <span>content 4 - {{context}}</span>
  `,
})
export class Content4Component {
  @Input() context?: string;
}

@Component({
  selector: 'app-parent',
  imports: [CommonModule],
  standalone: true,
  template: `
    <div>
      <h1>Content 1</h1>
      <ng-content select="[content1]" />

      <h1>Content 2</h1>
      <ng-content select="content2"></ng-content>

      @if (content3) {
        <h1>Content 3</h1>
        <ng-container [ngTemplateOutlet]="content3.templateRef" [ngTemplateOutletContext]="{$implicit: foo}" />
      }

      <h1>Content 4</h1>
      <ng-content select="content4"></ng-content>

      @if (content5) {
        <h1>Content 5</h1>
        <ng-container [ngTemplateOutlet]="content5" [ngTemplateOutletContext]="{$implicit: foo}" />
      }
    </div>
  `,
})
export class ParentComponent {
  foo: string = 'foo';

  @ContentChild(Content3Directive)
  protected readonly content3?: Content3Directive;

  @ContentChild('content5')
  protected readonly content5?: TemplateRef<unknown>;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ParentComponent, Content3Directive, Content4Component],
  template: `
    <app-parent>
      <p content1>content1</p>

      <p ngProjectAs="content2">content2</p>

      <span *appContent3Directive="let context">content3 {{context}}</span>

      <app-content4 ngProjectAs="content4" context="test"></app-content4>

      <ng-template #content5 let-context>
        <span>content5 - {{context}}</span>
      </ng-template>
    </app-parent>
  `,
})
export class App {}

bootstrapApplication(App);
