import { TestBed } from '@angular/core/testing';

import { WebSpeechAPIService } from './web-speech-api.service';

describe('WebSpeechAPIService', () => {
  let service: WebSpeechAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebSpeechAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
