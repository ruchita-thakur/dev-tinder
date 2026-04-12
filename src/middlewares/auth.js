const adminAuth = (req, res, next) => {
  console.log("admin auth is getting checked");
  const token = "xyz";
  const isAdminAuthorized = token === "xyz";
  if (!isAdminAuthorized) {
    res.status(401).send("Unauthorized");
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  console.log("checking uyser auth");
  const token = "abc";
  const isUserAuthorised = token == "abc";
  if (!isUserAuthorised) {
    res.status(401).send("Unauthorized User");
  } else {
    next();
  }
};

module.exports = { adminAuth, userAuth };
