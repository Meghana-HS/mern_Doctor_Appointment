export const generateToken = (user, message, statusCode, res) => {
  const token = user.generateJsonWebToken();
  const cookieName = user.role === 'Admin' ? 'adminToken' : 'patientToken';
  const days = parseInt(process.env.COOKIE_EXPIRES) || 7;

  res
    .status(statusCode)
    .cookie(cookieName, token, {
      expires: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // false on localhost
      sameSite: "lax", // allows local dev cross-origin
    })
    .json({
      success: true,
      message,
      user,
      token,
    });
};
