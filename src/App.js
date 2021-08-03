import React, { useEffect, useState } from "react";
import lodash from "lodash";
import axios from "axios";
import Notification from "./Notification";
//import Services from "./services/servers";

const App = () => {
  const [personArray, setPersonArray] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterInfo, setFilterInfo] = useState("");
  const [filterArray, setFilterArray] = useState([]);
  const [isMessage, setMessage] = useState(null);
  //const urlServer = "http://localhost:3001/persons";
  const urlServer = "http://localhost:3100/api/persons";
  //const urlServer = "/api/persons";

  useEffect(() => {
    console.log("useEffect");
    axios.get(urlServer).then((response) => {
      console.log("Promise fulfilled");
      setPersonArray(response.data);
    });
  }, []);

  //console.log("Result useEffect: ", personArray);

  const inputNameHandle = (event) => {
    const inputName = event.target.value;
    console.log(inputName);
    setNewName(inputName);
  };
  const inputNumberHandle = (event) => {
    const inputNumber = event.target.value;
    console.log(inputNumber);
    setNewNumber(inputNumber);
  };
  const inputFilterHandle = (event) => {
    const inputFilter = event.target.value;
    console.log(inputFilter);
    setFilterInfo(inputFilter);
    const filterResult = personArray.filter((person) =>
      person.name.toLowerCase().match(inputFilter.toLowerCase())
    );
    console.log("filterResult", filterResult);
    setFilterArray(filterResult);
  };

  const formHandle = (event) => {
    event.preventDefault();
    const newArrayOfName = personArray.map((element) => element.name);
    const newArrayOfNumber = personArray.map((element) => element.number);
    // if (newArrayOfName.includes(newName)) {
    //   return window.alert(`${newName} is already added to phonebook`);
    // }
    if (newArrayOfName.includes(newName)) {
      if(newArrayOfNumber.includes(newNumber)){
        return window.alert(`${newName} is already added to phonebook`);
      }else if(!newArrayOfNumber.includes(newNumber)){
        if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one which you input?`)){ //is true
          const tempInfo = personArray.find(person => person.name === newName);
          const personlUrl = urlServer + "/" + tempInfo.id;
          const personObejct = {
            name: newName,
            number: newNumber,
          };
          axios.put(personlUrl, personObejct).then(response =>{
            console.log("response.data:", response.data);
            setMessage(`${newName} und ${newNumber} are successfully saved`);
            setTimeout(() => {
              console.log("setTimeout");
              setMessage(null)
            }, 3000);
            return setPersonArray(personArray.map(info => info.id !== tempInfo.id ? info : response.data));
          }).catch(error=>{
            alert(`We couldn't a new data in the server`);
          })
        }
      }else{
        return null;
      }
    } else if (!newArrayOfName.includes(newName)) {
      const personObejct = {
        name: newName,
        number: newNumber,
      };
      // return setPersonArray(personArray.concat(personObejct));
      axios.post(urlServer, personObejct).then((response) => {
        console.log("personObejct", personObejct);
        setMessage(`${newName} und ${newNumber} are successfully saved`);
        setTimeout(() => {
          console.log("setTimeout");
          setMessage(null);
        }, 3000);
        setPersonArray(personArray.concat(personObejct));
        setNewName("");
        setNewNumber("");
      }).catch(error =>{
        console.log("프론트엔드", error.response.data);
        const errorMessage = error.response.data;
        setMessage(errorMessage.error);
        setTimeout(() => {
          console.log("setTimeout");
          setMessage(null);
        }, 3000);
      })
    }
  };

  console.log("personArray", personArray);

  const toggleDeleteOf = (id) => {
    const personlUrl = urlServer + "/" + id;
    //console.log(`Got a click of ${id}`);
    const resultDelete = personArray.filter((info) => info.id !== id);
    if (window.confirm("Do you really want to delete?")) {
      //console.log("okay");
      axios.delete(personlUrl).then((response) => {
        //console.log("response.data", response.data);
        setPersonArray(resultDelete);
      }).catch(error=>{
        setMessage(`${newName} und ${newNumber} were already removed from server`);
        setTimeout(() => {
          console.log("setTimeout");
          setMessage(null);
        }, 3000);
      })
    } else {
      return null;
    }
    //console.log("personArray: ", personArray);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message = {isMessage} />
      <div>
        {" "}
        Filter shown with:{" "}
        <input onChange={inputFilterHandle} value={filterInfo} />
      </div>
      <h2>Add a New</h2>
      <form onSubmit={formHandle}>
        <div>
          {" "}
          name: <input onChange={inputNameHandle} value={newName} />
        </div>
        <div>
          {" "}
          number: <input onChange={inputNumberHandle} value={newNumber} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {personArray.map((personInfo) => (
        <p key={personInfo.name}>
          {personInfo.name} {personInfo.number}{" "}
          <button onClick={() => toggleDeleteOf(personInfo.id)}>delete</button>
        </p>
      ))}
      <h2>Filter Result</h2>
      <div>
        {filterArray.map((filterInfo) => (
          <p key={filterInfo.name}>
            {filterInfo.name} {filterInfo.number}
          </p>
        ))}
      </div>
    </div>
  );
};

export default App;
