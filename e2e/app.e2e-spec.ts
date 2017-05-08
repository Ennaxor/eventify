import { EventifyPage } from './app.po';

describe('eventify App', () => {
  let page: EventifyPage;

  beforeEach(() => {
    page = new EventifyPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
