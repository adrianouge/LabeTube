import { Video } from "../models/Video";
import { BaseDatabase } from "./BaseDatabase";

export class VideosDatabase extends BaseDatabase {
    public static TABLE_VIDEOS = "videos"

    dbConnection = BaseDatabase.connection

    public async findVideos(): Promise<Video[]> {
        const videosInDB: Video[] = await this.dbConnection(VideosDatabase.TABLE_VIDEOS)

        return videosInDB
    }

    public async checkVideoInDB(id: string) {
        const isVideoInDB: Video[] = await this
            .dbConnection(VideosDatabase.TABLE_VIDEOS)
            .where({ id })
        return isVideoInDB
    }

    public async uploadVideo(newVideo: Video) {
        await this.dbConnection
            .insert(newVideo)
            .into(VideosDatabase.TABLE_VIDEOS)

    }

    public async editVideo(editedVideo: Video) {
        await this.dbConnection(VideosDatabase.TABLE_VIDEOS)
            .update(editedVideo)
            .where({ id: editedVideo.id })
    }

    public async deleteVideo(id: string) {
        await this.dbConnection(VideosDatabase.TABLE_VIDEOS)
            .del()
            .where({ id })
    }
}