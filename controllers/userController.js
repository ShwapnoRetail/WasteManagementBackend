const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
// const LogInfo = require("../models/LogInfoModel")

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "9999 years" });
};

// login user
const loginUser = async (req, res) => {
  const { email_id, password } = req.body;

  try {
    const user = await User.login(email_id, password);
    // Update the is_logged_in status to true for the logged-in user

    // Log the login event
    const currentDate = new Date();
    const today = user.loginLogoutHistory.find(
      (day) => day.date.toDateString() === currentDate.toDateString()
    );

    if (today) {
      today.events.push({ loginTime: new Date() });
    } else {
      user.loginLogoutHistory.push({
        date: currentDate,
        events: [{ loginTime: new Date() }],
      });
    }

    user.is_logged_in = true;
    await user.save();

    // // Record the login event
    // const userId = user._id;
    // logUserLogin(userId);

    // create a token
    const token = createToken(user._id);

    const role = user.role.toLowerCase();

    const outlet_name = user.outlet_name;

    const outlet_code = user.outlet_code;
    const active_hour = user.active_hour;

    console.log(user);

    res.status(200).json({ email_id, token, role, outlet_name, outlet_code , active_hour});
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// signup user
const signupUser = async (req, res) => {
  // email_id, password,outlet_division,role
  const { email_id, password, outlet_division, role, code, outlet_name } =
    req.body;

  let is_logged_in = false;

  try {
    const user = await User.signup(
      email_id,
      password,
      outlet_division,
      role,
      code,
      outlet_name,
      is_logged_in
    );

    // const role = user.role.toLowerCase()
    res.status(200).json({ email_id, role, outlet_name, code });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// const updateUser = async (req, res) => {
//   const { email_id, password, outlet_division, role, code, outlet_name } = req.body;

//   try {
//     // Find the user by their ID
//     const user = await User.findById(req.params.id);
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // Update user properties if they exist in the request body
//     if (email_id) user.email_id = email_id;
//     if (outlet_division) user.outlet_division = outlet_division;
//     if (code) user.code = code;
//     if (outlet_name) user.outlet_name = outlet_name;

//     // Save the updated user
//     await user.save();

//     // Optionally, create a new token if needed
//     // const token = createToken(user._id);

//     // Return the updated user or relevant data
//     res.status(200).json({ message: 'User updated successfully' });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

const deleteUser = async (req, res) => {
  const userId = req.params.id; // Assuming you pass the user ID as a route parameter

  try {
    // Check if the user exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete the user using Mongoose's remove method

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const stayAlive = async (req, res) => {
  res.status(200).json({ message: "staying alive!!!!! " });
};

const getAllUser = async (req, res) => {
  const users = await User.find({ role: "member" });
  res.status(200).json(users);
};

const getUser = async (req, res) => {
  const { id } = req.params;
  // console.log(id);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "wrong user id" });
  }

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ error: "No such user" });
  }

  res.status(200).json(user);
};

// Log out an individual member by ID
// const logOutMember = async (req, res) => {
//   const memberId = req.params.memberId;
//   // console.log(memberId);

//   try {
//     // Find the user by ID
//     const user = await User.findById(memberId);

//     if (!user) {
//       return res.status(404).json({ error: "Member not found" });
//     }

//     // Update the is_logged_in status to false
//     user.is_logged_in = false;

//     console.log(user);

//     // Save the updated user
//     await user.save();

//     // Record the login event
//     logUserLogout(memberId);

//     res.status(200).json({ message: "Member logged out successfully" });
//   } catch (err) {
//     res.status(500).json({ error: "Internal server error" });
//   }
// };
const logOutMember = async (req, res) => {
  const userId = req.params.memberId;
  // console.log(memberId);

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Log the logout event
    const currentDate = new Date();
    const today = user.loginLogoutHistory.find((day) =>
      day.date.toDateString() === currentDate.toDateString()
    );

    if (today) {
      today.events.push({ logoutTime: new Date() });
    } else {
      console.log(currentDate);
      user.loginLogoutHistory.push({
        date: currentDate,
        events: [{ logoutTime: new Date() }],
      });
    }

    // Update the is_logged_in status to false
    user.is_logged_in = false;

    // Save the updated user
    await user.save();

    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};


const setHour = async (req, res) => {
  const userId = req.params.id;
  // console.log(memberId);

  const {time} = req.body

  console.log(time);

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

      // console.log(user);
    // console.log(time);
    // Update the is_logged_in status to false
    user.active_hour = time;

    // Save the updated user
    await user.save();

    res.status(200).json({ message: "hour set successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const setEndHour = async (req, res) => {
  const userId = req.params.id;
  // console.log(memberId);

  const {time} = req.body

  console.log(time);

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

      // console.log(user);
    // console.log(time);
    // Update the is_logged_in status to false
    user.inactive_hour = time;

    // Save the updated user
    await user.save();

    res.status(200).json({ message: "hour set successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Log out all members at once
// const logOutAllMembers = async (req, res) => {
//   // console.log("sdsd");
//   try {
//     // Update the is_logged_in status to false for all members
//     await User.updateMany({role: "member"}, { $set: { is_logged_in: false } });

//     res.status(200).json({ message: 'All members logged out successfully' });
//   } catch (err) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// logOutAllMembers controller
const logOutAllMembers = async (req, res) => {
  try {
    const members = await User.find({ role: 'member', is_logged_in: true });

    for (const member of members) {
      // Log the logout event
      const currentDate = new Date();
      const today = member.loginLogoutHistory.find((day) =>
        day.date.toDateString() === currentDate.toDateString()
      );

      if (today) {
        today.events.push({ logoutTime: new Date() });
      } else {
        member.loginLogoutHistory.push({
          date: currentDate,
          events: [{ logoutTime: new Date() }],
        });
      }

      member.is_logged_in = false;

      await member.save();
    }

    res.status(200).json({ message: 'All members logged out successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// selfLogout user
const selfLogout = async (req, res) => {
  const userId = req.user._id; // Replace with your authentication logic to get the user ID

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Log the logout event
    const currentDate = new Date();
    const today = user.loginLogoutHistory.find((day) =>
      day.date.toDateString() === currentDate.toDateString()
    );

    if (today) {
      today.events.push({ logoutTime: new Date() });
    } else {
      user.loginLogoutHistory.push({
        date: currentDate,
        events: [{ logoutTime: new Date() }],
      });
    }

    // Update the is_logged_in status to false
    user.is_logged_in = false;

    // Save the updated user
    await user.save();

    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};


// bulk signUp user
const bulkSignupUsers = async (req, res) => {
  const users = req.body; // Assuming the array of objects is in the request body

  try {
    const bulkPromises = users.map(async (user) => {
      const { email_id, password, outlet_division, role, code, outlet_name } =
        user;
      try {
        return await User.signup(
          email_id,
          password,
          outlet_division,
          role,
          code,
          outlet_name
        );
      } catch (err) {
        // Handle the case where the user already exists
        if (err.message === "This user already exists") {
          return { error: "This user already exists", email_id };
        }
        throw err; // Rethrow other errors
      }
    });

    const results = await Promise.all(bulkPromises);

    const formattedResults = results.map((result) => {
      if (result.error) {
        return { email_id: result.email_id, error: result.error };
      }
      return {
        email_id: result.email_id,
        role: result.role,
        outlet_name: result.outlet_name,
        outlet_code: result.outlet_code,
      };
    });

    res.status(200).json(formattedResults);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  loginUser,
  signupUser,
  getUser,
  bulkSignupUsers,
  stayAlive,
  getAllUser,
  logOutMember,
  logOutAllMembers,
  selfLogout,
  deleteUser,
  setHour,
  setEndHour,
  // updateUser
};
