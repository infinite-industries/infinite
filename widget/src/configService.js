
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

// DEFAULT_ENV defined by webpack / jest
const DEFAULT_MODE = typeof DEFAULT_ENV !== 'undefined' ? DEFAULT_ENV : 'production'

const widget_container = document.querySelector('#infinite-widget')

const mode = getModeFromContainer()

function getModeFromContainer() {
    let mode = widget_container ? widget_container.getAttribute('data-mode') : null
    if (mode) {
        mode = mode.toLowerCase()
        if (!ENVS.includes(mode)) mode = DEFAULT_MODE
    } else mode = DEFAULT_MODE
    return mode
}

export default class ConfigService {

    static getContainer() {
        return widget_container
    }

    static getContainerAttr(attribute) {
        return widget_container.getAttribute(attribute)
    }

    static getSiteUrl() {
        return URLS[mode].SITE
    }

    static getApiUrl() {
        return URLS[mode].API
    }
}

