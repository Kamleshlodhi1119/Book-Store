import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LayoutModule } from 'src/app/layout/layout.module';
import { AboutusComponent } from './aboutus.component';

@NgModule({
  declarations: [AboutusComponent],
  imports: [
    CommonModule,
    LayoutModule,
    RouterModule.forChild([{ path: '', component: AboutusComponent }])
  ]
})
export class AboutusModule {}
