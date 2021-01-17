import {Injectable} from "@nestjs/common";
import axios from "axios";
import isNotNullOrUndefined from "../utils/is-not-null-or-undefined";

require('dotenv').config();

const BITLY_URI ='https://api-ssl.bitly.com/v4/shorten'
const BITLY_TOKEN = process.env.BITLY_TOKEN

@Injectable()
export default class BitlyService {
    async createLink (infiniteUrl: string): Promise<string | null> {
        const headers = this.buildHeader()

        try {
            const response = await axios.post(BITLY_URI, { long_url: infiniteUrl }, { headers })

            return response.data && response.data.link ? response.data.link : null
        } catch (ex) {
            const errors = ex.response && ex.response.data
                ? (ex.response.data.length ? ex.response.data.map(e => e.message).join(', ') : ex.response.data.message)
                : 'n/a'

            console.error(`Link shortener failed (${ex.response && ex.response.status}: ${errors}) -- ${ex}`)

            throw new Error('Link shortener failed')
        }
    }

    isBitlyTokenSet(): boolean {
        return isNotNullOrUndefined(BITLY_TOKEN)
    }

    private buildHeader(): { Authorization: string, 'Content-Type': string } {
        return {
            Authorization: `Bearer ${BITLY_TOKEN}`,
            'Content-Type': 'application/json'
        }
    }
}
