const router = require('express').Router();
const { getAllCourses, getMyCourses } = require('../Controller/courseController.js')

router.route('/getAllCourses')
    .get();

router.route('/getMyCourses')
    .get();
module.exports = router;