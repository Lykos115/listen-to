import Search from "../_components/search";
import { auth, clerkClient } from "@clerk/nextjs"
import { api } from "@/trpc/server";
import QueueUpButton from "../_components/queueButton";

export const dynamic = 'force-dynamic'
 

async function getData(searchString:string, queueID:string){

    if(!searchString) return {}

    const {userId} = auth();

    if(userId){
        const slug = userId.split('_')[1]
        const playlistExist = await api.playlist.hasPlaylist.query({userId: slug})
        if(!playlistExist){
            await api.playlist.create.mutate({userId: slug, playlistName: "listen to"})
        }
    }



    const  {signal} = new AbortController()

    const userID = `user_${queueID}`
    const authInfo = await clerkClient.users.getUserOauthAccessToken(userID as string, "oauth_spotify")
    const accessToken = await authInfo.find(object => object.provider == "oauth_spotify")?.token

    const urlify = searchString?.split(' ').join('%20')

    const results = await fetch(`https://api.spotify.com/v1/search?q=${urlify}&type=track`, {
        signal,
        cache: 'no-store',
        headers:{
            Authorization: `Bearer ${accessToken}`,
        }
    }).then(res => res.json())
    
    const tracks = results.tracks.items

    return {tracks}
    
}


export default async function UsersPage({searchParams, params} : {searchParams: any, params: {usersID: string}}) {
    const {tracks} = await getData(searchParams.search, params.usersID)

  return (
    <main className="flex min-h-screen p-8 bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white justify-center">
        
        <div className="container flex flex-col items-center">
            <Search />
            <div className="flex flex-col items-center justify-center md:flex-row md:flex-wrap">
               {
                    tracks && tracks.map((track:any) => {
                        return(
                            <div className="flex flex-row p-4 items-center justify-between md:flex-col" key={track.id}>
                                <img src={track.album.images[1].url} 
                                    className="md:h-max md:w-fit w-16 h-16"
                                    height={track.album.images[1].height} 
                                    width={track.album.images[1].width}/>
                                <div className="w-2/4 justify-self-start">{track.name}</div>
                                <QueueUpButton id={params.usersID} uri={track.uri} userSlug={params.usersID} />
                            </div>
                        )
                    })
                }
            </div>
        </div>
    </main>
  );
}
