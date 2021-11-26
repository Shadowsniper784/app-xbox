'use strict'

const { Collection } = require('@discordjs/collection')
const APIRequest = require('./APIRequest')
const routeBuilder = require('./APIRouter')
const RequestHandler = require('./RequestHandler')
const { Error } = require('../errors')
const { Endpoints } = require('../Constants')

class RESTManager {
    constructor(client) {
        this.client = client
        this.handlers = new Collection()
        this.versioned = true
        this.globalLimit =
            client.options.restGlobalRateLimit > 0
                ? client.options.restGlobalRateLimit
                : Infinity
        this.globalRemaining = this.globalLimit
        this.globalReset = null
        this.globalDelay = null
        if (client.options.restSweepInterval > 0) {
            this.sweepInterval = setInterval(() => {
                this.handlers.sweep((handler) => handler._inactive)
            }, client.options.restSweepInterval * 1_000).unref()
        }
    }

    get api() {
        return routeBuilder(this)
    }

    get base() {
        const noop = () => {}
        const handler = {
            get: (target, name) => {
                if (name == 'api') return routeBuilder(this, this._base)
                this._base = name
                return new Proxy(noop, handler)
            },
        }
        return new Proxy(noop, handler)
    }

    getAuth() {
        const token =
            this.client.token == null
                ? this.client.accessToken
                : this.client.token
        if (token) return token
        throw new Error('TOKEN_MISSING')
    }

    get cdn() {
        return Endpoints.CDN(this.client.options.http.cdn)
    }

    request(method, url, options = {}, base) {
        const apiRequest = new APIRequest(this, method, url, options, base)
        let handler = this.handlers.get(apiRequest.route)

        if (!handler) {
            handler = new RequestHandler(this)
            this.handlers.set(apiRequest.route, handler)
        }

        return handler.push(apiRequest)
    }

    get endpoint() {
        return this.client.options.http.api
    }

    set endpoint(endpoint) {
        this.client.options.http.api = endpoint
    }
}

module.exports = RESTManager
