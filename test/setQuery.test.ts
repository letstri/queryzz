import { setQuery } from '../dist/queryzz';

afterEach(() => {
  setQuery({}, { saveOld: false });
});

describe('[setQuery]: test simple set', () => {
  test('set simple query', () => {
    setQuery({ test: 123 });

    expect(window.location.search).toBe('?test=123');
  });

  test('set simple string query', () => {
    setQuery({ test: '123' });

    expect(window.location.search).toBe('?test=123');

    setQuery({ test: '321' });

    expect(window.location.search).toBe('?test=321');

    setQuery({ test: '456' });
    setQuery({ test: '456' });

    expect(window.location.search).toBe('?test=456');
  });
});

describe('[setQuery]: test array set', () => {
  test('set array query', () => {
    setQuery({ test: [123, 456] });

    expect(window.location.search).toBe('?test=123&test=456');
  });
});

describe('[setQuery]: test encoding', () => {
  test('set link in query', () => {
    setQuery({ redirect: 'https://google.com' });

    expect(window.location.search).toBe('?redirect=https%3A%2F%2Fgoogle.com');
  });
});

describe('[setQuery]: test saveOld', () => {
  test('set query and don\'t save old', () => {
    setQuery({ var: 123 });
    setQuery({ var2: 123 }, { saveOld: false });

    expect(window.location.search).toBe('?var2=123');
  });
});

describe('[setQuery]: test saveEmpty', () => {
  test('set query without empty fields', () => {
    setQuery({ var: 123, var2: '' });

    expect(window.location.search).toBe('?var=123');
  });

  test('set query with empty fields', () => {
    setQuery({ var: 123, var2: '' }, { saveEmpty: true });

    expect(window.location.search).toBe('?var=123&var2=');
  });
});

describe('[setQuery]: test saveHash', () => {
  test('set query with hash saving', () => {
    const hash = '#some_hash';

    window.location.hash = hash;
    setQuery();

    expect(window.location.hash).toBe(hash);
  });

  test('set query without hash saving', () => {
    const hash = '#some_hash';

    window.location.hash = hash;
    setQuery({}, { saveHash: false });

    expect(window.location.hash).toBe('');
  });
});

describe('[setQuery]: special tests', () => {
  test('set query and concat', () => {
    setQuery({ test: 'variable', test2: 'needToSave' });
    setQuery({ test: [123, '456'], test3: '' }, { saveEmpty: true });

    expect(window.location.search).toBe('?test=123&test=456&test2=needToSave&test3=');
  });
});
