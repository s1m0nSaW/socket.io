import UserModel from "../models/User.js";
import ComplimentModel from "../models/Compliment.js";

export const getUser = async ( io, vkid ) => {
    try {
        const user = await UserModel.findOne({ vkid: vkid });
        const date = +new Date();
        if(user){
            const compliments = await ComplimentModel.find({ to: user._id });

            if(compliments) {
                io.to(vkid).emit("compliments", { data: { compliments } })
            }

            if(date > user.rsvpDate){
                user.rsvpStatus = true;
            }
            if(date > user.adsDate){
                user.adsStatus = true;
            }
    
            await user.save();

            io.to(vkid).emit("updatedUser", { data: { user } })
        } else {
            io.to(vkid).emit("updatedUser", { data: { user:{ firstName:'$2b$10$T72I44FcHBIcS81xrkFY3e2TJwaaTVLFp7d5wuddKeVEuc2.3WR0G' } } })
        }

    } catch (err) {
        console.log(err);
        io.to(vkid).emit("error", { data: "Что-то пошло не так", err });
    }
};

export const register = async ( io, vkid, status, firstName, avaUrl ) => {
    try {
        const doc = new UserModel({
            vkid: vkid,
            status: status,
            firstName: firstName,
            avaUrl: avaUrl,
        });
    
        const user = await doc.save();

        if(user){
            io.to(vkid).emit("updatedUser", { data: { user } })
        }
        
    } catch (err) {
        console.log(err);
        io.to(vkid).emit("error", { data: "Что-то пошло не так", err });
    }
};

export const getFreeRsvp = async ( io, vkid ) => {
    const date = +new Date()
    try {
        const user = await UserModel.findOne({ vkid: vkid });

        if(user?.rsvpStatus === true){
            if (user.status === 'sponsor') {
                user.rsvp += 10;
            } else if (user.status === 'promoter') {
                user.rsvp += 3;
            } else if (user.status === 'none') {
                user.rsvp += 1;
            }
            user.rsvpDate = date + 86400000;
            user.rsvpStatus = false;
            await user.save();
            io.to(vkid).emit("updatedUser", { data: { user } })
        } 
    } catch (err) {
        console.log(err);
        io.to(vkid).emit("error", { data: "Что-то пошло не так", err });
    }
};

export const checkPromoter = async ( io, vkid ) => {
    try {
        const user = await UserModel.findOne({ vkid: vkid });
        if(user){
            user.status = 'none';
            user.dailyRsvp = 1;
            await user.save();
            io.to(vkid).emit("updatedUser", { data: { user } })
        } 
    } catch (err) {
        console.log(err);
        io.to(vkid).emit("error", { data: "Что-то пошло не так", err });
    }
};

export const setPromoter = async ( io, vkid ) => {
    try {
        const user = await UserModel.findOne({ vkid: vkid });
        if(user){
            user.status = 'promoter';
            user.dailyRsvp = 3;
            await user.save();
            io.to(vkid).emit("updatedUser", { data: { user } })
        } 
    } catch (err) {
        console.log(err);
        io.to(vkid).emit("error", { data: "Что-то пошло не так", err });
    }
};

export const getCompliment = async ( io, vkid, friendId ) => {
    try {
        const compliments = await ComplimentModel.find({ to: friendId });

        if(compliments) {
            io.to(vkid).emit("userCompliments", { data: { compliments } })
        }
    } catch (err) {
        console.log(err);
    }
};