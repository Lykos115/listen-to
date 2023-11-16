import Link from "next/link";
import { UserButton, auth } from "@clerk/nextjs";

import { CreatePost } from "@/app/_components/create-post";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";


async function getUserID() {
    const res  = await auth()
    return res.userId

}

export default async function Home() {

    const data = await getUserID()
    console.log(data)

    
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

//async function CrudShowcase() {
//  const latestPost = await api.post.getLatest.query();
//
//  return (
//    <div className="w-full max-w-xs">
//      {latestPost ? (
//        <p className="truncate">Your most recent post: {latestPost.name}</p>
//      ) : (
//        <p>You have no posts yet.</p>
//      )}
//
//      <CreatePost />
//    </div>
//  );
//}
