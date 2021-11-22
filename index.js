const Client = require('./Client')
const {Settings} = require('./Constants')
const { authenticate, xbl, live } = require('@xboxreplay/xboxlive-auth');
(async function() {

//axios.get('https://clubhub.xboxlive.com:443/clubs/Ids()/')
  const authWithCustomRP = await authenticate(process.env.email, process.env.password);
    const token = `XBL3.0 x=${authWithCustomRP.user_hash};${authWithCustomRP.xsts_token}`
const client = new Client(token)
  console.dir((await client.profile.GetMyFriends(Settings.ALL)).profileUsers[0])
})()