const express = require('express'),
      app = express(),
      appdata = []

app.use(express.static('public'))
app.use(express.json())
app.get('/', (req, res)=>res.send('hello world'))

app.post('/submit', express.json(), (req, res) => {
  req.body.index = appdata.length //adds an index value to any new input (this wasnt causing issues w/o but idk seems useful)
  appdata.push(req.body)
  res.writeHead(200, {'Content-Type': 'application/json'})
  res.end(JSON.stringify(appdata))
})

app.post('/delete', express.json(), (req, res) => {
  appdata.splice( req.index, 1) //index to start, how many items to slice
  res.writeHead(200, {'Content-Type': 'application/json'})
  res.end(JSON.stringify(appdata))
})

app.post('/modify', express.json(), (req, res) => {
  console.log(appdata.at(req.index))
  console.log(req.body)
  appdata.fill( req.body, req.index-1, req.index ) //this works with index, index+1 in manual server -- why?
  console.log(appdata.at(req.index)) 
  console.log(appdata.at(req.index+10)) 
  res.writeHead(200, {'Content-Type': 'application/json'})
  res.end(JSON.stringify(appdata))
})


const listener = app.listen( process.env.PORT || 3000 )
/* const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you're testing this on your local machine.
      // However, Glitch will install it automatically by looking in your package.json
      // file.
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000

const appdata = []
let counter = 0; //i want to send this back to keep track of how many list items were ever created

const server = http.createServer( function( request,response ) {
  if( request.method === 'GET' ) {
    handleGet( request, response )    
  }else if( request.method === 'POST' ){
    handlePost( request, response ) 
  }
})

const handleGet = function( request, response ) {
  const filename = dir + request.url.slice( 1 ) 

  if( request.url === '/' ) {
    sendFile( response, 'public/index.html' )
  }else{
    sendFile( response, filename )
  }
}

const handlePost = function( request, response ) {
  let dataString = ''

  request.on( 'data', function( data ) {
      dataString += data 
  })

  request.on( 'end', function() {
    let data = JSON.parse( dataString )
    //console.log( data )

    //appdata.push( JSON.parse( dataString ) ) //add to appdata array
                                              //only want to push if is a call to submit not delete

    if (request.url  === '/submit'){
      appdata.push( data ) //add to appdata array
      counter++
    } else if (request.url === '/delete'){
      appdata.splice( data.index, 1) //index to start, how many items to slice
    }else if (request.url === '/modify'){
      appdata.fill( data, data.index, data.index+1 ) 
    }

    // ... do something with the data here!!!

    response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
    response.end( JSON.stringify( appdata ))
  })
}

const sendFile = function( response, filename ) {
   const type = mime.getType( filename ) 

   fs.readFile( filename, function( err, content ) {  //readFile is a Node function
                                                      //the function created here as a param is a callback function
                                                      //callback funct is called after reading the file and takes 2 params:
                                                        //err - if any error occurred
                                                        //content - content of the file


     // if the error = null, then we've loaded the file successfully
     if( err === null ) {

       // status code: https://httpstatuses.com
       response.writeHeader( 200, { 'Content-Type': type })
       response.end( content )

     }else{

       // file not found, error code 404
       response.writeHeader( 404 )
       response.end( '404 Error: File Not Found' )

     }
   })
}

server.listen( process.env.PORT || port )
 */