module.exports = class ProfileService {
    constructor(client) {
        this.client = client
    }
    async GetUsersFriends(people, settings) {
        if (!people || !Array.isArray(people)) throw new Error('People must be an array of userids')
        if (!settings || !Array.isArray(settings)) throw new Error('Settings must be an array of settings')
        return await this.client.base.profile.api.users.batch.profile.settings.post({
            body: {
                userIds: people,
                settings
            },
            headers: {
                'x-xbl-contract-version': 2,
                'content-type': 'application/json'
            }
        })
    }
    async _GetUserProfilesForSocialGroup(person, settings, socialGroup) {
        if (!settings || !Array.isArray(settings)) throw new Error('Settings must be an array of settings')
        return await this.client.base.profile.api.users[person].profile.settings.people[socialGroup].get({
            query: {
                settings: settings.join(',')
            },
            headers: {
                'x-xbl-contract-version': 2,
                'content-type': 'application/json'
            }
        })
    }
    async GetUserFriends(userId, settings, socialGroup = "people") {
        return await this._GetUserProfilesForSocialGroup('xuid(' + userId + ')', settings, socialGroup)
    }
    async GetUserByXuidFriends(userId, settings, socialGroup = "people") {
        return await this._GetUserProfilesForSocialGroup('xuid(' + userId + ')', settings, socialGroup)
    }
    async GetUserByGamertagFriends(gamertag, settings, socialGroup = "people") {
        return await this._GetUserProfilesForSocialGroup('gt(' + gamertag + ')', settings, socialGroup)
    }
    async GetMyFriends(settings, socialGroup = "people") {
        return await this._GetUserProfilesForSocialGroup('me', settings, socialGroup)
    }
}