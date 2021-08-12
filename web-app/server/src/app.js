const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

var network = require('./fabric/network.js');
const { response } = require('express');

// 사용자 정보 불러오기
const fs = require('fs');
const path = require('path');
const configPath = path.join(process.cwd(), '/config.json');
const configJSON = fs.readFileSync(configPath, 'utf8');
const config = JSON.parse(configJSON);
var userName = config.userName;
var usr = JSON.stringify(userName)

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())



app.get('/getLoginUser', (req, res) => {
  console.log(usr)
  res.send(usr);
})

// 작성자, 받은자 기준으로 목록조회
app.get('/queryAllCars', (req, res) => {
  network.queryAllCars(userName)
    .then((response) => {      
        res.send(response);
    });
})

app.post('/querySelectCar', (req, res)=> {
    network.querySelectCar(req.body.key)
      .then((response) => {
        res.send(response)
      })
});

app.post('/createCar', (req, res) => { 
  console.log(req.body);
  // 계약서 전체 갯수 불러오기
  network.allCars()
    .then((response) => {
      var carsRecord = JSON.parse(response);
      var numCars = String(carsRecord.length + 1);
      // 자리수 만큼 남는 공간 0으로 채우기
      var newKey = numCars.padStart(8,'0');       
      console.log("newkey >>>>>>>>>>>",newKey)
      // 계약상태
      var newState = '계약 대기'
      network.createCar(newKey, req.body.contract_name, req.body.contract_contents, req.body.contract_companyA, req.body.contract_companyB, req.body.contract_date, req.body.contract_period, newState, userName)
      .then((response) => {
        res.send(response)
      })
    })  
})

app.post('/changeCarOwner', (req, res) => {
      network.changeCarOwner(req.body.key, req.body.new_contract_name, req.body.new_contract_contents, req.body.new_contract_companyB, req.body.new_contract_receiver, req.body.new_contract_date, req.body.new_contract_period)
          .then((response) => {
            res.send(response)
      })
})

app.post('/sendContract', (req, res) => {
  const changeState = '계약 중';
  console.log(req.body);
  network.sendContract(req.body.key, req.body.contract_signA, req.body.contract_receiver, changeState)
      .then((response) => {
        res.send(response)
  })
})

app.post('/makeContract', (req, res) => {
  const changeState = '계약 완료';
  console.log(req.body);
  network.makeContract(req.body.key, req.body.contract_signB, changeState)
      .then((response) => {
        res.send(response)
  })
})

app.listen(process.env.PORT || 8081)