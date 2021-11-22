/**
  * @typedef AchievementsByTitleIdQuery
  * @type {Object}
  * @property {Number} [skipItems]	- Return items beginning after the given number of items. For example, skipItems="3" will retrieve items beginning with the fourth item retrieved.
  * @property {String} [continuationToken]	- Return the items starting at the given continuation token.
  * @property {Number} [maxItems] - Maximum number of items to return from the collection, which can be combined with skipItems and continuationToken to return a range of items. The service may provide a default value if maxItems is not present, and may return fewer than maxItems, even if the last page of results has not yet been returned.
  * @property {String} [titleId]	- A filter for the returned results. Accepts one or more comma-delimited, decimal title identifiers.
  * @property {Boolean} [unlockedOnly] -	Filter for the returned results. If set to true, will only return the achievements unlocked for the user. Defaults to false.
  * @property {Boolean} [possibleOnly]	Filter for the returned results. If set to true, will return all possible results but not unlocked metadata - just the achievement information from XMS. Defaults to false.
  * @property {String} [types]	- A filter for the returned results. Can be "Persistent" or "Challenge". Default is all supported types.
  * @property {String} [orderBy] -	Specifies the order in which to return the results. Can be "Unordered", "Title", "UnlockTime", or "EndingSoon". The default is "Unordered".
  **/





module.exports = class AchievementsService {
  constructor(client) {
    this.client = client
  }
  async GetAchievement(xuid, scid, achievementId) {
    //GET https://achievements.xboxlive.com/users/xuid({xuid})/achievements/{scid}/{achievementId}
    return await this.client.base.achievements.api.users['xuid('+xuid+')'].achievements[scid][achievementId].get()
  }

  /**
  * @param {Number} Xuid - The xuid of the user
  * @param {AchievementsByTitleIdQuery} [query] - The query paramaters
  **/
  async GetAchievementsForTitleId(xuid, query={}) {
    // GET https://achievements.xboxlive.com/users/xuid({xuid})/achievements
    
    return await this.client.base.achievements.api.users['xuid('+xuid+')'].achievements.get({
      query
    })
  }
  async UpdateAchievement(xuid, scid, titleId, achievementId, percentComplete) {
     // POST https://achievements.xboxlive.com/users/xuid({xuid})/achievements/{scid}/update
    return await this.client.base.achievements.api.users['xuid('+xuid+')')].achievements[scid].update.post({
      body: {
    action: "progressUpdate",
    serviceConfigurationId: scid,
      titleId: titleId,
      userId: xuid,
      achievements: [
      {
        id: achievementId,
        percentComplete
      }
      ]
      }
    })
  }
}