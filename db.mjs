import dotenv from "dotenv";
dotenv.config()
import mongoose from "mongoose"

const Schema = mongoose.Schema
mongoose.connect(process.env.MONGODB_URI)

export const db = {
    User: userModel(),
    Song: songModel(),
    Room: roomModel()
}

// mongoose models with schema definitions

function userModel(){
    const schema = new Schema({
        username: {type: String, required: true},
        hash: {type: String, required: true},
        // history: historyModel()
    }, {
        timestamps: true
    })

    schema.set('toJSON', {
        virtuals: true
    })

    return mongoose.models.User || mongoose.model('User', schema)
}

function songModel(){
    const schema = new Schema({
        name: {type: String, required: true},
        ytVideoId: {type: String, required: true}
    },{
        timestamps: true
    })

    schema.set('toJSON', {
        virtuals: true,
        versionKey: false,
        transform: function (doc, ret){
            ret.id = ret._id.toString()
            delete ret._id
            delete ret.__v
        }
    })

    return mongoose.models.Song || mongoose.model('Song', schema)
}

function roomModel(){
    const subSchema = new Schema({
        songId: {type: String, required: true},
        songName: {type: String, required: true},
        addedTime: {type: Number, required: true},
        ytVideoId: {type: String, required: true}
    })

    const schema = new Schema({
        name: {type: String, required: true},
        memberNames: {type: [String], required: true},
        songList: {type: [subSchema], required: true}
    }, {
        timestamps: true
    })

    schema.set('toJSON', {
        virtuals: true,
        versionKey: false,
        transform: function (doc, ret){
            ret.id = ret._id.toString()
            delete ret._id
            delete ret.__v
            if (ret.songList.length!=0){
                ret.songList = ret.songList.map((song)=>{
                    return {
                        songId: song.songId,
                        songName: song.songName,
                        addedTime: song.addedTime,
                        id: song._id.toString(),
                        ytVideoId: song.ytVideoId
                    }
                })
            }
        }
    })

    return mongoose.models.Room || mongoose.model('Room', schema)
}

