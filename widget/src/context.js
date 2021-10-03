const ENVS = ['local', 'staging', 'production']

const URLS = {
    local: {
        API: 'http://localhost:3003',
        SITE: 'http://localhost:7779'
    },
    staging: {
        API: 'https://staging-api.infinite.industries',
        SITE: 'https://staging.infinite.industries',
    },
    production: {
        API: 'https://api.infinite.industries',
        SITE: 'https://infinite.industries'
    }
}

const API_VERSION = 'v1'

// DEFAULT_ENV defined by webpack / jest
const DEFAULT_MODE = typeof DEFAULT_ENV !== 'undefined' ? DEFAULT_ENV : 'production'

const DEFAULT_TITLE = ''

const DEFAULT_PAGE_SIZE = '4'

const DYNAMIC_PAGE_SIZE = '*'

function computeDynamicPageSize(element) {
    const width = element.clientWidth
    const height = window.innerHeight
    const col_count = Math.floor(width / 310)
    const row_count = height >= 400 ? Math.floor(height / 400) : 1
    console.log(width, height, '->', col_count, row_count)
    return col_count * row_count
}

/**
 * Provides instance-level configuration information based on defaults and
 * attributes on the container element
 */
export default class Context {

    constructor(element) {
        this.element = element
        this.mode = DEFAULT_MODE

        let elMode = element.getAttribute('data-mode')
        if (elMode) {
            elMode = elMode.toLowerCase()
            if (ENVS.includes(elMode)) this.mode = elMode
        } 
    }

    getContainer() {
        return this.element
    }

    getContainerAttr(attribute) {
        return this.element.getAttribute(attribute)
    }

    getTitle() {
        const attr = this.element.getAttribute('data-widget-title')
        return attr ? attr : DEFAULT_TITLE
    }

    getPageSize() {
        const attr = this.element.getAttribute('data-cards-per-page')
        if (attr === DYNAMIC_PAGE_SIZE) {
            return computeDynamicPageSize(this.element)
        } else return attr ? attr : DEFAULT_PAGE_SIZE
    }

    getEventId() {
        const attr = this.element.getAttribute('data-event-id')
        return attr ? attr : null
    }

    getSiteUrl() {
        return URLS[this.mode].SITE
    }

    getApiUrl() {
        return `${URLS[this.mode].API}/${API_VERSION}`
    }
}
