import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortArrayBy'
})
export class SortArrayByPipe implements PipeTransform {

  transform(array: any, property: any): any {
    console.log('sorting by ' + property);
    let sortedArray = array.sort(this.dynamicSort(property));
    console.log(sortedArray);
    return sortedArray;

  }

  dynamicSort(property:string) {
    let sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a, b) {
      let result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
    }
  }

}
