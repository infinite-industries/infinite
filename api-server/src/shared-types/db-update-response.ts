export default interface DbUpdateResponse<T> {
  numberOfAffectedEntities: number;
  updatedEntities: T[];
}

export function toDbUpdateResponse<T>(
  response: [number, T[]],
): Promise<DbUpdateResponse<T>> {
  const numberOfAffectedEntities: number = response[0];
  const updatedEntities: T[] = response[1];

  console.log(
    `!!! is it working?: ${numberOfAffectedEntities} ${updatedEntities.length}`,
  );
  return Promise.resolve({
    numberOfAffectedEntities,
    updatedEntities,
  });
}
