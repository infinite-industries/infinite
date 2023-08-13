import faker from 'faker';
export function generateList<T>(generator: () => T, min = 1, max = 10): T[] {
  const sizeList = faker.datatype.number({ min, max });

  const list: T[] = [];
  for (let i = 0; i < sizeList; i++) {
    list.push(generator());
  }

  return list;
}
