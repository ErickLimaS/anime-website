import mongoose from "mongoose";

const userSchema = new mongoose.Schema(

    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        avatarImg: { type: String, required: true },
        createdAt: { type: Date },
        showAdultContent: {type: Boolean},
        mediaAdded: [{

            addedAt: { type: Date },
            updatedAt: { type: Date },
            id: { type: Number },
            idGoGoAnime: { type: String },
            primaryColor: { type: String },
            fullTitle: { type: String },
            nativeTitle: { type: String },
            coverImg: { type: String },
            bannerImg: { type: String },
            format: { type: String },
            type: { type: String },
            status: { type: String },
            isAdult: { type: Boolean },
            fromGoGoAnime: { type: Boolean },

        }],
        alreadyWatched: [{

            addedAt: { type: Date },
            updatedAt: { type: Date },
            id: { type: Number },
            idGoGoAnime: { type: String },
            fullTitle: { type: String },
            nativeTitle: { type: String },
            coverImg: {type: String},
            bannerImg: {type: String},
            primaryColor: {type: String},
            format: { type: String },
            type: { type: String },
            status: { type: String },
            isAdult: { type: Boolean },
            fromGoGoAnime: { type: Boolean }

        }],
        episodesAlreadyWatched: [{

            addedAt: { type: Date },
            id: { type: Number },
            idGoGoAnime: { type: String },
            fullTitle: { type: String },
            nativeTitle: { type: String },
            coverImg: { type: String },
            bannerImg: { type: String },
            format: { type: String },
            type: { type: String },
            status: { type: String },
            isAdult: { type: Boolean },
            fromGoGoAnime: { type: Boolean },
            episodes: [{
                episodeId: { type: String },
                episodeName: { type: String },
                originSite: { type: String },
                thumbnail: { type: String },
            }]
        }],
        episodesBookmarked: [{
            addedAt: { type: Date },
            id: { type: Number },
            idGoGoAnime: { type: String },
            fullTitle: { type: String },
            nativeTitle: { type: String },
            coverImg: { type: String },
            format: { type: String },
            type: { type: String },
            status: { type: String },
            isAdult: { type: Boolean },
            fromGoGoAnime: { type: Boolean },
            episodes: [{
                episodeId: { type: String },
                episodeName: { type: String },
                originSite: { type: String },
                thumbnail: { type: String },
                title: { type: String },
            }]
        }]

    }

)

const User = mongoose.model('User', userSchema)

export default User;