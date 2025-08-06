import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
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

@Component({
  selector: 'app-root',
  imports: [MatTable, MatHeaderCell, MatCell, MatColumnDef, MatCellDef, MatHeaderRow, MatRow, MatHeaderRowDef, MatRowDef, MatHeaderCellDef, MatPaginator],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'name', 'uniqueNumber', 'canAssignQuantity', 'quantity', 'actions'];
  dataSource = new MatTableDataSource<TrainComponent>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private service: ComponentService, private dialog: MatDialog) {}

  ngOnInit(): void {
    localStorage.setItem('train_components', JSON.stringify([
      { id: 1, name: 'Engine', uniqueNumber: 'ENG123', canAssignQuantity: false },
      { id: 2, name: 'Passenger Car', uniqueNumber: 'PAS456', canAssignQuantity: true, quantity: 10 },
      { id: 3, name: 'Dining Car', uniqueNumber: 'DIN789', canAssignQuantity: true, quantity: 2 },
      { id: 4, name: 'Wheel', uniqueNumber: 'WHL001', canAssignQuantity: true, quantity: 100 },
    ]));

    this.load();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  load() {
    this.dataSource.data = this.service.getAll();
  }

  addNew() {
    const component: TrainComponent = {
      id: this.service.getAll().length + 1,
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

    dialogRef.afterClosed().subscribe(() => this.load());
  }

}
