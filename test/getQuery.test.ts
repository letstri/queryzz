import { getQuery } from '../dist/queryzz';

global.window = Object.create(window);
Object.defineProperty(window, 'location', {
  value: { search: '' },
});

afterEach(() => {
  window.location.search = '';
});

describe('[getQuery]: test simple get query', () => {
  test('get simple query', () => {
    window.location.search = '?test=123';

    const query1 = getQuery();
    const query2 = getQuery('test=123');
    const query3 = getQuery('?test=123');

    expect(query1).toEqual({ test: 123 });
    expect(query2).toEqual({ test: 123 });
    expect(query3).toEqual({ test: 123 });
  });

  test('get simple query from link', () => {
    const query = getQuery('http://google.com/?test=123');

    expect(query).toEqual({ test: 123 });
  });

  test('get simple query from unusual link', () => {
    const query = getQuery('google.com/?test=123');

    expect(query).toEqual({ test: 123 });
  });
});

describe('[getQuery]: test parse', () => {
  test('get simple query with parse', () => {
    const query = getQuery({ link: 'test=123&bool=false' });

    expect(query).toEqual({ test: 123, bool: false });
  });

  test('get simple query without parse', () => {
    const query = getQuery({ link: 'test=123&bool=false', parse: false });

    expect(query).toEqual({ test: '123', bool: 'false' });

    window.location.search = '?test=123&bool=false';

    const query2 = getQuery({ parse: false });

    expect(query2).toEqual({ test: '123', bool: 'false' });
  });
});

describe('[getQuery]: test get query with arrays', () => {
  test('get empty arrays', () => {
    const query = getQuery({ arrays: ['array'] });

    expect(query).toEqual({ array: [] });
  });

  test('get array', () => {
    window.location.search = '?test=123&test=456';

    const query1 = getQuery();
    const query2 = getQuery({ parse: false });

    expect(query1).toEqual({ test: [123, 456] });
    expect(query2).toEqual({ test: ['123', '456'] });
  });
});

describe('[getQuery]: special tests', () => {
  test('get object as string', () => {
    window.location.search = '?test={}';

    const query = getQuery();

    expect(query).toEqual({ test: '{}' });
  });

  test('get hard query', () => {
    window.location.search = '?test=123&test=456&redirect=https%3A%2F%2Fgoogle.com&bool=false&empty=null';

    const query1 = getQuery({ arrays: ['empty'] });
    const query2 = getQuery({ parse: false, arrays: ['empty'] });

    expect(query1).toEqual({
      test: [123, 456],
      redirect: 'https://google.com',
      bool: false,
      empty: [null],
    });
    expect(query2).toEqual({
      test: ['123', '456'],
      redirect: 'https://google.com',
      bool: 'false',
      empty: ['null'],
    });
  });
});
