const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Model = require('../model/model');

class Controller {
    signup = async (req, res) => {
        try {
            const { email, phoneNumber, name, password, role } = req.body;

            if (!email || !phoneNumber) {
                return res.status(400).json({ message: `Email or Phone Number is Required` });
            }

            const isAlreadyExists = await Model.findOne({ $or: [{ email }, { phoneNumber }] });

            if (isAlreadyExists) {
                return res.status(400).json({ message: `User or Admin Already exists` });
            }
            const encryptedPassword = await bcrypt.hash(password, 10);

            await Model.create({
                email,
                phoneNumber,
                name,
                profileImage: '/uploads/' + req.file.filename,
                password: encryptedPassword,
                role
            })
            res.status(201).json({ message: `Successfully SignUp` });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    login = async (req, res) => {
        try {
            const { email, phoneNumber, password } = req.body;

            if (!email || !phoneNumber && !password) {
                return res.status(400).json({ message: `Email or Phone Number and Password are Required` });
            }

            const user = await Model.findOne({ $or: [{ email }, { phoneNumber }] });

            if (!user) {
                return res.status(200).json({ message: `Invalid email or phone number` });
            }

            const isPasswordMatch = await bcrypt.compare(password, user.password);

            if (isPasswordMatch) {
                const token = jwt.sign({
                    userId: user._id,
                    email: user.email,
                    phoneNumber: user.phoneNumber
                },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' });

                req.session.isLoggedIn = true;
                req.session.user = user;
                req.session.token = token;
                await req.session.save();
                return res.status(200).json({ User: req.session.user, Token: token });
            }
            return res.status(401).json({ message: `Invalid Password ` });
        }
        catch (error) {
            res.status(500).json(error);
        }
    }

    userProfile = async (req, res) => {
        try {
            const adminId = req.params.adminId;
            const userId = req.params.userId;

            const admin = await Model.findOne({ _id: adminId, role: 'admin' });

            const user = await Model.findOne({ _id: userId, role: 'user' });

            if (admin || user) {
                if (admin) {
                    return res.status(200).json({ UserProfile1: user });
                }
                else if (user) {
                     if (req.userId != userId) {
                        return res.status(403).json({ message: `UnAuthorized User!` });
                    }
                    return res.status(200).json({ UserProfile2: user });
                }
            }
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    adminProfile = async (req, res) => {
        try {
            const adminId = req.params.adminId;

            const admin = await Model.findById(adminId);

            if (admin) {
                return res.status(200).json({ AdminProfile: admin });
            }
            return res.status(403).json({ message: `Invalid Id` })
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    users = async (req, res) => {
        try {
            const adminId = req.params.adminId;

            const admin = await Model.findOne({ _id: adminId, role: 'admin' });

            if (admin) {
                const users = await Model.find({ role: 'user' });
                return res.status(200).json({ count: users.length, Users: users });
            }
            return res.status(403).json({ message: 'Access Denied' });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    upadateUserProfile = async (req, res) => {
        try {
            const adminId = req.params.adminId;
            const userId = req.params.userId;

            if(!(adminId || userId)) {
                return res.status(400).json({ message: `Id required in params`});
            }

            const admin = await Model.findOne({ _id: adminId, role: 'admin' });

            const user = await Model.findOne({ _id: userId, role: 'user' });

            let updatedData = {};

            if (req.body.name) {
                updatedData.name = req.body.name;
            }

            if (req.file) {
                updatedData.profileImage = '/uploads/' + req.file.filename;
            }

            if(!updatedData.name && !updatedData.profileImage) {
                return res.status(400).json({ message: `Name or Profile Image is required for Update`})
            }

            if (admin || user) {
                if (admin) {
                    const updatedUser = await Model.findByIdAndUpdate({ _id: userId }, { $set: updatedData }, { new: true });
                    return res.status(200).json({ UserProfile1: updatedUser });
                }
                else if (user) {
                    if (req.userId != userId) {
                        return res.status(403).json({ message: `UnAuthorized User!` });
                    }
                    const updatedUser = await Model.findByIdAndUpdate({ _id: userId }, { $set: updatedData }, { new: true });
                    return res.status(200).json({ UserProfile2: updatedUser });
                }
            }
            return res.status(403).json({ message: `Access Denied` });
        }
        catch (error) {
            res.status(500).json({ message: error });
        }
    }


    deleteUserProfile = async (req, res) => {
        try {
            const adminId = req.params.adminId;
            const userId = req.params.userId;

            if(!(adminId || userId)) {
                return res.status(400).json({ message: `Id required in params`});
            }

            const admin = await Model.findOne({ _id: adminId, role: 'admin' });

            const user = await Model.findOne({ _id: userId, role: 'user' });

            if (admin || user) {
                if (admin) {
                    await Model.findByIdAndDelete(userId);
                    return res.status(200).json({ message: `User Deleted` });
                }
                else if (user) {
                    if (req.userId != userId) {
                        return res.status(403).json({ message: `UnAuthorized User` });
                    }
                    await Model.findByIdAndDelete(userId);
                    return res.status(200).json({ message: `User Deleted` });
                }
            }
            return res.status(403).json({ message: 'Access Denied' });
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }


    logout = async (req, res) => {
        try {
            await new Promise((resolve, reject) => {
                req.session.destroy(err => {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                });
            });
            return res.status(200).json({ message: `Session Destroy` });
        }
        catch (error) {
            res.status(500).json({ error });
        }
    }
}

module.exports = new Controller();