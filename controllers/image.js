const Clarifai = require('clarifai');

const app = new Clarifai.App({
  apiKey: 'c1f4d7bd2a17465f81c44913eac997b7',
});

const handleApiCall = (req, res) => {
  app.models.predict(
    'e15d0f873e66047e579f90cf82c9882z',
    req.body.input
  )
  .then(data => {
    res.json(data);
  })
  .catch(err => {res.status(400).json('unable to work with api')})
};

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then((entries) => {
      res.json(entries)[0];
    })
    .catch((err) => res.status(400).json('Unable to get entries'));
};

module.exports = {
  handleImage: handleImage,
  handleApiCall: handleApiCall
};
