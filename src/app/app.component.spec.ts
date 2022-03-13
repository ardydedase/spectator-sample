import { AppComponent } from './app.component';
import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { GithubService } from './github.service';
import { of } from 'rxjs';

describe('AppComponentSpectator', () => {
  let spectator: Spectator<AppComponent>;
  // Create componnent providers
  const createComponent = createComponentFactory({
    component: AppComponent,
    providers: [
      { provide: GithubService, useValue: {} }
    ],
    mocks: [GithubService],
  });
  
  beforeEach(() => spectator = createComponent());

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  describe('initSearchUsers', () => {
    const searchTerm = "angular";
    it('should start search when there is search string entered', done => {
      // Assert emitted values from the observables
      spectator.component.searchSubject$.subscribe(res => {
        expect(res).toBe(searchTerm);
        done();
      });
      spectator.component.results$.subscribe(res => {
        expect(res.total_count).toBe(100);
        done();
      });
      // Mock the service
      const githubService = spectator.inject(GithubService);
      githubService.searchUsers.andReturn(of({
        total_count: 100,
      }));
      // Call the methods
      spectator.component.initSearchUsers();
      spectator.component.searchUsersFormControl.setValue(searchTerm);
    });
  });
});