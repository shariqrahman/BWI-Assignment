const checkRoles = async (user_admin, user_adminId, req) => {
    console.log(user_admin.role)
    if(user_admin.role == 'user') {
        if(user_admin._id != user_adminId || req.userId != user_adminId) {
            throw new Error('Invalid User or UnAuthorized User!');
        }
        else {
            return user_admin;
        }
    }
    else if(user_admin.role == 'admin') {
        if(user_admin._id != user_adminId) {
            throw new Error('Invalid Admin');
        }
        else {
            return user_admin;
        }
    }
}

module.exports = checkRoles;