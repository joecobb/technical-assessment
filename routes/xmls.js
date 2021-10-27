const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const uniqid = require('uniqid');
const libxml = require('libxmljs');
const { deleteFiles, fileFilter } = require('../utils/helper-functions');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'files');
  },
  filename: function (req, file, cb) {
    let extension = file.originalname.split('.')[1];
    const newFileName = `${uniqid()}${Date.now()}.${extension}`;
    cb(null, newFileName);
  },
});

const upload = multer({ storage, fileFilter });

router.post(
  '/validate',
  upload.fields([
    { name: 'schema', maxCount: 1 },
    { name: 'xml', maxCount: 1 },
  ]),
  async (req, res) => {
    let { schema } = req.body;
    let xsdDoc;
    let xmlDoc;
    let allFiles;

    try {
      let schemaType = req.body.schemaType ? req.body.schemaType : 'file';

      if (!['file', 'text'].includes(schemaType)) {
        return res.status(400).json({
          message: "[schemaType] only accepts 'file' | 'text'",
        });
      }

      if (req.files['schema'] && req.files['xml']) {
        allFiles = [...req.files['schema'], ...req.files['xml']];
      } else if (req.files['schema']) {
        allFiles = [...req.files['schema']];
      } else if (req.files['xml']) {
        allFiles = [...req.files['xml']];
      }

      if (schemaType === 'file') {
        if (!req.files['schema'] || req.files['schema'].length === 0) {
          deleteFiles(allFiles);
          return res.status(400).json({
            message: 'schema file is required',
          });
        }
        schema = fs.readFileSync(req.files['schema'][0].path, 'utf8');
      }

      xsdDoc = libxml.parseXml(schema);

      if (!req.files['xml'] || req.files['xml'].length === 0) {
        deleteFiles(allFiles);
        return res.status(400).json({
          message: 'xml file is required',
        });
      }

      xmlDoc = libxml.parseXml(
        fs.readFileSync(req.files['xml'][0].path, 'utf8')
      );
      const status = xmlDoc.validate(xsdDoc);
      const message = status ? 'xml is valid' : 'xml is not valid';

      deleteFiles(allFiles);

      return res.json({
        message,
        data: { status },
      });
    } catch (error) {
      deleteFiles(allFiles);
      return res.status(500).json({
        message: 'An error occured',
        error,
      });
    }
  }
);

module.exports = router;
