const mongoose = require('mongoose');
const { DateTime } = require("luxon");


const Schema = mongoose.Schema;

const AuthorSchema = new Schema(
    {
        first_name: { type: String, required: true, maxLength: 100 },
        family_name: { type: String, required: true, maxLength: 100 },
        date_of_birth: { type: Date },
        date_of_death: { type: Date },
    }
);

// Virtual for author's full name
AuthorSchema
    .virtual('name')
    .get(function () {
        return this.family_name + ', ' + this.first_name;
    });

AuthorSchema
    .virtual('dob')
    .get(function () { // For some reason it can't use arrow function here?!
        let dob = DateTime.fromJSDate(this.date_of_birth).toISODate();
        return dob;
    });

AuthorSchema
    .virtual('dod')
    .get(function () {
        let dod = DateTime.fromJSDate(this.date_of_death).toISODate();
        return dod;
    });

// Virtual for author's lifespan
AuthorSchema
    .virtual('lifespan')
    .get(function () {
        let deathYear = DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED);
        deathYear = deathYear != 'Invalid DateTime' ? deathYear : '?';
        let birthYear = DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED);
        birthYear = birthYear != 'Invalid DateTime' ? birthYear : '?';
        return `${birthYear} - ${deathYear}`;
    });

// Virtual for author's URL
AuthorSchema
    .virtual('url')
    .get(function () {
        return '/catalog/author/' + this._id;
    });

//Export model
module.exports = mongoose.model('Author', AuthorSchema);