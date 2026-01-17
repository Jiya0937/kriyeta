const mongoose = require("mongoose");
const Student = require("./models/student");

mongoose.connect("mongodb://127.0.0.1:27017/kriyeta")
  .then(async () => {
    await Student.deleteMany({});
    console.log("✅ All students deleted");
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
