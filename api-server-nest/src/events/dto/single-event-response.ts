import {Event} from '../models/event.model'

export interface SingleEventResponse {
    event: Event,
    status: 'success' | 'failure'
}
