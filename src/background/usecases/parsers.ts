const mustNumber = (v: any): number => {
  let num = Number(v);
  if (isNaN(num)) {
    throw new Error('Not number: ' + v);
  }
  return num;
};

const parseSetOption = (
  word: string,
  types: { [key: string]: string },
): any[] => {
  let [key, value]: any[] = word.split('=');
  if (value === undefined) {
    value = !key.startsWith('no');
    key = value ? key : key.slice(2);
  }
  let type = types[key];
  if (!type) {
    throw new Error('Unknown property: ' + key);
  }
  if (type === 'boolean' && typeof value !== 'boolean' ||
       type !== 'boolean' && typeof value === 'boolean') {
    throw new Error('Invalid argument: ' + word);
  }

  switch (type) {
  case 'string': return [key, value];
  case 'number': return [key, mustNumber(value)];
  case 'boolean': return [key, value];
  }
  throw new Error('Unknown property type: ' + type);
};

export { parseSetOption };
