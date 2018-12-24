const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Bodyparser Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Signup Route
app.post('/signup', (req, res) => {
  const { firstName, lastName, email } = req.body;

  // Make sure fields are filled
  if (!firstName || !lastName || !email) {
    res.redirect('/fail.html');
    return;
  }
  // Construct req Data
  const data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const postData = JSON.stringify(data);

  const options = {
    url: 'https://us7.api.mailchimp.com/3.0/lists/735a12c80a',
    method: 'POST',
    headers: {
      Authorization: 'auth 77a11e8cc2632a4b1bdac5997e373f1e-us7'
    },
    body: postData
  };

  request(options, (error, response, body) => {
    if (error) {
      res.redirect('/fail.html');
    } else {
      if (response.statusCode === 200) {
        res.redirect('/success.html');
      } else {
        res.redirect('/fail.html');
      }
    }
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server start on ${PORT}`));
