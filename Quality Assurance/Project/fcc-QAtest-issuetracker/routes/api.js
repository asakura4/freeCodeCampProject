'use strict';
const mongoose = require('mongoose');
const { Schema } = mongoose;

const URI = process.env.DB;
mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology:true,
    useFindAndModify: false
  }).catch(error => {
    console.log(mongoose.connection.readyState);
    handleError(error);
});

let issueSchema = new Schema({
  issue_title: {
    type: String,
    // required: true
  },
  issue_text: {
    type: String,
    // required: true
  },
  created_on: {
    type: Date,
    default: Date.now
  },
  updated_on: {
    type: Date,
    default: Date.now
  },
  created_by: {
    type: String,
    // required: true
  },
  assigned_to: {
    type: String
  },
  open: {
    type: Boolean,
    default: true
  },
  status_text: {
    type: String
  }

})

module.exports = function (app) {
  

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      if(mongoose.connection.readyState !==1){
        console.log("mongoose.connection.readyState: " + mongoose.connection.readyState); 
      }
      // console.log(req.query);
      let queryColumn = {
        issue_title: req.query.issue_title,
        issue_text: req.query.issue_text,
        created_by: req.query.created_by,
        assigned_to: req.query.assigned_to,
        status_text: req.query.status_text,
        open: req.query.open
      }

      if(queryColumn["open"]){
        if(queryColumn["open"] === 'false'){
          queryColumn["open"] = false;
        }else{
          queryColumn["open"] = true;
        }
      }

      for(let k in queryColumn){
        if(!queryColumn[k]){
            delete queryColumn[k];
        }
      }

      let _id = req.query._id ? req.query._id : null;

      const Issue = mongoose.model(project, issueSchema);
      if(!_id){
          Issue.find(queryColumn, (err, issue)=>{
            if(err){
                return console.log(err);
            }
            return res.send(issue);
          }); 
      }else{
          Issue.findById(_id, (err, issue)=>{
            if(err){
                return console.log(err);
            }
            return res.send([issue]);
          }); 
      }
          
    })
    
    .post(function (req, res){
      let project = req.params.project;
      if(mongoose.connection.readyState !==1){
        console.log("mongoose.connection.readyState: " + mongoose.connection.readyState); 
      }

      const Issue = mongoose.model(project, issueSchema);
      const issue = {
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to || '',
        status_text: req.body.status_text || ''
      }

      if(!issue.issue_title || !issue.issue_text || !issue.created_by){
        let error = {error: 'required field(s) missing' }
        return res.send(error);
      }

      const i = new Issue(issue)
      i.save((err, data) =>{
        if(err) return console.error(err);
        res.send(data);
      });
    
      
      
    })
    
    .put(function (req, res){
      let project = req.params.project;
      //console.log(project);
      if(mongoose.connection.readyState !==1){
        console.log("mongoose.connection.readyState: " + mongoose.connection.readyState); 
      }

      const Issue = mongoose.model(project, issueSchema);
      
      let _id = req.body._id;
      if(typeof _id === 'undefined' || !_id){
        // console.log('missing_id');
        // console.log(req.body);
        return res.send({ error: 'missing _id' });
      }
      
      let issue = {}
      for(let k in req.body){
        if(k === '_id'){
          continue;
        }
        if(req.body[k]){
          issue[k] = req.body[k];
        }
      }

      if(Object.entries(issue).length === 0){
        return res.send({ 
          error: 'no update field(s) sent',
          _id: _id }
         );
      }
      // console.log(req.body);

      // const issue = {
      //   issue_title: req.body.issue_title,
      //   issue_text: req.body.issue_text,
      //   created_by: req.body.created_by,
      //   assigned_to: req.body.assigned_to,
      //   status_text: req.body.status_text,
      // }

      // if(!Object.values(issue).some(x => typeof x !== 'undefined')){
      //   // console.log('no update field');
      //   // console.log(req.body);
      //   return res.send({ 
      //     error: 'no update field(s) sent',
      //     _id: _id }
      //    );
      // }

      // for(let k in issue){
      //   if(!issue[k]){
      //       delete issue[k];
      //   }
      // }
      
      if(req.body.open === 'false'){
        issue["open"] = false;
      }
      // console.log(issue);

      issue["updated_on"] = new Date().toISOString();
      // console.log(issue);
      Issue.findByIdAndUpdate(_id, issue, {new: true},(err, findIssue) =>{
        if(err){
          return res.send({ error: 'could not update', '_id': _id });
        }
        if(!findIssue){
          return res.send({ error: 'could not update', '_id': _id });
        }
        // console.log(findIssue);
        return res.send({
          result: 'successfully updated', 
          _id: _id 
          });
      });
      
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      if(mongoose.connection.readyState !==1){
        console.log("mongoose.connection.readyState: " + mongoose.connection.readyState); 
      }

      const Issue = mongoose.model(project, issueSchema);
      console.log( req.body._id);
      if( req.body._id == 'undefined' || !req.body._id){
        // console.log('missing_id');
        // console.log(req.body);
        return res.send({ error: 'missing _id' });
      }
      
      let _id = req.body._id;
      Issue.findByIdAndDelete(_id, (err, findIssue) =>{
        if(err){
          return res.send({ error: 'could not delete', '_id': _id });
        }
        if(!findIssue){
          return res.send({ error: 'could not delete', '_id': _id });
        }

        // console.log(findIssue);
        return res.send({
          result: 'successfully deleted', 
          '_id': _id 
        });
      });

    })
    
};
