'use client'

import ShareSVG from "./shareSVG"


const ShareLink = () => {

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
