import { FreeFlatIconFrontendPage } from './app.po';

describe('free-flat-icon-frontend App', function() {
  let page: FreeFlatIconFrontendPage;

  beforeEach(() => {
    page = new FreeFlatIconFrontendPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
