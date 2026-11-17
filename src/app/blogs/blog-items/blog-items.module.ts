import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BlogItemsRoutingModule } from './blog-items-routing.module';
import { BlogItemsComponent } from './blog-items.component';
import { BlogPreviewComponent } from '../blog-preview/blog-preview.component';

@NgModule({
  declarations: [BlogItemsComponent],
  imports: [CommonModule, BlogItemsRoutingModule, BlogPreviewComponent]
})
export class BlogItemsModule {}
