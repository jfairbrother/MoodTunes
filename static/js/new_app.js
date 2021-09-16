
let popularity;
let length;
let danceability;
let acounticeness;
let energy;
let instrumentalness;
let liveness;
let valence;
let loudness;
let speechiness;
let tempo;
let key;
let time_signature;



var colors = new Array(
    [62, 35, 255],
    [60, 255, 60],
    [255, 35, 98],
    [45, 175, 230],
    [255, 0, 255],
    [255, 128, 0]);

var colorsEnergetic = new Array(
    [63, 229, 251],
    [226, 228, 107],
    [173, 192, 78],
    [252, 70, 107],
)

var colorsFrantic = new Array(
    [251, 63, 63],
    [155, 107, 228],
    [173, 192, 78],
    [252, 70, 107],
)

var colorsSad = new Array(
    [21, 254, 250],
    [11, 31, 119],
    [0, 147, 252],
    [3, 135, 251],
    [106, 101, 171],
    [160, 255, 253],
)

var colorsDepressed = new Array(
    [11, 113, 149],
    [6, 6, 6],
    [5, 20, 29],
    [3, 135, 251],
    [17, 29, 41],
    [125, 132, 144],
    [0, 0, 0],

)

var colorsCalm = new Array(
    [72, 107, 8],
    [100, 156, 88],
    [205, 221, 113],
    [179, 211, 197],
    [196, 233, 148],

)

var colorsContent = new Array(
    [238, 174, 202],
    [148, 188, 233],
    [112, 152, 196],
    [242, 191, 213],

)

var colorsHappy = new Array(
    [255, 155, 155],
    [215, 232, 90],
    [224, 183, 246],
    [230, 189, 255],

)

var colorsExuberant = new Array(
    [251, 191, 63],
    [221, 144, 217],
    [244, 7, 133],
    [248, 255, 151],
    [151, 255, 239],
    [106, 101, 171],
    [252, 70, 106],

)

function determineMood(res) {

    let colors = [];
    console.log(energy);

    if (energy < .16) {
        if (valence < .20) {
            colors = colorsContent;
            console.log('content');

            $('#mood-print').html(
                'CONTENT'
            );
            
        } 
        
        else {
            colors = colorsCalm;
            console.log('calm');

            $('#mood-print').html(
                'CALM'
            );

        }

    } else if (energy < .5) {
        if (valence < .2) {
            colors = colorsDepressed;
            console.log('depressed');

            $('#mood-print').html(
                'DEPRESSED'
            );
        } 
        
        else {
            colors = colorsSad
            console.log('sad');

            $('#mood-print').html(
                'SAD'
            );
        }

    } else if (energy < .8) {
        if (valence >= .45) {
            colors = colorsHappy;
            console.log('exuberant');

            $('#mood-print').html(
                'Happy'
            );
        } 
        
        else {
            colors = colorsHappy;
            console.log('happy');

            $('#mood-print').html(
                'Happy'
            );
        }

    } else if (energy >= .8) {
        if (valence > .5) {
            colors = colorsFrantic;
            console.log('frantic');

            $('#mood-print').html(
                'FRANTIC'
            );
        } 
        
        else {
            colors = colorsEnergetic;
            console.log('energetic');

            $('#mood-print').html(
                'ENERGETIC'
            );
        }

    }


    return colors;
}



//AJAX GET to get new colors 
// create a route for json -> GET on route -> Array of Arrays on backend (RGB)

let step = 0;
//color table indices for: 
// current color left
// next color left
// current color right
// next color right
const colorIndices = [0, 1, 2, 3];

//transition speed
const gradientSpeed = 0.002;

