export default interface DbDeleteResponse {
    numberOfAffectedEntities: number
}

export function toDbDeleteResponse(response: number): Promise<DbDeleteResponse> {
    return Promise.resolve({ numberOfAffectedEntities: response })
}
