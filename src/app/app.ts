import {AfterViewInit, Component, inject, OnInit, ViewChild} from '@angular/core';
import {TrainComponent} from './models/component.model';
import {ComponentService} from './services/component.service';
import {MatDialog} from '@angular/material/dialog';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable, MatTableDataSource
} from '@angular/material/table';
import {ComponentModal} from './modals/component-modal/component-modal';
import {MatPaginator} from '@angular/material/paginator';
import mockData from './mock-data';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {SpinnerService} from './services/spinner.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-root',
  imports: [MatTable, MatHeaderCell, MatCell, MatColumnDef, MatCellDef, MatHeaderRow, MatRow, MatHeaderRowDef, MatRowDef, MatHeaderCellDef, MatPaginator, MatProgressSpinner],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, AfterViewInit {
  spinnerService = inject(SpinnerService);
  toastrService = inject(ToastrService);
  displayedColumns: string[] = ['id', 'name', 'uniqueNumber', 'canAssignQuantity', 'quantity', 'actions'];
  dataSource = new MatTableDataSource<TrainComponent>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private service: ComponentService, private dialog: MatDialog) {}

  ngOnInit(): void {
    localStorage.setItem('train_components', JSON.stringify(mockData));
    this.load();


    window.addEventListener('online', () => {
      this.toastrService.info('The Internet is restored!', 'Network');
      this.service.syncPendingOperations();
    });
    window.addEventListener('offline', () => this.toastrService.warning('Internet is disconnected. We work offline.', 'Network'));
    if (!navigator.onLine) {
      this.toastrService.warning('Internet is disconnected. We work offline.', 'Network');
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  load() {

    this.spinnerService.show();

    this.service.getAll().subscribe({
      next: components => {
        this.dataSource.data = components;
        this.spinnerService.hide();
      },
      error: err => {}
    });
  }

  addNew() {
    const component: TrainComponent = {
      id: this.dataSource.data.length + 1,
      name: '',
      uniqueNumber: '',
      canAssignQuantity: false
    };
    this.openDialog('add', component);
  }

  openEdit(component: TrainComponent) {
    this.openDialog('update', component);
  }

  openDialog(mode: 'add' | 'update', component: TrainComponent) {
    const dialogRef = this.dialog.open(ComponentModal, {
      width: '30%',
      maxWidth: '100vw',
      data: { component, mode },
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data?.saved) {
        this.load()
      }
    });
  }

}
