// Backend - User Registration API

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";


export async function POST(request: NextRequest) {

    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: "Email is already register" },
                { status: 400 }
            );
        }

        await User.create({
            email,
            password,
        });

        return NextResponse.json(
            { message: "User Register Sucessfully" },
            { status: 201 }
        )
    } catch (error) {
        console.log("Resgisteration",error);
        
        return NextResponse.json(
            {error:"failed to register"},
            {status:500}
        )
    }
}


