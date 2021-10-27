const fs = require('fs');
const deleteFiles = (files) => {
  for (const file of files) {
    fs.unlink(file.path, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });
  }
};
const fileFilter = (req, file, cb) => {
  // Accept only xml or xsd
  if (!file.originalname.match(/\.(xml|XML|xsd|XSD)$/)) {
    req.fileValidationError = 'Only xml and xsd files are allowed!';
    return cb(new Error('Only xml and xsd files are allowed!'), false);
  }
  cb(null, true);
};

module.exports = { deleteFiles, fileFilter };
