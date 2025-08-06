import {computed, Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private isVisible = signal<boolean>(false);

  readonly isVisible$ = computed(() => this.isVisible());

  show() {
    this.isVisible.set(true);
  }

  hide() {
    this.isVisible.set(false);
  }
}
