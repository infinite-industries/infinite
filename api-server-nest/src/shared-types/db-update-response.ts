export interface DbUpdateResponse <T> {
    numberOfAffectedEntities: number,
    updatedEntities: T []
}
