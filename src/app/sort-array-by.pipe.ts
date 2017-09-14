import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortArrayBy'
})
export class SortArrayByPipe implements PipeTransform {


  transform(array: any, property1, property2): any {
    console.log('pipe is sorting');
    // let property2=  '-blogCreationDate';
    array = array.sort(this.dynamicSort(property1));
    if(property2)
    array = array.sort(this.dynamicSort(property2));
    console.log('sorting the array');
    return array;
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
