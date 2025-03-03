
//File uploading using Imagekitimport ImageKit from "imagekit"
import { NextResponse } from "next/server";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT!,
});

export async function GET() {

    try {
        const authParamter = imagekit.getAuthenticationParameters
        return NextResponse.json((authParamter));
    } catch (error) {
        return NextResponse.json(
            {error:"ImagitKit aut failed"},
            {status:500}
        )
    }
}