import express, { Request, Response } from 'express'
import cors from 'cors'
import { BaseDatabase } from './database/BaseDatabase'
import { VideosDatabase } from './database/VideosDatabase'
import { Video } from './models/Video'

const app = express()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
    console.log(`Server running on port ${3003}.`)
})

app.get("/ping", async (req: Request, res: Response) => {
    try { res.status(200).send({ message: "Pong!" }) }

    catch (error) {
        console.log(error)

        if (res.statusCode === 200) { res.status(500) }

        if (error instanceof Error) { res.send(error.message) }

        else { res.send({ message: "Unexpected error occured." }) }
    }
})

app.get("/videos", async (req: Request, res: Response) => {
    try {
        const videosDB = new VideosDatabase()

        const videosInDB = await videosDB.findVideos()

        const mappedVideos: Video[] = videosInDB.map(
            (video: Video) => new Video(
                video.id,
                video.title,
                video.duration
            ))

        console.log(mappedVideos)

        res.status(200).send(mappedVideos)
    }

    catch (error) {
        console.log(error)

        if (res.statusCode === 200) { res.status(500) }

        if (error instanceof Error) { res.send(error.message) }
        else { res.send({ message: "Unexpected error occured." }) }
    }
})

app.post("/videos", async (req: Request, res: Response) => {
    try {
        let { id, title, duration } = req.body
        const videoDatabase = new VideosDatabase()
        const [videoIsInDB] = await videoDatabase.checkVideoInDB(id)

        if (req.body !== undefined) {

            if (videoIsInDB) {
                res.status(400)
                throw new Error("There's a video with this 'id'. Each video must have unique 'id'.")
            }

            else {
                const newVideo = new Video(
                    id,
                    title,
                    duration
                )

                videoDatabase.uploadVideo(newVideo)

                res.status(200).send("Video uploaded successfully.")
            }
        }

        else {
            res.status(400)
            throw new Error("Insert an 'id', 'title' and 'duration' to upload a new video.")
        }
    }

    catch (error) {
        console.log(error)

        if (res.statusCode === 200) { res.status(500) }

        if (error instanceof Error) { res.send(error.message) }

        else { res.send({ message: "Unexpected error occured." }) }
    }
})

app.put('/videos/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const videosDatabase = new VideosDatabase()

        if (id !== ":id") {
            const [videoExists] = await videosDatabase.checkVideoInDB(id)
            console.log(videoExists)

            if (videoExists) {
                const newTitle: string = req.body.newTitle

                const editedVideo = new Video(
                    videoExists.id,
                    newTitle,
                    videoExists.duration
                )

                if (newTitle !== videoExists.title) {

                    videosDatabase.editVideo(editedVideo)

                    res.status(200).send(`Title edited successfully.`)
                }

                else {
                    res.status(400)
                    throw new Error("Video's new title must be different from video's current title.")
                }
            }

            else {
                res.status(400)
                throw new Error("Video with inserted 'id' not found.")
            }
        }

        else {
            res.status(400)
            throw new Error("An 'id' must be inserted to edit a specific video's data.")
        }
    }

    catch (error) {
        console.log(error)

        if (res.statusCode === 200) { res.status(500) }

        if (error instanceof Error) { res.send(error.message) }

        else { res.send({ message: "Unexpected error occured." }) }
    }
})

app.delete("/videos/:id", async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const videoDatabase = new VideosDatabase()

        if (id !== ":id") {
            const [videoExists] = await videoDatabase.checkVideoInDB(id)

            if (videoExists) {
                videoDatabase.deleteVideo(id)

                res.status(200).send("Video deleted successfully.")
            }

            else {
                res.status(400)
                throw new Error("There are no videos with inserted 'id' in the database.")
            }
        }

        else {
            res.status(400)
            throw new Error("An 'id' must be informed to delete a specific video.")
        }
    }

    catch (error) {
        console.log(error)

        if (res.statusCode === 200) { res.status(500) }

        if (error instanceof Error) { res.send(error.message) }

        else { res.send({ message: "Unexpected error occured." }) }
    }
})