'use client'

import { api } from '@/trpc/react'
import { toast } from 'sonner'


const QueueUpButton = ({id, uri, userSlug}: {id: string, uri: string, userSlug: string}) => {
    const addMutation = api.playlist.addToPlaylist.useMutation({
        onSuccess: () => {
            toast("successfull request")
            console.log("works")
        },
        onError: () => {
            console.log("SOMETHING WENT WRONG")
        }

    })

    return <button className="bg-gray-400 rounded-2xl p-2" onClick={() => addMutation.mutate({songURI: uri, songId: id, userSlug: userSlug})}>queue song</button>
}

export default QueueUpButton
