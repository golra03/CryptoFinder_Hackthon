module.exports = {
  databaseUrls: "mongodb://127.0.0.1:27017/sydneyHackathon",
  CollectionNames: {
    user: "user",
    student: "student",
    institution: "institution"
  },
  port: process.env.PORT || "3000",
    internalIp:"localhost",
    internalPort: 3000,
};

