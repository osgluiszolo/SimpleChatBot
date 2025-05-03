import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByCategory',
  standalone: true
})
export class FilterByCategoryPipe implements PipeTransform {
  transform(items: any[], category: string): any[] {
    if (!items || !category) {
      return items;
    }
    return items.filter(item => item.category === category);
  }
} 