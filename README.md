# Technical Assessment (Api for validating XML against Schema)

## Libraries used

- [cors](https://www.npmjs.com/package/cors) : Enables Cross-origin resource sharing on server
- [multer](https://www.npmjs.com/package/multer) : For file uploads
- [express](https://www.npmjs.com/package/express) : A web framework for Nodejs
- [libxmljs](https://github.com/libxmljs/libxmljs/wiki) : For xml manipulations

## Tools
- [Postman](https://www.postman.com/) : For testing out the endpoint


## Getting Started

Before you proceed make sure you have [nodejs](https://nodejs.org/en/) installed

Clone the repository and navigate to directory:

```bash
$ git clone https://github.com/joecobb/technical-assessment.git && cd technical-assessment
```

Install the dependencies:

```bash
$ npm install
```

Start the server

```bash
$ npm start
```

## Validate XML

Returns json with validation status of xml file against a File or Text schema.

- **URL**

  http://localhost:4000/api/xmls/validate

- **Method:**

  `POST`

- **Data Params**

  `xml=[ File ]`

  `schema=[ File | String ]`

  `schemaType=[ String ]` accepts `'file'` | `'text'`

- **Success Response:**

  - **Code:** 200 <br />
    **Content:** `{ "message": "xml is valid", "data": { "status": true } }`

- **Error Response:**

  - **Code:** 400 <br />
    **Content:** `{ "message": "xml file is required" }`

  - **Code:** 400 <br />
    **Content:** `{ "message": "schema file is required" }`

  - **Code:** 400 <br />
    **Content:** `{ "message": "[schemaType] only accepts 'file' | 'text'" }`

- **Sample Call:**

  ```javascript
  var axios = require('axios');
  var FormData = require('form-data');
  var fs = require('fs');
  var data = new FormData();
  data.append('schema', fs.createReadStream('./xsd-file.xsd'));
  data.append('xml', fs.createReadStream('./xml-valid-file.xml'));
  data.append('schemaType', 'file');

  var config = {
    method: 'post',
    url: 'http://localhost:4000/api/xmls/validate',
    headers: {
      ...data.getHeaders(),
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
  ```
