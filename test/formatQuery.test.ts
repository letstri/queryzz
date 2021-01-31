import { formatQuery } from '../dist/queryzz';

describe('[formatQuery]: test simple format', () => {
  test('format query', () => {
    const query = formatQuery({ test: 123 });

    expect(query).toBe('test=123');
  });

  test('format query with array', () => {
    const query = formatQuery({ test: [123, 456], test2: 'hello' });

    expect(query).toEqual('test=123&test=456&test2=hello');
  });
});

describe('[formatQuery]: test encoding', () => {
  test('format query with link', () => {
    const query = formatQuery({ redirect: 'https://google.com' });

    expect(query).toBe('redirect=https%3A%2F%2Fgoogle.com');
  });

  test('format query with link without parse', () => {
    const query = formatQuery({ redirect: 'https://google.com' }, false);

    expect(query).toBe('redirect=https://google.com');
  });
});
