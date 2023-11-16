import { UserButton, auth } from "@clerk/nextjs";

import { redirect } from "next/navigation";


async function getUserID() {
    const res  = await auth()
    return res.userId

}

export default async function Home() {

    const data = await getUserID()

    
    if(data){
        const slug = data.split('_')[1]
        redirect(`/${slug}`)
    }
    
    return (
        <main className="flex min-h-screen flex-row p-8 bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
            <UserButton afterSignOutUrl="/" />
            <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
            </div>
        </main>
    );
}
