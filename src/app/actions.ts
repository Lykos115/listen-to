'use server'
import { db } from "@/server/db";
import { auth } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs/server";

export async function createPlaylist(playlistName: string, id: string){
    const {userId} = auth()

    const temp = await clerkClient.users.getUser(userId as string)
    const spotifyUsername = temp.externalAccounts[0].externalId

    const authInfo = await clerkClient.users.getUserOauthAccessToken(userId as string, "oauth_spotify")
    const accessToken = authInfo[0].token


    const results = await fetch(`https://api.spotify.com/v1/users/${spotifyUsername}/playlists`, {
        headers:{
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            "name": playlistName,
            "description": "test description",
            "public": false

        }),
        method:'POST'
    }).then(res => res.json())

    const playlistID = results.id 

    await db.insert(users).values({userSlug: id, playlistId: playlistID})


    //await fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
    //    headers:{
    //        Authorization: `Bearer ${accessToken}`
    //    },
    //    body: JSON.stringify({
    //        "uris": songUris,
    //        "position": 0

    //    }),
    //    method:'POST'
    //})
}


//export async function queueUp(id: string, uri:string){
//    const authInfo = await clerkClient.users.getUserOauthAccessToken(`user_${id}` as string, "oauth_spotify")
//    const accessToken = authInfo[0].token
//    //console.log(accessToken)
//    const urify = uri.split(':').join('%3A')
//
//    const res = await fetch(`https://api.spotify.com/v1/me/player/queue?uri=${urify}`, {
//        headers:{
//            Authorization: `Bearer ${accessToken}`,
//        },
//        method: 'POST'
//    })
//    //.catch((error) => console.log(error))
//    //.then(res => res.json())
//
//    
//
//
//    console.log(await res.json())
//
//
//
//
//}

