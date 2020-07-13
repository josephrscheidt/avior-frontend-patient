	import { TestBed } from '@angular/core/testing';
    import { ProgramdetailService } from '../program-detail/service/program-detail.service';

	describe('ProgramdetailService', () => {
	  beforeEach(() => TestBed.configureTestingModule({}));

	  it('should be created', () => {
	    const service: ProgramdetailService = TestBed.get(ProgramdetailService);
	    expect(service).toBeTruthy();
	  });
	});