function updateGradient(colors) {

    if ($ === undefined) return;

    const c0_0 = colors[colorIndices[0]];
    const c0_1 = colors[colorIndices[1]];
    const c1_0 = colors[colorIndices[2]];
    const c1_1 = colors[colorIndices[3]];

    const istep = 1 - step;
    const r1 = Math.round(istep * c0_0[0] + step * c0_1[0]);
    const g1 = Math.round(istep * c0_0[1] + step * c0_1[1]);
    const b1 = Math.round(istep * c0_0[2] + step * c0_1[2]);
    const color1 = "rgb(" + r1 + "," + g1 + "," + b1 + ")";

    const r2 = Math.round(istep * c1_0[0] + step * c1_1[0]);
    let g2 = Math.round(istep * c1_0[1] + step * c1_1[1]);
    let b2 = Math.round(istep * c1_0[2] + step * c1_1[2]);
    let color2 = "rgb(" + r2 + "," + g2 + "," + b2 + ")";

    $('#mood-graphic').css({
        background: "-webkit-gradient(linear, left top, right top, from(" + color1 + "), to(" + color2 + "))"
    }).css({
        background: "-moz-linear-gradient(left, " + color1 + " 0%, " + color2 + " 100%)"
    });

    step += gradientSpeed;
    if (step >= 1) {
        step %= 1;
        colorIndices[0] = colorIndices[1];
        colorIndices[2] = colorIndices[3];

        //pick two new target color indices
        //do not pick the same as the current one
        colorIndices[1] = (colorIndices[1] + Math.floor(1 + Math.random() * (colors.length - 1))) % colors.length;
        colorIndices[3] = (colorIndices[3] + Math.floor(1 + Math.random() * (colors.length - 1))) % colors.length;

    }
}

//   setInterval(updateGradient(color),10);



$(document).ready(() => {

    // alert('Javascript loaded'); 

    $('#track_search').on('submit', (event) => {
        // results of song search on submit
        event.preventDefault();
        // default_display_state()
        // refresh with new search
        $('#search_results').empty();

        const data = { "name": $("#track_search_input").val() };
        console.log("hi hi hi hereeeee");
        $.post('/track_api.json', data, (response) => {
            // Loop through JSON response data from Spotify API
            console.log("hi hi hi hi ");
            console.log(response);
            // empty song search dict
            const track_data = {};

            for (const element of response) {

                $('#search_results').append(
                    // make id the value            
                    `
                    <div padding-left= 100px display= 'inline-block'>
                    

                        <img  src=' ${element.track_img}' type="button"  name="select_song" id="${element.track_id}"
                        width="200" height="200">
                         
                        <label id="${element.track_uri}" for="${element.track_name}"> 
                        
                        </label>       

                    </div>
                    `);
                  
            

                $(`#${element.track_id}`).on('click', () => {
                    console.log('hi im in here');
                    // default_display_state()
                    $('#search_results').remove();
                    $('#select-track').remove();
                    $('#track_search').remove();
                    // $('body').append('<section id = "mood-graphic"> </section>');
                    $.get(`/selectedTrack/${element.track_id}`, (res) => {
                        console.log('now inside get request');
                       
                        loudness = res.loudness;
                        danceability = res.danceability;
                        energy = res.energy;
                        valence = res.valence;
                        tempo = res.tempo;
                        time_signature = res.time_signature;

                        

                        console.log(res);
                        $('#mood-graphic').html(
                            // make id the value   
                            
                            `
                            <p id='mood-print'></p>
                            
                            <div id= song-results class= background toggle >

                                    <div class= results >
                                        <br>
                                        <br>
                                        <br>
                                        <p> ${res.name} - ${res.artist} </p>
                                        <br>
                                        <p> DANCEABLITY: ${res.danceability} </p>
                                        <p> VALENCE: ${res.valence} </p>
                                        <p> ENERGY: ${res.energy} </p>
                                        <p> LOUDNESS: ${res.loudness} </p>
                                        <p> TEMPO: ${res.tempo} </p>
                                        <p> TIME SIGNATURE: ${res.time_signature} </p>
                                    </div>

                                    <button id=button type="button">
                                        See Why?
                                    </button>
                            </div>`);
                            
                        const color = determineMood(res);


                        setInterval(function () { updateGradient(color); }, 10);
                               
                            $("#button").on("click", (evt) => {
                                evt.preventDefault();
                
                                $('.background').toggleClass('toggle');
                                $('.results').toggleClass('toggle'); 

                            });

                       
                    });

                  
                });


            }

        });

    });



});

