import mongoose from "mongoose";

const StatSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now, // Установим значение по умолчанию как текущую дату
        unique: true, // Убедимся, что объекты создаются только один раз в день
    },
    newUsers: [String], // Массив id пользователей которые пригласили, если не пригласили то вместо id 'none'
    newGames: [String], // Массив id пользователей которые создали игру
    payments: [Number], // Массив оплаченных сумм
},{
    timestamps:true,
},
);

export default mongoose.model('Stat', StatSchema);