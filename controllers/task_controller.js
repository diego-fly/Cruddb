const express = require('express');
const app = express();
const Task = require("./../models/task");

app.get('/', function (req, res) {
    res.json({
        'success': true,
        'message' : 'Welcome to NODEJS + MONGODB + COMPASS + EXPRESSS',
        'data' : []
    })
});
  
app.get('/task', function (req, res) {

    Task.findAll({})
            .exec( (err, taskList) => {
                if(err){
                    return res.status(400).json({
                        'success': false,
                        'message' : err.message,
                        'data' : []
                    });
                }
                else if (!taskList){
                    return res.json({
                        'success': false,
                        'message' : 'this task not is found',
                        'data' : []
                    });
                }
                return res.json({
                    'success': true,
                    'message' : 'Task List',
                    'data' : [taskList]
                })
            });

});
  
app.post('/task', function (req, res) {
    let data = req.body;
    let task = new Task({
        title: data.title,
        description: data.description,
        image_url: data.image_url,
        
    });

    task.save( (err, taskDB) => {
        if(err){
            return res.status(400).json({
                'success': false,
                'message' : err.message,
                'data' : []
            });
        }
        return res.json({
            'success': true,
            'message' : 'Task saved successfully',
            'data' : [taskDB]
        })
    });
});

app.get('/task/:id', function (req, res) {
    let id = req.params.id;

    Task.findById(id)
            .exec( (err, taskDetail) => {
                if(err){
                    return res.status(400).json({
                        'success': false,
                        'message' : err.message,
                        'data' : []
                    });
                }
                if (!taskDetail){
                    return res.json({
                        'success': false,
                        'message' : 'this task not is found',
                        'data' : []
                    });
                }
                return res.json({
                    'success': true,
                    'message' : 'Task Detail',
                    'data' : [taskDetail]
                })
            });
});
//Actualizar imf
app.put('/task/:id', function (req, res) {
    let id = req.params.id;
    let data=req.body;
     const{title,description}=data;
 // es para que no aparezca la imagen si no esos dos nada mas
   let update = { title,description };

    Task.findByIdAndUpdate(id, update, {new : true,  runValidators: true}, (err, taskDB) => {
        if(err){
            return res.status(400).json({
                'success': false,
                'message' : err.message,
                'data' : []
            });
        }
        return res.json({
            'success': true,
            'message' : 'Task updated successfully',
            'data' : [taskDB]
        })
    });
});
// es para mostrar si esta activo o si no esta activo
app.delete('/task/:id', function (req, res) {
    let id = req.params.id;
    Task.findById(id)
            .exec( (err, taskDetail) => {
                if(err){
                    return res.status(400).json({
                        'success': false,
                        'message' : 'No se encuentra nadita de lo que dices mi bro',
                        'data' : []
                  });
                }
                ( taskDetail.active ? actualizarestado( false, id, res ) : actualizarestado ( true, id, res ) );
            });   
            });

const actualizando = ( estado, id, res ) => {
         Task.findByIdAndUpdate(id, data, {new : false,  runValidators: true}, (err, taskDB) => {
             if(err){
               return res.status(400).json({
                'success': false,
                'message' : err.message,
                'data' : []
                        });
                }
                    if(!taskDB){
                        return res.json({
                            'success': true,
                            'message' : 'the status de la task update susesfully',
                            'data' : [taskDB]
                        });
                    }
                    return res.json({
                        'success': false,
                        'message' : 'the task not found, friend',
                        'data' : []
                    })
                });
            }       
// aqui si ya eliminado seriamente la tarea
     app.delete('/task/:id', function (req, res) {
     let id = req.params.id;
     Task.findByIdAndDelete(id, (err, taskDB) => {             
        if(err){
            return res.status(400).json({
                'success': false,
                'message' : err.message,
                'data' : []
            });
        }
        if(!taskDB){
            return res.status(400).json({
                'success': false,
                'message' : 'Task doesnt found, my bro',
                'data' : []
            });
        }
        return res.json({
            'success': true,
            'message' : 'this task deleted successfully',
            'data' : [taskDB]
        })    
    });
});


module.exports = app;
