import { DeltaAngularPage } from './app.po';

describe('delta-angular App', () => {
  let page: DeltaAngularPage;

  beforeEach(() => {
    page = new DeltaAngularPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
