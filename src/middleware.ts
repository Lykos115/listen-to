import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { NextResponse } from "next/server";
 
// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
//    afterAuth(auth, req, evt){
//
//        if(auth.userId && req.nextUrl.pathname !== '/:usersID'){
//            const userURL = new URL(`/${auth.userId.split('_')[1]}`, req.url)
//            return NextResponse.redirect(userURL)
//        }
//    },
    publicRoutes: ['/:usersID', "/api/trpc/playlist.addToPlaylist"]
});
 
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
 
