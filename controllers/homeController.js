exports.getHome = (req, res) => {
    res.render('index', {
        title: 'Student Audit Management System'
    });
};