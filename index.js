console.log("starting up!!");

const express = require('express');
const methodOverride = require('method-override');
const pg = require('pg');

// Initialise postgres client
const configs = {
  user: 'kenneththesheep',
  host: '127.0.0.1',
  database: 'tunr_db',
  port: 5432,
};

const pool = new pg.Pool(configs);

pool.on('error', function (err) {
  console.log('idle client error', err.message, err.stack);
});

/**
 * ===================================
 * Configurations and set up
 * ===================================
 */

// Init express app
const app = express();


app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(methodOverride('_method'));


// Set react-views to be the default view engine
const reactEngine = require('express-react-views').createEngine();
app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', reactEngine);




/**
 * ===================================
 * Routes
 * ===================================
 */
////Blank page
app.get('/', (request, response) => {
  // query database for all artist

  // respond with HTML page displaying all arist
  response.send('hello world');
});


////Show all Artists
app.get('/artists',(request,response)=>{
    const queryString = 'SELECT * from artists';

pool.query(queryString, (err, result) => {

  if (err) {
    console.error('query error:', err.stack);
    response.send( 'query error' );
  } else {
    //console.log('query result:', result);
    const data={};

    data.artist=result.rows;
    // redirect to home page

    response.render("home",data);
    //response.send( data );
  }
});
    //response.render('home');
});


//////This goes to the form

app.get('/artists/new', (request, response) => {
  // respond with HTML page with form to create new pokemon
  response.render('new');
});

/////////This is where input is manipulated for new artist
app.post('/artists',(request,response)=>{
    const whenQueryDone = (queryError, result) => {
    if( queryError ){
      console.log("EERRRRRRRROR");
      console.log(queryError);
      response.status(500);
      response.send('db error');
    }else{
      // if the query ran wiothout errors
      console.log(result.rows[0]);
      // response.send('HEY NEW DOOOGGGG::: '+ result.rows[0].id);

      let new_id = result.rows[0].id;
      let url= "/artists/"+new_id;
      response.redirect(url);
    }
  };

    const queryString = "INSERT INTO artists (name, photo_url, nationality) VALUES ($1, $2, $3) RETURNING id";

    const input=[request.body.name, request.body.img, request.body.nationality];
    console.log(input);


    pool.query(queryString, input, whenQueryDone);

});

app.get('/artists/:id', (request, response) =>
    {
        // respond with HTML page with form to create new pokemon
        console.log(typeof request.params.id);
        const queryString = 'SELECT * from artists WHERE id = ($1)';
        const input = [request.params.id]
        pool.query(queryString, input, (err, result) =>
            {

                if (err)
                    {
                        console.error('query error:', err.stack);
                        response.send( 'query error' );
                    }
                else
                    {

                        const data={};
                        data.artist=result.rows;
                        response.render("artist",data);
            //response.send( data );
                    }
            });
    });
//////form to edit
app.get('/artists/:id/edit',(request,response)=>{
    //console.log("enter edit")
    const data={}
    //response.send("Edit mode");
    const queryString = 'SELECT * from artists WHERE id = ($1)';
    const input = [request.params.id]
        pool.query(queryString, input, (err, result) =>
            {

                if (err)
                    {
                        console.error('query error:', err.stack);
                        response.send( 'query error' );
                    }
                else
                    {


                        data.artist=result.rows;
                        response.render("editArtist",data);
                        //response.send( data );
                    }
            });

})
//// process of edit

app.put('/artists/:id', (request,response)=>{


     const data={};
     console.log(request.body);
     const queryString= "UPDATE artists SET name= ($2) , photo_url= ($3), nationality= ($4) WHERE id = ($1)";
     const id=request.params.id;
    const input = [request.params.id, request.body.name, request.body.img, request.body.nationality];
        pool.query(queryString, input, (err, result) =>
            {

                if (err)
                    {
                        console.error('query error:', err.stack);
                        response.send( 'query error' );
                    }
                else
                    {


                        data.artist=result.rows;

                        //response.render("editArtist",data);
                        let url= "/artists/"+id;
                        response.redirect(url);
                        //response.send( data );
                    }
            });
})
///delete artist
//Accepts a request to delete
app.delete('/artists/:id', (request,response)=>{

     const queryString= "DELETE FROM artists WHERE id = ($1)";
     const id=request.params.id;
        const input = [request.params.id];
        pool.query(queryString, input, (err, result) =>
            {

                if (err)
                    {
                        console.error('query error:', err.stack);
                        response.send( 'query error' );
                    }
                else
                    {
                        response.redirect('/artists')
                    }
            });
    })



//////For artist songs

app.get('/artists/:id/songs', (request, response) =>
    {
        // respond with HTML page with form to create new pokemon

        const data={}
        const queryString = 'SELECT title,album, artwork from songs WHERE artist_id = ($1)';
        const input = [request.params.id]
        pool.query(queryString, input, (err, result) =>
            {

                if (err)
                    {
                        console.error('query error:', err.stack);
                        response.send( 'query error' );
                    }
                else
                    {


                        data.songs=result.rows;
                        const queryArtistString = 'SELECT * from artists WHERE id = ($1)';
                        pool.query(queryArtistString, input, (err, result) =>
                        {

                            if (err)
                                {
                                    console.error('query error:', err.stack);
                                    response.send( 'query error' );
                                }
                            else
                                {


                                data.artist=result.rows;
                                response.render("artistSong",data);
                                //response.send( data );
                                }
            });
                    }
            });
    });




/**
 * ===================================
 * Listen to requests on port 3000
 * ===================================
 */
const server = app.listen(3000, () => console.log('~~~ Tuning in to the waves of port 3000 ~~~'));

let onClose = function(){

  console.log("closing");

  server.close(() => {

    console.log('Process terminated');

    pool.end( () => console.log('Shut down db connection pool'));
  })
};

process.on('SIGTERM', onClose);
process.on('SIGINT', onClose);