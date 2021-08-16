
function drawBackground() {
  background(220);
  stroke("black");
  line(10, offsetVertical, width - 10, offsetVertical);
}



function drawPartitura(midi) {
  if (midi === undefined) return;

  const t = isPlaying===true ?  (Tone.now() - realTime) : realTime
  stroke(0, 30);
  fill(0, 0, 0, 30);

  midi.tracks.forEach((track, trackIndex) => {
    track.notes.forEach((note, noteIndex) => {
      // Restrict numbers of notes no visibles
      if(note.time > t+3+1) return
      if(note.time < t-7) return
     
      rect(
        note.midi * noteSeparation + offsetHorizontal,
        (+t - note.time) * noteHeight + offsetVertical,
        noteWidth,
        -note.duration * noteHeight
      );

      
    });
  });
}

function drawNameNotes() {
  fill("black");
  noStroke();
  textSize(8);
  for (let i = 21; i < 108; i++) {
    if(bemoles.includes(i))  fill('blue')
    else fill('black')
    if(i==60) fill('red')
    let v = i;
    text(v, v * noteSeparation + offsetHorizontal, 10);
    text(
      Tone.Frequency(v, "midi").toNote(),
      v * noteSeparation + offsetHorizontal,
      20
    );

  }
}

function drawLeds() {
    noFill();
    stroke("black");
    const numRows  = 16
    for (let i = 21; i < 108; i++) {
      for (let j = 0; j < 16*separation; j+=separation) {
          rect(i * noteSeparation + offsetHorizontal, 
             - j * noteHeight + offsetVertical, 
            noteWidth, 
            10);
      }
    }
  }


 function drawAll(notesToSend){

  drawBackground();
  if (showPartiture) drawPartitura(midi);
  drawNameNotes();
  if (showLeds) drawLeds();

  noStroke();
  notesToSend.forEach( (note, noteIndex) => {

    fill(note.r, note.g, note.b);
    rect(
      note.midi * noteSeparation + offsetHorizontal,
      -note.timeOffset * noteHeight + offsetVertical  ,
      noteWidth,
     10
    );
  })
}


function calculeNotesToDisplay(){

  listNotes = []

  let ligthDistance = 0;
  let ligthDistanceIncrement = separation;
  for(let i=0;i<16;i++){
  listNotes = listNotes.concat(calculeNotesToDisplayAtTime(ligthDistance) )
   ligthDistance += ligthDistanceIncrement;
  }
  return listNotes
}


function calculeNotesToDisplayAtTime(timeOffset){


  let listNotes = []
  const t = isPlaying===true ?  (Tone.now() - realTime) : realTime


  midi.tracks.forEach( (track,trackIndex) => {
    let notes = getNotesOfTime(t + timeOffset, trackIndex);
    notes.forEach((note, noteIndex) => {

      let c = calculeNoteColor(t, note, timeOffset, trackIndex);
      /*c.r = 255
      c.g=0
      c.b=0*/
    //const row = Math.round( (3*timeOffset)/0.2 )
    const row = Math.round( (timeOffset/separation)/1 )
    

    listNotes.push({r:c.r, g:c.g, b:c.b, row:row, col:note.midi, /*disp: dispNumber, numPix: numPix,*/ midi:note.midi, timeOffset:timeOffset} )
  });
  })
 return listNotes
}