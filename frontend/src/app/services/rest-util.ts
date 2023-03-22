import { HttpParams } from '@angular/common/http';
import { PageRequest } from '../models/page';

export class RestUtil {
  public static buildParamsFromPageRequest(filter: Partial<PageRequest>): HttpParams {
    // Didn't see/understand this til now...
    const {pageIndex, pageSize, sort, direction, statusFilter, search} = filter;
    // using let and reassigning params, because httpParams is immutable, so .set() returns new object.
    let params = new HttpParams();
    if (pageIndex != null) {
      params = params.set('page', String(pageIndex));
    }
    if (pageSize != null) {
      params = params.set('size', String(pageSize));
    }
    if (sort != null) {
      params = params.set('sort', sort + ',' + direction ?? '');
      //The '??' operator is used to provide a default empty string value in case the 'direction' property is null or undefined.
    }
    if (statusFilter === 'AVAILABLE') {
      params = params.set('sort', 'status,asc');
    }
    if (statusFilter === 'BORROWED') {
      params = params.set('sort', 'status,desc');
    }
    if (search != null && search.trim() !== '') {
      params = params.set('search', search.trim());
      console.log(search);
    }
    return params;
  }
}
/*
curl -X GET 'http://localhost:8080/api/book/getBooks?page=0&size=10&sort=year,asc' // Sorts by year, asc order, pageSize 10
curl 'http://localhost:8080/api/book/getBooks?page=0&size=10&sort=year,desc' // Sorts by year, desc order, pageSize 10
curl 'http://localhost:8080/api/book/getBooks?page=0&size=5&sort=status,desc' // Sorts by status, desc order
    (BORROWED first then AVAILABLE), pageSize 5 - filtering...
*/
