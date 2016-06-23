module.exports = {
  'secretKey': '12345-67890-09876-54321',
  'mongoUrl': 'mongodb://localhost:27017/conFusion'
};


var commentSchema = new Schema ({
  rating: {type: Number, min: 1, max: 5},
  comment: {type: String, required: true},
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // сослались на схему юзера
  }
}, {timestamps: true});