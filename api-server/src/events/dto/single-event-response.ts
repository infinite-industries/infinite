import EventDTO from './eventDTO'

export interface SingleEventResponse {
    event: EventDTO,
    status: 'success' | 'failure'
}
