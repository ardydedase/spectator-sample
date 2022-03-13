import { Component, VERSION } from '@angular/core';
import { Subject, Observable, ReplaySubject } from 'rxjs';
import { GithubService } from './github.service';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  takeUntil,
} from 'rxjs/operators';
import { FormControl } from '@angular/forms';

enum SearchType {
  REPOS,
  USERS,
  TOPICS,
}

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
})
export class AppComponent {
  name = 'Angular ' + VERSION.major;
  searchSubject$ = new Subject<string>();
  results$: Observable<any> = new Observable();
  searchReposFormControl = new FormControl();
  searchUsersFormControl = new FormControl();
  searchType: SearchType = SearchType.REPOS;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private readonly githubService: GithubService) {}

  ngOnInit() {
    this.results$ = this.searchSubject$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      // @ts-ignore
      switchMap((searchStr: string) => {
        const searchTerm = searchStr.trim();
        if (searchTerm) {
          switch (this.searchType) {
            case SearchType.REPOS:
              return this.githubService.searchRepos(searchTerm);
            case SearchType.USERS:
              console.log('calling github service search Users...');
              return this.githubService.searchUsers(searchTerm);
            default:
              break;
          }
        }
      })
    );

    this.initSearchRepos();
    this.initSearchUsers();
  }

  initSearchRepos(): void {
    this.searchReposFormControl.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe((searchTerm) => {
        if (searchTerm) {
          this.searchType = SearchType.REPOS;
          this.searchSubject$.next(searchTerm);
        }
      });
  }

  initSearchUsers(): void {
    console.log('initSearchUsers');
    this.searchUsersFormControl.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe((searchTerm) => {
        console.log('searchTerm:', searchTerm);
        if (searchTerm.trim()) {
          this.searchType = SearchType.USERS;
          this.searchSubject$.next(searchTerm);
          console.log('search is set');
        }
      });
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}
