/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/*
 * The sample smart contract for documentation topic:
 * Writing Your First Blockchain Application
 */

package main

/* Imports
 * 4 utility libraries for formatting, handling bytes, reading and writing JSON, and string manipulation
 * 2 specific Hyperledger Fabric specific libraries for Smart Contracts
 */
import (
	"bytes"
	"encoding/json"
	"fmt"
	"strconv"
	"strings"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

// Define the Smart Contract structure
type SmartContract struct {
}

// Define the car structure, with 4 properties.  Structure tags are used by encoding/json library
type Contract struct {
	Contract_companyA string `json:"contract_companyA"`
	Contract_companyB string `json:"contract_companyB"`
	Contract_contents string `json:"contract_contents"`
	Contract_date     string `json:"contract_date"`
	Contract_name     string `json:"contract_name"`
	Contract_period   string `json:"contract_period"`
	Contract_receiver string `json:"contract_receiver"`
	Contract_signA    string `json:"contract_signA"`
	Contract_signB    string `json:"contract_signB"`
	Contract_writer   string `json:"contract_writer"`
	State             string `json:"state"`
}

/*
 * The Init method is called when the Smart Contract "fabcar" is instantiated by the blockchain network
 * Best practice is to have any Ledger initialization in separate function -- see initLedger()
 */
func (s *SmartContract) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
	return shim.Success(nil)
}

/*
 * The Invoke method is called as a result of an application request to run the Smart Contract "fabcar"
 * The calling application program has also specified the particular smart contract function to be called, with arguments
 */
