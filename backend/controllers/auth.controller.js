import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import generateTokenAndSendCookie from "../util/generateToken.js";

export const createUser = async (req, res) => {
    try {
        const { firstName, lastName, username, password, confirmPassword, gender } = req.body;
        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords don't match" });
        }

        const user = await User.findOne({ username })
        if (user) {
            return res.status(400).json({ error: "Username already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // API for default profile pic 
        const boyProfPic = `https://avatar.iran.liara.run/public/boy?username=${firstName}+${lastName}`;
        const girlProfPic = `https://avatar.iran.liara.run/public/girl?username=${firstName}+${lastName}`;

        // Create new user
        const newUser = new User(
            {
                firstName,
                lastName,
                username,
                password: hashedPassword,
                gender,
                profilePic: gender === 'Male' ? boyProfPic : girlProfPic
            }
        )

        // Save user
        await newUser.save();

        // Generate token and put it in cookie
        generateTokenAndSendCookie(newUser.id, res);

        console.log('User saved successfully')

        return res.status(201).json({
            _id: newUser.id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            username: newUser.username,
            gender: newUser.gender,
        })

    } catch (error) {
        console.log(`Error in create user ${error}`);
        res.status(500).json({ error: `Some error occured` });
    }

};
export const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Username/Password not given" });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: "Invalid Username/Password" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid Username/Password" });
        }

        generateTokenAndSendCookie(user.id, res);

        return res.status(200).json({
            _id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            gender: user.gender,
        });
        
    } catch (error) {
        console.log(`Error in loginUser ${error}`);
        res.status(500).json({ error: `Some error occured` });
    }
};
export const logoutUser = (req, res) => {
    try {
        res.cookie('jwt', "", { maxAge: 0 }).json({message:'Logged out successfully'});

    } catch (error) {
        console.log(`Error in loginUser ${error}`);
        res.status(500).json({ error: `Some error occured` });
    }
};
