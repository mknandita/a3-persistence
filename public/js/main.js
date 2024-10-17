// FRONT-END (CLIENT) JAVASCRIPT HERE

const submit = async function( event ) { //how is this connected to the submit button on the html page?
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  const number = document.querySelector( '#num' );

  if (number.value == ''){ 
    alert("please enter a target number")
    return false
  }
  
  const user = document.querySelector( '#user' ),
        guess = document.querySelector( '#guess' ),
        json = { user: user.value,
                 num: number.value,
                 guess: guess.value,
                 numTries: 1},
        body = JSON.stringify( json )
        //console.log(body)

  const response = await fetch( '/submit', {
    method:'POST', 
    headers: { "Content-Type": "application/json" },
    body //this is shorthand for body: body, but in JS if key and value are the same you can just write it once
  })

  const array = await response.json() 
  displayData(array)

}

const makeButton = function(type, index){
  let button = document.createElement('button')
    button.innerText = type
    button.index = index //index is a created variable

  return button
}

const checkGuess = function(target, guess){
  const diff = Math.abs(target-guess)
  switch(true){
    case diff === 0:
      return ("background-color:green")
      break

    case diff <= 5:
      return ("background-color:greenyellow")
      break
  
    case diff <= 15:
      return ("background-color:gold")
      break

    default:
      return ("background-color:red")
      break

  }
}

const displayData = function(array) {

  const table = document.querySelector('#scoreboard')
    const table_header = `<tr>
                            <th>Player</th>
                            <th>Target Number</th>
                            <th>Guess</th>
                          </tr>`

    table.innerHTML = table_header //clear table each time to just header

    for( let i = 0; i < array.length; i++){
      //make row element
        const data = array[ i ]
        const newAttemptRow = document.createElement('tr') 
        newAttemptRow.innerHTML =  `<td>${data.user}</td>
                              <td>${data.num}</td>
                              <td id="guess" class="NULL">${data.guess}<sub>Try #${data.numTries}</sub></td>
                              <td id="modCell" class="buttonCell"></sub></td>
                              <td id="delCell" class="buttonCell""></sub></td>`

        newAttemptRow.querySelector("#guess").style = checkGuess(data.num, data.guess);

        /* //i think i need to reload the stylesheet somehow for this to work
        console.log(newAttemptRow.querySelector("#guess").class)
        newAttemptRow.querySelector("#guess").class = checkGuess(data.num, data.guess); //classes match the color key
        console.log(newAttemptRow.querySelector("#guess").class)
        */
      //make delete button for that newAttemptRow
        const deleteBtn = makeButton("Delete Attempt", i)
        deleteBtn.onclick = async() => { 
          deleteBtn.style = "background-color:red"; //onclick has to be a function
          const response = await fetch( '/delete', { // '/delete' is the url that the request is going to go to
                                                    //sends a message to this address, then in server you have to say what to do when a message is sent here
            method:'POST', 
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ index:deleteBtn.index }) //body is what you're sending in the fetch request
                                                              //'deleteBtn.index' could just be i
          })
          const newArray = await response.json() //server will send back array with newAttemptRow deleted
          displayData(newArray) //update display to new array
        }

      //modify button (if guess is incorrect)
        if(data.num !== data.guess){
          const modifyBtn = makeButton("Try Again", i)
          modifyBtn.onclick = async() => {
            //replace row element with form where default values are current/premodified values
            const modifyElement = document.createElement('tr')
            modifyElement.innerHTML = `<tr>
                                        <td><input type="text" id="user" value="${data.user}"></td>
                                        <td><input type="number" id="num" value="${data.num}"> </td>
                                        <td><input type="range" id="guess" value="${data.guess}"></td>
                                        <td><button id="modSubmit">submit</button></td>
                                      </tr>`
            table.replaceChild( modifyElement, table.childNodes[i+1] ) //replace edited list item with form; i+1 to account for header
                                        
            const modSubmitBtn = modifyElement.querySelector('#modSubmit')
            modSubmitBtn.onclick = async function( event ) { //why does this need to be spelled out (vs delete button onclick)
              event.preventDefault() //what is this doing
              
              data.numTries++ //increment num of tries

              const user = modifyElement.querySelector( '#user' )
                    number = modifyElement.querySelector( '#num' ),
                    guess = modifyElement.querySelector( '#guess' ),
                    json = { user: user.value, 
                            num: number.value,
                            guess: guess.value,
                            index: i,
                            numTries: data.numTries},
                    body = JSON.stringify( json )
                    //console.log(body)
            
              const response = await fetch( '/modify', {
                method:'POST',
                headers: { "Content-Type": "application/json" }, 
                body //this is shorthand for body: body, but in JS if key and value are the same you can just write it once
              })
              const newArray = await response.json() //server will send back array with newAttemptRow modified
              displayData(newArray) //update display to new array
            }

          } 
          newAttemptRow.querySelector('#modCell').appendChild(modifyBtn)      
        }
    
      newAttemptRow.querySelector('#delCell').appendChild( deleteBtn )

      table.appendChild( newAttemptRow )
      
    }
}

window.onload = function() {
   const submitField = document.querySelector("button");
   submitField.onclick = submit;


}