func (s *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {

	// Retrieve the requested Smart Contract function and arguments
	function, args := APIstub.GetFunctionAndParameters()
	// Route to the appropriate handler function to interact with the ledger appropriately
	if function == "queryCar" {
		return s.queryCar(APIstub, args)
	} else if function == "initLedger" {
		return s.initLedger(APIstub)
	} else if function == "allCars" {
		return s.allCars(APIstub)
	} else if function == "createCar" {
		return s.createCar(APIstub, args)
	} else if function == "queryAllCars" {
		return s.queryAllCars(APIstub, args)
	} else if function == "changeCarOwner" {
		return s.changeCarOwner(APIstub, args)
	} else if function == "querySelectCar" {
		return s.querySelectCar(APIstub, args)
	} else if function == "sendContract" {
		return s.sendContract(APIstub, args)
	} else if function == "makeContract" {
		return s.makeContract(APIstub, args)
	}

	return shim.Error("Invalid Smart Contract function name.")
}


func (s *SmartContract) queryCar(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
    if len(args) != 1 {
        return shim.Error("Incorrect number of arguments. Expecting 1")
    }
    carAsBytes, _ := APIstub.GetState(args[0])
    return shim.Success(carAsBytes)
}
func (s *SmartContract) initLedger(APIstub shim.ChaincodeStubInterface) sc.Response {
    cars := []Contract{
        Contract{Contract_name: "Toyota", Contract_contents: "Prius", Contract_companyA: "blue", Contract_companyB: "Tomoko", Contract_date: "3일", Contract_period: "3년", State: "계약대기"},
    }
    i := 0
    for i < len(cars) {
        fmt.Println("i is ", i)
        carAsBytes, _ := json.Marshal(cars[i])
        APIstub.PutState("Contract"+strconv.Itoa(i), carAsBytes)
        fmt.Println("Added", cars[i])
        i = i + 1
    }
    return shim.Success(nil)
}


// 계약서 생성을 하기위해 필요한 전체 계약서 수 출력
func (s *SmartContract) allCars(APIstub shim.ChaincodeStubInterface) sc.Response {

	startKey := "00000000"
	endKey := "99999999"

	resultsIterator, err := APIstub.GetStateByRange(startKey, endKey)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing QueryResults
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- allCars:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}

// 계약서 생성
func (s *SmartContract) createCar(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 9 {
		return shim.Error("Incorrect number of arguments. Expecting 9")
	}

	var car = Contract{Contract_name: args[1], Contract_contents: args[2], Contract_companyA: args[3], Contract_companyB: args[4], Contract_date: args[5], Contract_period: args[6], State: args[7], Contract_writer: args[8]}

	carAsBytes, _ := json.Marshal(car)
	APIstub.PutState(args[0], carAsBytes)

	return shim.Success(nil)
}

// 유저 아이디에 따른 목록 표시
func (s *SmartContract) queryAllCars(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	userName := strings.ToLower(args[0])
	fmt.Println(userName)
	queryString := fmt.Sprintf("{\"selector\": {\"$or\": [ { \"contract_writer\": \"%s\" }, { \"contract_receiver\": \"%s\" }]}}", userName, userName)

	queryResults, err := getQueryResultForQueryString(APIstub, queryString)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(queryResults)
}

// 쿼리문을 사용하기 위해 getQueryResultForQueryString 와 constructQueryResponseFromIterator 사용
func getQueryResultForQueryString(APIstub shim.ChaincodeStubInterface, queryString string) ([]byte, error) {

	fmt.Printf("- getQueryResultForQueryString queryString:\n%s\n", queryString)

	resultsIterator, err := APIstub.GetQueryResult(queryString)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	buffer, err := constructQueryResponseFromIterator(resultsIterator)
	if err != nil {
		return nil, err
	}

	fmt.Printf("- getQueryResultForQueryString queryResult:\n%s\n", buffer.String())

	return buffer.Bytes(), nil
}


// 계약서 쿼리 시
func constructQueryResponseFromIterator(resultsIterator shim.StateQueryIteratorInterface) (*bytes.Buffer, error) {
	// buffer is a JSON array containing QueryResults
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	return &buffer, nil
}




// 계약서 상세 조회
func (s *SmartContract) querySelectCar(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	// 인자값이 하나이상이면 에러
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	// 인자값 키
	//key := args[0]
	// 로그 남기기
	fmt.Println("계약서 키값:" + args[0])

	resultsIterator, _ := APIstub.GetState(args[0])

	return shim.Success(resultsIterator)
}


// 계약서 수정
func (s *SmartContract) changeCarOwner(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 7 {
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}

	carAsBytes, _ := APIstub.GetState(args[0])
	car := Contract{}

	json.Unmarshal(carAsBytes, &car)
	car.Contract_name = args[1]
	car.Contract_contents = args[2]
	car.Contract_companyB = args[3]
	car.Contract_receiver = args[4]
	car.Contract_date = args[5]
	car.Contract_period = args[6]

	carAsBytes, _ = json.Marshal(car)
	APIstub.PutState(args[0], carAsBytes)

	return shim.Success(nil)
}


// 계약서 전송 (갑 > 을)
func (s *SmartContract) sendContract(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 4 {
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}

	carAsBytes, _ := APIstub.GetState(args[0])
	car := Contract{}

	json.Unmarshal(carAsBytes, &car)
	car.Contract_signA = args[1]
	car.Contract_receiver = args[2]
	car.State = args[3]

	carAsBytes, _ = json.Marshal(car)
	APIstub.PutState(args[0], carAsBytes)

	return shim.Success(nil)
}


// 계약서 최종 서명 (을)
func (s *SmartContract) makeContract(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}

	carAsBytes, _ := APIstub.GetState(args[0])
	car := Contract{}

	json.Unmarshal(carAsBytes, &car)
	car.Contract_signB = args[1]
	car.State = args[2]

	carAsBytes, _ = json.Marshal(car)
	APIstub.PutState(args[0], carAsBytes)

	return shim.Success(nil)
}

// The main function is only relevant in unit test mode. Only included here for completeness.
func main() {

	// Create a new Smart Contract
	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Printf("Error creating new Smart Contract: %s", err)
	}
}


