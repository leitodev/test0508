import { Injectable } from '@angular/core';
import {TrainComponent} from '../models/component.model';

const STORAGE_KEY = 'train_components';

@Injectable({
  providedIn: 'root'
})
export class ComponentService {
  private get components(): TrainComponent[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  }

  private set components(data: TrainComponent[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  getAll(): TrainComponent[] {
    return this.components;
  }

  getById(id: number): TrainComponent | undefined {
    return this.components.find(c => c.id === id);
  }

  update(component: TrainComponent): void {
    const components = this.components.map(c => (c.id === component.id ? component : c));
    this.components = components;
  }

  add(component: TrainComponent): void {
    const components = [...this.components, component];
    this.components = components;
  }
}
