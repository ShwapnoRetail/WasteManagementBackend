const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "9999 years" });
};

// login user
const loginUser = async (req, res) => {
  const { email_id, password } = req.body;

  try {
    const user = await User.login(email_id, password);
    // create a token
    const token = createToken(user._id);

    const role = user.role.toLowerCase();

    const outlet_name = user.outlet_name;

    const outlet_code = user.outlet_code;

    console.log(user);

    res.status(200).json({ email_id, token, role, outlet_name, outlet_code });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// signup user
const signupUser = async (req, res) => {
  // email_id, password,outlet_division,role
  const { email_id, password, outlet_division, role, code, outlet_name } =
    req.body;

  try {
    const user = await User.signup(
      email_id,
      password,
      outlet_division,
      role,
      code,
      outlet_name
    );

    // create a token
    const token = createToken(user._id);

    // const role = user.role.toLowerCase()

    res.status(200).json({ email_id, token, role, outlet_name, code });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const stayAlive = async (req, res ) => {
  res.status(200).json({ message: "staying alive "})
}

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
  bulkSignupUsers,
  stayAlive
};
