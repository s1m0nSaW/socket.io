let users = [];

export const findUser = ( user ) => {
    const userName = user.userId;
    const userRoom = user.gameId;

    return users.find((u) => u.userId === userName && u.gameId === userRoom);
}

export const addUser = ( user ) => {
    const isExist = findUser(user);

    !isExist && users.push(user);
    
    const currentUser = isExist || user;

    return { isExist: !!isExist, user: currentUser};
};

export const getRoomUsers = ( room ) => users.filter((u) => u.room === room)

export const removeUser = ( user ) => {
    const found = findUser(user);

    if(found) {
        users = users.filter(
            ({ room, name }) => room === found.room && name !== found.name
        );
    }

    return found;
}