import {computed, Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private isVisible = signal<boolean>(true);

  readonly isVisible$ = computed(() => this.isVisible());

  show() {
    this.isVisible.set(true);
  }

  hide() {
    this.isVisible.set(false);
  }
}
