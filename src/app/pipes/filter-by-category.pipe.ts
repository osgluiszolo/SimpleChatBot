import { Pipe, PipeTransform } from '@angular/core';
import { MenuItem } from '../models/menu-item';

@Pipe({
  name: 'filterByCategory'
})
export class FilterByCategoryPipe implements PipeTransform {
  transform(items: MenuItem[], category: string): MenuItem[] {
    if (!items || !category) {
      return items;
    }
    return items.filter(item => item.category === category);
  }
} 