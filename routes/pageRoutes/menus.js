const express = require('express');
const router = express.Router();
var dateFormat = require('dateformat');
const db = require('../../db_config');
const feather = require('feather-icons');

router.get('/', (req, res)=>{
    db.query("select * from menus where parent is null;select * from menus where parent is not null;", (error, result)=>{
        if(error) console.log('mysql error', error);
        else {
            if( result[0].length > 0 ){
                result[0].forEach((menu)=>{
                    var children = result[1].filter( m =>  m.parent === menu.menu_id);
                    if(children.length > 0 ) menu.children = children;
                    else menu.children = false;
                })
                console.log(result[0])
                res.render('menus/', {menus: result[0]});
            }
        }
    })
});

router.get('/new/:parent?/:parent_title?', (req, res)=>{
    if(req.params.parent){
        res.render('newMenu', {parent: req.params.parent, parent_title: req.params.parent_title, data: false});
    }else{
        res.render('menus/newMenu', {parent: false, icons: feather.icons, data: false});
    }
});

router.get('/edit/:menu_id/*', (req, res)=>{
    db.query("select * from menus where parent is null;", (error, result)=>{
        if(error) console.log('mysql error', error);
        else {
            res.render('menus/newMenu', {icons: feather.icons, parents: result[0], data: result[1][0], parent : false});
        }
    })
});

router.get('/permissions', (req, res)=>{
    db.query("select * from pivoted_menu_permissions where parent is null;select * from user_levels", (error, result)=>{
        if(error) console.log('mysql error', error);
        else {
            res.render('menus/menuPermissions', {icons: feather.icons, data: result[0], userLevels: result[1]});
        }
    })
});

module.exports = router;