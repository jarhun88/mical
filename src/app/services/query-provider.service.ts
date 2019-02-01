import { Injectable } from '@angular/core';
import {InterventionProviderService} from './intervention-provider.service';
import {OutcomeTableProviderService} from './outcome-table-provider.service';
import {FilterProviderService} from './filter-provider.service';
import {HttpClient} from '@angular/common/http';
import {RowData} from '../model/datatypes';
import {Observable} from 'rxjs';
import {API_ROUTE, SERVER_URL} from '../util/constants';

@Injectable({
  providedIn: 'root'
})
export class QueryProviderService {

  constructor(private interventionProviderService: InterventionProviderService,
              private outcomeTableProvider: OutcomeTableProviderService,
              private filterProvider: FilterProviderService,
              private http: HttpClient) {
    filterProvider.announcer.subscribe(() => {
      this.get();
    })
  }

  get(): Observable<Array<RowData>> {
    let ans =  <Observable<Array<RowData>>> this.http.get(this.buildURL());
    ans.subscribe(undefined, errorFn);
    return ans;
  }

  buildURL(): string {
     let url = [SERVER_URL, API_ROUTE, this.outcomeTableProvider.table].join("/");

     // set geofilter
     let areaFilter = this.filterProvider.geoFilter;
     if (areaFilter !== "") {
       url += "?area=" + areaFilter;
     }

     // set other filters
     let customF = this.filterProvider.filters.compile();
     url += "?f=" + customF;
     console.log("Querying: " + url);
     return url;
  }

}


let errorFn = (err) => {
  console.log("Error tring to fetch rows: " + JSON.stringify(err));
};
