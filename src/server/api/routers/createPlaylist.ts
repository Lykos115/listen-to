import { auth } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { inList, pendingSong, users } from "@/server/db/schema";
import { eq, exists } from "drizzle-orm"
import type { CreatePlaylist } from "spotifyTypes";

export const playlistRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ userId: z.string(), playlistName: z.string()}))
    .mutation(async ({ ctx, input }) => {
        const {userId} = auth()

        const temp = await clerkClient.users.getUser(userId!)

        const {externalAccounts} = temp
        const spotifyUsername = externalAccounts[0]?.externalId
//.externalAccounts[0].externalId

        const authInfo = await clerkClient.users.getUserOauthAccessToken(userId! , "oauth_spotify")
        const accessToken = authInfo[0]?.token


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
        }).then((res ) => res.json()) as CreatePlaylist

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
        .input(z.object({userId: z.string(), songURI: z.string()}))
        .query(async ({ctx,input}) => {

            const query = ctx.db.select({id:users.userSlug}).from(users).where(eq(users.userSlug, input.userId))
            const songInPlaylist = await ctx.db.select().from(inList).where(exists(query))
            const songInPendinglist = await ctx.db.select().from(pendingSong).where(exists(query))

            return songInPendinglist.some(el => el.songURI === input.songURI) || songInPlaylist.some(el => el.songURI === input.songURI)
        }),
    addToPlaylist: publicProcedure
        .input(z.object({songId: z.string(), songURI: z.string(), userSlug: z.string()}))
        .mutation(async ({ctx, input}) => {

            const {userId} = auth()

            if(!userId){
                await ctx.db.insert(pendingSong).values({songURI: input.songURI, userSlug: input.userSlug})
                return "song will be added when user auths"
            }


            const authInfo = await clerkClient.users.getUserOauthAccessToken(userId , "oauth_spotify")
            const accessToken = authInfo[0]?.token

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
            


            return results.status

        }),
    addPending: publicProcedure
        .input(z.object({userSlug: z.string(), songURI: z.string()}))
        .mutation(async ({ctx,input}) => {

            const {userId} = auth()

            const authInfo = await clerkClient.users.getUserOauthAccessToken(userId!, "oauth_spotify")
            const accessToken = authInfo[0]?.token

            const playlistID = await ctx.db.select({playlistId: users.playlistId}).from(users).where(eq(users.userSlug, input.userSlug))
            const uriFormat= input.songURI.split(':').join('%3A')
            const requestURL = `https://api.spotify.com/v1/playlists/${playlistID[0]?.playlistId}/tracks?uris=${uriFormat}`

            const results = await fetch(requestURL, {
                headers:{
                    Authorization: `Bearer ${accessToken}`,
                },
                method:'POST'
            })

            return results.status
        })
});
