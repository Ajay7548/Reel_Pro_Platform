//user auth
import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "./db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { use } from "react";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Missing email or password')
                }
                try {
                    await connectToDatabase()
                    const user = await User.findOne({ email: credentials.email })
                    if (!user) {
                        throw new Error("No user found")
                    }
                    const isValidPassword = await bcrypt.compare(
                        credentials.password,
                        user.password
                    )
                    if (!isValidPassword) {
                        throw new Error("Invalid PAssword")
                    }
                    return {
                        id: user._idToString(),
                        email: user.email
                    }
                } catch (error) {
                    throw error
                }
            }
        })
    ],
    callbacks:{
        async jwt({token,user}){
            if(user){
                token.id =user.id
            }
            return token
        },
        async session({session,token}){
            if(session.user){
                session.user.id =token.id as string
            }
            return session
        }
    },
    pages:{
        signIn:"/login",
        error:"/login"
    },
    session:{
        strategy:"jwt",
        maxAge:30*24 *60 *60
    },
    secret:process.env.NEXTAUTH_SECRET
}