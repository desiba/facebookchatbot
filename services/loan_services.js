const thousands = require('thousands');
const moment = require('moment');
const db = require('../models/index');
const sequelize = require('sequelize');
const date_format = require('../utils/date_format');

let now = moment();


module.exports = {


    total_loans_by_date :  async function(loandate, req, res){

       
        const loan_date = date_format.format_date(loandate);

        await db.sequelize.query(`SELECT SUM(amount) AS total_loan_by_date FROM loan_requests WHERE approval_status IN (1,3,7,9) AND loan_starts = '${loan_date}'`,  { type: sequelize.QueryTypes.SELECT})
        .then(function(data){

            let result_total_disbursment_by_date = data[0].total_loan_by_date
            
            let total_loan_response = {
              fulfillmentText: thousands(result_total_disbursment_by_date),
            }
            res.json(total_loan_response);
        })
        .catch(err => {
            throw err;
            console.log(err);

        });


    },

    total_loans_disbursed : async function(req, res){

        await db.sequelize.query(`SELECT SUM(amount) AS total_loan_disbursed FROM loan_requests WHERE approval_status IN (1,3,7,9)`,  { type: sequelize.QueryTypes.SELECT})
        .then(function(data){
          let result_total_disbursed = data[0].total_loan_disbursed
          let total_loan_response = {
            fulfillmentText: thousands(result_total_disbursed),
          }
          res.json(total_loan_response);
        })
        .catch(err => {
            throw err;
            console.log(err);
        });
    },

    

    total_loans_week : async function(req, res){
        let end = moment().format('YYYY-MM-DD'),
            start = moment().startOf('isoweek').format('YYYY-MM-DD');

            await db.sequelize.query(`SELECT SUM(amount) AS total_loan_date_range FROM loan_requests WHERE approval_status IN (1,3,7,9) AND loan_starts BETWEEN '${start}' AND '${end}' `,  { type: sequelize.QueryTypes.SELECT})
            .then(function(data){
                
                let result_total_disbursment = data[0].total_loan_date_range
                   
                let total_loan_response = {
                  fulfillmentText: thousands(result_total_disbursment),
                }
                res.json(total_loan_response);
            })
            .catch(err => {
                throw err;
                console.log(err);
    
            });
   
    },

    total_loan_month :  async function(req, res){
        
       
            
        let start = now.startOf('month').format("YYYY-MM-DD"),
         end = now.endOf('month').format("YYYY-MM-DD");

    /*
         db.sequelize.query(``,  { type: sequelize.QueryTypes.SELECT})
        .then(function(data){
          
        })
        .catch(err => {
            throw err;
            console.log(err);

        });
    */    

    
       await  db.sequelize.query(`SELECT SUM(amount) AS total_loan_date_range FROM loan_requests WHERE approval_status IN (1,3,7,9) AND loan_starts BETWEEN '${start}' AND '${end}' `,  { type: sequelize.QueryTypes.SELECT})
        .then(function(data){
            let result_total_disbursment = data[0].total_loan_date_range
                
            let total_loan_response = {
              fulfillmentText: thousands(result_total_disbursment),
            }
            res.json(total_loan_response);
        })
        .catch(err => {
            throw err;
            console.log(err);

        });
    },

     total_loans_today :  async function(req, res){
        
        const today_date = moment().format("YYYY-MM-DD");

        await db.sequelize.query(`SELECT SUM(amount) AS total_loan_today FROM loan_requests WHERE approval_status IN (1,3,7,9) AND loan_starts = '${today_date}'`,  { type: sequelize.QueryTypes.SELECT})
        .then(function(data){
            let result_total_disbursment_today = data[0].total_loan_today
              
            let total_loan_response = {
              fulfillmentText: thousands(result_total_disbursment_today),
            }
            res.json(total_loan_response);
        })
        .catch(err => {
            throw err;
            

        });


    }

   
};