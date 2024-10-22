import { ErrorWithStatus } from "../../utils/exceptionBuilder";
import supabase from "./instance";

export const generateBucket = (name: string) => {
    // TODO
}

export const updateImage = async (path: string, file: File) => {
    const { data, error } = await supabase.storage.from(process.env.BUCKET_NAME!).update(path, file, {
        contentType: 'image/jpg',
    });

    if (error) {
        throw new ErrorWithStatus('Image failed to update. Please try again');
    }

    return data;

}

export const uploadImage = async (folder: string, file: File) => {
    const uniqueString = btoa(folder + Date.now());
    const { data, error } = await supabase.storage.from(process.env.BUCKET_NAME!).upload(`${folder}/${uniqueString}`, file, {
        upsert: false,
        contentType: 'image/jpeg',
    })


    if (error)
        throw new ErrorWithStatus(error.message, 500, 'Upload Error')

    return data;
}

export const deleteImage = async (path: string) => {
    console.log(path);
    const { data, error } = await supabase.storage.from(process.env.BUCKET_NAME!).remove([path]);

    if (error)
        throw new ErrorWithStatus(error.message, 500, 'Delete Error')

    return data;

}