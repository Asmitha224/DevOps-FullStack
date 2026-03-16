const express = require('express');
const router = express.Router();
const paperController = require('../controllers/paperController');
const { isAuthenticated } = require('../middleware/auth');
const { uploadPDF } = require('../middleware/multer');

router.get('/', isAuthenticated, paperController.getAllPapers);
router.get('/create', isAuthenticated, paperController.getCreatePaper);
router.post('/', isAuthenticated, uploadPDF.single('pdfFile'), paperController.postCreatePaper);
router.get('/:id', isAuthenticated, paperController.getPaper);
router.get('/:id/edit', isAuthenticated, paperController.getEditPaper);
router.put('/:id', isAuthenticated, uploadPDF.single('pdfFile'), paperController.putEditPaper);
router.delete('/:id', isAuthenticated, paperController.deletePaper);

module.exports = router;
