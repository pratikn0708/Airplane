import { NgModule } from '@angular/core';
import {
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatCardModule,
    MatMenuModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatRadioModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatChipsModule,
    MatTooltipModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatButtonToggleModule
} from '@angular/material';
const exportedMaterialModule = [
    MatSidenavModule,
    MatToolbarModule,
    MatExpansionModule,
    MatMenuModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatRadioModule,
    MatSnackBarModule,
    MatListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatChipsModule,
    MatTooltipModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatButtonToggleModule
];

@NgModule({
    exports: [
        ...exportedMaterialModule // use spread operator
    ]
})
export class MaterialModule { }
