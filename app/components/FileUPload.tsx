'use client'

import React, { useState,useRef } from "react";
import { IKUpload } from "imagekitio-next";
import { Loader2 } from "lucide-react"
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";


interface FileUploadProps {
    onSuccess: (res: IKUploadResponse) => void;
    onProgress?: (progress: number) => void;
    fileType?: "image" | "video"
}

export default function FileUpload({ onSuccess, onProgress,
    fileType = 'image'
}: FileUploadProps) {
    const ikUploadRefTest = useRef(null);
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const onError = (err: { message: string }) => {
        console.log("Error", err);
        setError(err.message)
        setUploading(false)
    };

    const handleSuccess = (response: IKUploadResponse) => {
        console.log("Success", response);
        setUploading(false)
        setError(null)
        onSuccess(response)
    };

    const handleProgress = (event:ProgressEvent) => {
        if(event.lengthComputable && onProgress){
            const percentComplete = (event.loaded / event.total) * 100
            onProgress(Math.round(percentComplete))
        }
    };

    const handleStartUpload = () => {
        setUploading(true)
        setError(null)
    };

    const validateFile = (file:File)=>{
        if(fileType ==='video'){
            if(!file.type.startsWith('video/')){
                setError("plase uplaod a video file")
                return false
            }
            if(file.size > 100* 1024 *1024){
                setError("Video must 100Mb")
                return false
            }
        }
        else{
            const validyType =['image/jpeg','image/png','image/webp',]
            if(!validyType.includes(file.type)){
                setError("Please upload valid (JPEG, PNG, webP)")
                return false
            }
            if(file.size > 5* 1024 *1024){
                setError("Image must be 5Mb")
                return false
            }
        }return false
        
    }
    return (
        <div className="space-y-2">
                <IKUpload
                    fileName={fileType ==="video" ? "video":"image"}
                   
                    useUniqueFileName={true}
                    validateFile={validateFile}
                   
                    onError={onError}
                    onSuccess={handleSuccess}
                    onUploadProgress={handleProgress}
                    onUploadStart={handleStartUpload}
                    folder={fileType ==='video' ? 'video/':"/images" }
                    transformation={{
                        pre: "l-text,i-Imagekit,fs-50,l-end",
                        post: [
                            {
                                type: "transformation",
                                value: "w-100",
                            },
                        ],
                    }}
                    style={{ display: 'none' }} // hide the default input and use the custom upload button
                    ref={ikUploadRefTest}
                />
                {
                    uploading && (
                        <div className="flex items-center gap-2 text-sm text-primary">
                            <Loader2 className="animate-spin w-4 h-4"/>
                            <span>Uploading...</span>
                        </div>
                    )
                }
                {
                    error && (
                        <div className="text-error text-sm">
                            {error}
                        </div>
                    )
                }
            {/* ...other SDK components added previously */}
        </div>
    );
}