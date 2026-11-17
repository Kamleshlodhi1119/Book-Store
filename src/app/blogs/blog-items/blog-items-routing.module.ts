import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogItemsComponent } from './blog-items.component';

const routes: Routes = [
  { path: '', component: BlogItemsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogItemsRoutingModule {}
