/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UserAnswerService } from './userAnswer.service';

describe('Service: UserAnswer', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserAnswerService]
    });
  });

  it('should ...', inject([UserAnswerService], (service: UserAnswerService) => {
    expect(service).toBeTruthy();
  }));
});
