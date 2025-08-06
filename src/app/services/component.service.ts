import {inject, Injectable} from '@angular/core';
import {TrainComponent} from '../models/component.model';
import {catchError, delay, Observable, throwError} from 'rxjs';
import {SpinnerService} from './spinner.service';
import {ToastrService} from 'ngx-toastr';

const STORAGE_KEY = 'train_components';

@Injectable({
  providedIn: 'root'
})
export class ComponentService {
  spinnerService = inject(SpinnerService);
  toastrService = inject(ToastrService);

  private get components(): TrainComponent[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  }

  private set components(data: TrainComponent[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  getAll(): Observable<TrainComponent[]> {
    return new Observable<TrainComponent[]>(observer => {
      try {
        this.spinnerService.show();
        // throw new Error('Имитация ошибки чтения данных'); // имитирова ошибку

        const data = this.components;
        observer.next(data);
        observer.complete();
      } catch (error) {
        observer.error(error);
        this.spinnerService.hide();
      }
    }).pipe(
      delay(1000), // Имитируем задержку
      catchError(err => {
        this.spinnerService.hide();
        this.toastrService.error('Failed to get components');
        return throwError(() => new Error('Failed to get components'));
      })
    );
  }

  update(component: TrainComponent) {
    return new Observable<TrainComponent>(observer => {
      try {
        //throw new Error('имитирова ошибку'); // имитирова ошибку

        const components = this.components.map(c => (c.id === component.id ? component : c));
        this.components = components;
        observer.next(component);
        observer.complete();
        this.toastrService.success(component.name+' updated successfully');
      } catch (error) {
        observer.error(error);
      }
    }).pipe(
      catchError(err => {
        this.toastrService.error('Error updating component');
        return throwError(() => new Error('Error updating component'));
      })
    );
  }

  add(component: TrainComponent) {
    return new Observable<TrainComponent>(observer => {
      try {
        // throw new Error('имитирова ошибку'); // имитирова ошибку

        const components = [...this.components, component];
        this.components = components;
        observer.next(component);
        observer.complete();
        this.toastrService.success(component.name+' added successfully');
      } catch (error) {
        observer.error(error);
      }
    }).pipe(
      catchError(err => {
        this.toastrService.error('Error saving component');
        return throwError(() => new Error('Error saving component'));
      })
    );
  }

}
