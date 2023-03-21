import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss']
})
export class BookDetailComponent implements OnInit {
  book$!: Observable<Book>;


  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
  ) {
  }

  // https://gist.github.com/makuska/84457e0b6f614301b14575aaeaa0d917#ngoninit-void--thisbook--thisrouteparams-pipemapparams--paramsid-pipeswitchmapid--thisbookservicegetbookid
  ngOnInit(): void {
    this.book$ = this.route.params
      .pipe(map(params => params['id']))
      .pipe(switchMap(id => this.bookService.getBook(id)))
  }

}
