import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {TrainComponent} from '../../models/component.model';
import {ComponentService} from '../../services/component.service';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSlideToggle} from '@angular/material/slide-toggle';

@Component({
  selector: 'app-component-modal',
  imports: [
    MatDialogContent,
    MatFormField,
    MatLabel,
    MatInput,
    MatLabel,
    MatFormField,
    ReactiveFormsModule,
    MatDialogActions,
    MatFormFieldModule,
    MatSlideToggle
  ],
  templateUrl: './component-modal.html',
  styleUrl: './component-modal.css'
})
export class ComponentModal implements OnInit {
  form: FormGroup;
  quantityValidator = [
    Validators.required,
    Validators.min(1),
    Validators.pattern('^[0-9]+$'),
  ];

  constructor(
    public dialogRef: MatDialogRef<ComponentModal>,
    @Inject(MAT_DIALOG_DATA) public data: { component: TrainComponent, mode: 'add' | 'update' },
    private fb: FormBuilder,
    private service: ComponentService
  ) {
    this.form = this.fb.group({
      id: [data.component.id],
      name: [data.component.name, Validators.required],
      uniqueNumber: [data.component.uniqueNumber, Validators.required],
      canAssignQuantity: [data.component.canAssignQuantity],
      quantity: [
        data.component.quantity || '',
        data.component.canAssignQuantity ? [...this.quantityValidator] : [],
      ],
    });
  }

  ngOnInit(): void {
    this.form.get('canAssignQuantity')!.valueChanges.subscribe((canAssignQuantity) => {
      const quantityControl = this.form.get('quantity');
      if (canAssignQuantity) {
        quantityControl!.setValidators([...this.quantityValidator]);
      } else {
        quantityControl!.clearValidators();
        quantityControl!.setValue('');
      }
      // Update the control's validity
      quantityControl!.updateValueAndValidity();
    });
  }

  save() {

    if (this.form.invalid) return;
    let result: TrainComponent = this.form.value;

    if (!result.canAssignQuantity) {
      result.quantity = 0;
    }
    if (this.data.mode === 'add') {
      this.service.add(result);
    } else {
      this.service.update(result);
    }

    this.dialogRef.close();
  }


}
