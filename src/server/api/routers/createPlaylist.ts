import { auth } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { inList, pendingSong, users } from "@/server/db/schema";
import { eq, and, isNotNull, exists } from "drizzle-orm"

export const playlistRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ userId: z.string(), playlistName: z.string()}))
    .mutation(async ({ ctx, input }) => {
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
                "name": input.playlistName,
                "description": "test description",
                "public": false

            }),
            method:'POST'
        }).then(res => res.json())

        const playlistID = results.id 

      await ctx.db.insert(users).values({
        userSlug: input.userId,
        playlistId: playlistID

      });
    }),
    getAll: publicProcedure
        .input(z.object({userId: z.string()}))
        .query(async ({ ctx, input }) => {
            const result = await ctx.db.select().from(users).where(eq(users.userSlug, input.userId))
            return result
        }),
    hasPlaylist: publicProcedure
        .input(z.object({userId: z.string()}))
        .query(async ({ ctx, input }) => {
            const result = await ctx.db.select().from(users).where(eq(users.userSlug, input.userId))

            return result.length === 0 ? false : true

        }),
    songInList: publicProcedure
        .input(z.object({userId: z.string()}))
        .query(async ({ctx,input}) => {

            const query = ctx.db.select({id:users.userSlug}).from(users).where(eq(users.userSlug, input.userId))
            const songInPlaylist = await ctx.db.select().from(inList).where(exists(query))
            const songInPendinglist = await ctx.db.select().from(pendingSong).where(exists(query))

            const songBoolean = songInPlaylist.length === 0 && songInPendinglist.length === 0

            return songBoolean ? 'Song not in playlists' : 'Song in Playlist'
        }),
    addToPlaylist: publicProcedure
        .input(z.object({songId: z.string(), songURI: z.string(), userSlug: z.string()}))
        .mutation(async ({ctx, input}) => {
            //const songInList = await ctx.db.select().from(inList).where(
            //        eq(inList.userSlug, input.userSlug),
            //)

            //const songInPending = await ctx.db.select().from(pendingSong).where(
            //            isNotNull(inList.userSlug),
            //)

            //if(songInList.find(el => el === input.songURI) || songInPending.find(el => el === input.songURI)){
            //    return "song already in list"
            //}

            const {userId} = auth()

            if(!userId){
                await ctx.db.insert(pendingSong).values({songURI: input.songURI, userSlug: input.userSlug})
                return "song will be added when user auths"
            }


            const temp = await clerkClient.users.getUser(userId as string)
            const spotifyUsername = temp.externalAccounts[0].externalId

            const authInfo = await clerkClient.users.getUserOauthAccessToken(userId as string, "oauth_spotify")
            const accessToken = authInfo[0].token

            const playlistID = await ctx.db.select({playlistId: users.playlistId}).from(users).where(eq(users.userSlug, input.userSlug))
            await ctx.db.insert(inList).values({userSlug:input.userSlug, songURI: input.songURI})
            const uriFormat= input.songURI.split(':').join('%3A')
            const requestURL = `https://api.spotify.com/v1/playlists/${playlistID[0]?.playlistId}/tracks?uris=${uriFormat}`

            const results = await fetch(requestURL, {
                headers:{
                    Authorization: `Bearer ${accessToken}`,
                },
                method:'POST'
            })
            .then(res => res.json())


            return results

        }),
    addPending: publicProcedure
        .input(z.object({userSlug: z.string()}))
        .mutation(async ({ctx}) => {

            const {userId} = auth()

            const authInfo = await clerkClient.users.getUserOauthAccessToken(userId as string, "oauth_spotify")
            const accessToken = authInfo[0].token

            const playlistID = await ctx.db.select({playlistId: users.playlistId}).from(users).where(eq(users.userSlug, input.userSlug))
            const uriFormat= input.songURI.split(':').join('%3A')
            const requestURL = `https://api.spotify.com/v1/playlists/${playlistID[0]?.playlistId}/tracks?uris=${uriFormat}`

            const results = await fetch(requestURL, {
                headers:{
                    Authorization: `Bearer ${accessToken}`,
                },
                method:'POST'
            })
            .then(res => res.json())
        })
});
