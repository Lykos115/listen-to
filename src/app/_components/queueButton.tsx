'use client'

import { api } from '@/trpc/react'
import { toast } from 'sonner'

const QueueUpButton = ({id, uri, userSlug}: {id: string, uri: string, userSlug: string}) => {
    const addMutation = api.playlist.addToPlaylist.useMutation({
        onSuccess: () => {
            toast("successfull request")
        },
        onError: () => {
            toast("SOMETHING WENT WRONG")
        }

    })

    const checkList = api.playlist.songInList.useQuery(
        {userId: userSlug, songURI: uri},
        {enabled: false}
    )

    const checker = async () => {
        const res = await checkList.refetch()

        if(!res.data) {
            addMutation.mutate({songId: id, songURI: uri, userSlug: userSlug})
        }else{
            toast("Song already in playlist")
        }

    }


    return <button className="bg-gray-400 rounded-2xl p-2" onClick={checker}>add song</button>
}

export default QueueUpButton
