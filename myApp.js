require("dotenv").config();
const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://rohitkumar:rohit@cluster0.xyzcf.mongodb.net/fcc-mongodb-and-mongoose",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false, // Add this to prevent Mongoose from using deprecated methods
  }
);
mongoose.connection.on(
  "error",
  console.error.bind(console, "MongoDB connection error:")
);
mongoose.connection.once("open", () => console.log("Connected to MongoDB"));
const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  favoriteFoods: [String],
});
const Person = mongoose.model("Person", personSchema);
const createAndSavePerson = (done) => {
  const person = new Person({
    name: "John Doe",
    age: 30,
    favoriteFoods: ["Pizza", "Burger"],
  });
  person.save((err, data) => {
    if (err) {
      console.error("Error saving person:", err);
      return done(err);
    }
    console.log("Person saved successfully:", data);
    done(null, data);
  });
};

const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, (err, people) => {
    if (err) return done(err);
    done(null, people);
  });
};

const findPeopleByName = (personName, done) => {
  Person.find({ name: personName }, (err, people) => {
    if (err) return done(err); // Handle errors
    done(null, people); //return the array of matched people
  });
};

const findOneByFood = (food, done) => {
  Person.findOne({ favoriteFoods: food }, (err, data) => {
    if (err) return done(err);
    done(null, data);
  });
};

const findPersonById = (personId, done) => {
  Person.findById(personId, (err, person) => {
    if (err) return done(err);
    done(null, person);
  });
};

const findEditThenSave = (personId, done) => {
  Person.findById(personId, (err, person) => {
    if (err) return done(err);

    //modify the person's favoriteFoods array
    person.favoriteFoods.push("hamburger");
    //save the updated document
    person.save((err, updatedPerson) => {
      if (err) return done(err);
      done(null, updatedPerson);
    });
  });
};

const findAndUpdate = (personName, done) => {
  Person.findOneAndUpdate(
    { name: personName },
    { age: 20 },
    { new: true },
    (err, updatedPerson) => {
      if (err) return done(err);
      done(null, updatedPerson);
    }
  );
};

const removeById = (personId, done) => {
  Person.findByIdAndRemove(personId, (err, removedPerson) => {
    if (err) return done(err);
    done(null, removedPerson);
  });
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";
  Person.remove({ name: nameToRemove }, (err, result) => {
    if (err) return done(err);
    done(null, result);
  });
};
const queryChain = (done) => {
  if (typeof done !== "function") {
    console.error("Error: done is not a function");
    return;
  }

  const foodToSearch = "burrito";

  Person.find({ favoriteFoods: foodToSearch }) // Find people who like 'burrito'
    .sort({ name: 1 }) // Sort results by name in ascending order
    .limit(2) // Limit the results to 2
    .select({ age: 0 }) // Hide the age field (0 = exclude, 1 = include)
    .exec((err, data) => {
      if (err) return done(err);
      done(null, data);
    });
};
/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
