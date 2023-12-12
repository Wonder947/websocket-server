import { db } from "./db.mjs";

export {
    userJoinRoom
}

// this function helps a user enter room, given userId and roomId
// if the userId is already in the room, do nothing
// else, add the userId and name to the room's memberNames
// if updated the room, return the updated memberNames
// else return null
const userJoinRoom = async (uid, rid)=>{
    const roomDoc = await db.Room.findById(rid)
    const userDoc = await db.User.findById(uid)
    const user = await userDoc.toJSON()
    const userName = user.username
    const isInRoom = roomDoc.memberNames.includes(userName)
    if (!isInRoom){
        // add it to the room and return the new memberNames
        roomDoc.memberNames.push(userName)
        const result = await roomDoc.save()
        console.log("new user:", userName, "entered room:", rid, 'result:', result)
        return roomDoc.memberNames
    }
    return null
}

