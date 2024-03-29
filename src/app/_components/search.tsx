'use client'
import { useRouter, usePathname } from "next/navigation"
import { type ChangeEvent, useState, useTransition } from "react"
import ShareLink from "./shareLink"



const Search = () => {

    const router = useRouter()
    const [userInput, setUserInput] = useState("")
    const pathname = usePathname()

    const [, startTransition] = useTransition()

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        setUserInput(value)
    }


    const handleOnClick = () => {

        const params = new URLSearchParams(window.location.search)
        if (userInput !== "") {
            params.set("search",userInput)
        }else{
            params.delete("search")
        }
        params.delete("page")

        startTransition(() => {
            router.replace(`${pathname}?${params.toString()}`)
        })
    }
    

    return(
        <div className="flex flex-row w-screen justify-center items-center">
            <input className="text-gray-900 w-56 m-4 self-center" type="text" value={userInput} placeholder="Search track" onChange={handleInputChange} />
            <button className="bg-gray-400 w-24 h-8 self-center rounded-full" onClick={handleOnClick}> Search </button>
            <ShareLink />
        </div>
    )

}

export default Search
