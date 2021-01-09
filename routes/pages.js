const express = require('express');
const router = express.Router();
var dateFormat = require('dateformat');
const db = require('../db_config');

var user = {
    name: "Pranavan",
    img:"/img/avatars/avatar.jpg"
}

router.get('/', (req, res)=>{
    res.render('home', {user});
});
router.get('/profile', (req, res)=>{
    res.render('profile');
});
router.get('/employees', (req, res)=>{
    db.query("select e.firstname, e.lastname, e.birthdate, e.martial_status, d.name, p.pay_grade_level_title, u.emp_id from employees as e inner join departments as d ON e.dept_id=d.dept_id inner join pay_grades as p ON e.pay_grade_level=p.pay_grade_level left join users as u ON e.emp_id=u.emp_id", (error, result)=>{
        if(error) console.log('mysql error', error);
        else {
            if( result.length > 0 ){
                result.forEach( row => {
                    row.birthdate = row.birthdate !== null ? dateFormat( row.birthdate, 'dddd, mmmm dS, yyyy' ) : ''
                })
                res.render('employees', {employees: result});
            }
        }
    })
});

router.get('/employees/categories', (req, res)=>{
    db.query("select * from employment_statuses; select * from job_titles; select * from pay_grades;" , (error, data)=>{
        if(error) console.log('mysql error', error);
        if(!error) {
                var res_1=data[0]
                var res_2=data[1]
                var res_3=data[2]
                res.render('categories', {empStatusRes: res_1, jobTitleRes: res_2, payGradesRes: res_3});
        }
    })
});

router.get('/departments', (req, res)=>{
    db.query("select * from departments", (error, result)=>{
        if(error) console.log('mysql error', error);
        else {
            if( result.length > 0 ){
                res.render('departments', {departments: result});
            }
        }
    })
});

router.get('/settings', (req, res)=>{
    res.render('settings');
});
router.get('/leave', (req, res)=>{
    res.render('leave');
});
router.get('/login/new', (req, res)=>{
    res.render('login/new');
});

/*router.get('/auth/login', (req, res)=>{
    res.send('normal')
})*/

router.get('/*', (req, res)=>{
    res.render('.'+req.originalUrl)
})

module.exports = router;