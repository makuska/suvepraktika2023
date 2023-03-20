import { Component } from '@angular/core';
import {Observable} from "rxjs";
import {Page} from "../../models/page";
import {Checkout} from "../../models/checkout";

@Component({
  selector: 'app-checkouts-detail',
  templateUrl: './checkouts-detail.component.html',
  styleUrls: ['./checkouts-detail.component.css']
})
export class CheckoutsDetailComponent {
  checkouts$!: Observable<Page<Checkout>>;

}
