const RestManager = require('./rest/RESTManager')
const ProfileService = require('./Objects/Profile/ProfileService')
module.exports = class Client {
    public options: any;
    public token: string;
    public rest: RestManager;
    
    constructor(token) {
      
        this.options = {
            restGlobalRateLimit: 0,
            restRequestTimeout: 10000,
            http: {
                headers: {},
                agent: {},
            },
        }
        this.token = token
        this.rest = new RestManager(this)
        this.profile = new ProfileService(this)
    }
    get base() {
        return this.rest.base
    }
}
