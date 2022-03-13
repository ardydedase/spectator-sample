import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class GithubService {
  constructor(private http: HttpClient) {}

  public searchRepos(searchString: string) {
    return this.http
      .get(`https://api.github.com/search/repositories?q=${searchString}`)
      .pipe(map((result: any) => result['items']));
  }

  public searchUsers(searchString: string) {
    console.log('search users..');
    return this.http
      .get(`https://api.github.com/search/users?q=${searchString}`)
      .pipe(map((result: any) => result['items']));
  }
}
