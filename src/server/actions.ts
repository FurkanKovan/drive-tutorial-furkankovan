"use server";

import { and, eq } from "drizzle-orm";
import { db } from "./db";
import { files_table, folders_table } from "./db/schema";
import { auth } from "@clerk/nextjs/server";
import { UTApi } from "uploadthing/server";
import { cookies } from "next/headers";
import { DB_MUTATIONS } from "./db/queries";

const utApi = new UTApi();

export async function deleteFile(fileId: number) {
    const session = await auth();
    if (!session.userId) {
        return { error: "Unauthorized" };
    }

    const [file] = await db
        .select()
        .from(files_table)
        .where(
            and(eq(files_table.id, fileId), eq(files_table.ownerId, session.userId)),
        );

    if (!file) {
        return { error: "File not found" };
    }

    const utapiResult = await utApi.deleteFiles([
        // Better solution would be to record folder keys to delete from UploadThing
        file.url.replace("https://utfs.io/folder/", ""),
    ]);

    console.log(utapiResult);

    const dbDeleteResult = await db
        .delete(files_table)
        .where(eq(files_table.id, fileId));

    console.log(dbDeleteResult);

    const c = await cookies();

    c.set("force-refresh", JSON.stringify(Math.random()));

    return { success: true };
}

export async function createFolder(folderName: string, parentId: number) {
    const session = await auth();
    if (!session.userId) {
        return { error: "Unauthorized" };
    }

    if (parentId === -1) {
        return { error: "Folder ID Not Found" }
    }

    await DB_MUTATIONS.createFolder({
        folder: {
            name: folderName,
            parent: parentId,
        },
        userId: session.userId
    });

    const c = await cookies();

    c.set("force-refresh", JSON.stringify(Math.random()));

    return { success: true };
}

export async function renameFolder(folderName: string, folderId: number) {
    const session = await auth();
    if (!session.userId) {
        return { error: "Unauthorized" };
    }

    await DB_MUTATIONS.renameFolder({
        folder: {
            id: folderId,
            name: folderName,
        },
        userId: session.userId
    });

    const c = await cookies();

    c.set("force-refresh", JSON.stringify(Math.random()));

    return { success: true };
}

export async function deleteFolder(folderId: number) {
    const session = await auth();
    if (!session.userId) {
        return { error: "Unauthorized" };
    }

    // Check if folder exists and belongs to the user
    const [folder] = await db
        .select()
        .from(folders_table)
        .where(
            and(eq(folders_table.id, folderId), eq(folders_table.ownerId, session.userId))
        );

    if (!folder) {
        return { error: "Folder not found" };
    }

    // Get all files in this folder
    const files = await db
        .select()
        .from(files_table)
        .where(eq(files_table.parent, folderId));

    // Delete files from external storage
    if (files.length > 0) {
        const fileKeys = files.map(file => file.url.replace("https://utfs.io/folder/", ""));
        const utapiResult = await utApi.deleteFiles(fileKeys);

        console.log(utapiResult);
        // Delete files from database
        const dbDeleteResult = await db.delete(files_table)
            .where(eq(files_table.parent, folderId));
        console.log(dbDeleteResult);
    }

    // Get all subfolders inside this folder (recursive deletion)
    const subfolders = await db
        .select()
        .from(folders_table)
        .where(eq(folders_table.parent, folderId));

    for (const subfolder of subfolders) {
        await deleteFolder(subfolder.id); // Recursively delete subfolders
    }

    // Delete the target folder itself
    const dbDeleteTargerFolderResult = await db.delete(folders_table)
        .where(eq(folders_table.id, folderId));

    console.log(dbDeleteTargerFolderResult);

    // Force refresh UI
    const c = await cookies();
    c.set("force-refresh", JSON.stringify(Math.random()));

    return { success: true };
}
