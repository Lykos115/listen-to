'use client'

import { useState } from "react"
import ShareSVG from "./shareSVG"


const ShareLink = () => {

    const [copyStatus, setCopyStatus] = useState(false)

    async function copyToClipboard() {
        await navigator.clipboard.writeText(location.href)

    }

    return(
        <button className="p-4" onClick={copyToClipboard}>
            <ShareSVG />
        </button>
    )

}

export default ShareLink
