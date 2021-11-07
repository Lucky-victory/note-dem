const newNoteTitle = document.querySelector("#new_note_title");
const newNoteCategory = document.querySelector("#new_note_category");
const newNoteBody = document.querySelector("#new_note_body");
const notesContainer = document.querySelector(".notes-container");

function generateID() {
  
  let randomID = Math.random().toString(16).substring(2);
  return (
    randomID
  )
}


class NoteLounge {
  static saveNote(newNote) {
    const Notes = NoteLounge.getAllNotes();
    const alreadyExist = Notes.find((note) => note.id == newNote.id);

    if (alreadyExist) {
      alreadyExist.title = newNote.title;
      alreadyExist.category = newNote.category;
      alreadyExist.body = newNote.body;
      alreadyExist.pubdate = new Date().getTime();
    }
    else {
      newNote.id = 'note_' + generateID() + '_' + new Date().getTime();
      newNote.pubdate = new Date().getTime();
      Notes.push(newNote)
    }
    localStorage.setItem('note-lounge', JSON.stringify(Notes));

  }
  static getAllNotes() {
    const allNotes = JSON.parse(localStorage.getItem('note-lounge')) || '[]';
    return allNotes.sort((a, b) => b.pubdate - a.pubdate);
  }
  static deleteNote(id) {
    const Notes = NoteLounge.getAllNotes();
    let filteredNotes = Notes.filter((note) => note.id != id);
    localStorage.setItem('note-lounge', JSON.stringify(filteredNotes));
  }
  static editNote(id){
    const Notes = NoteLounge.getAllNotes();
    const singleNote = Notes.find((note)=> note.id == id);
    return singleNote;
  }
}
class NotePasse extends NoteLounge{
  constructor(container){
    super()
    this.container= document.querySelector(container);
    this.noteElems=container.querySelectorAll('.notes');
    this.noteElems.forEach((noteElem)=>{
      noteElem.addEventListeners('click',(evt)=>{
        this.clickNote(evt)
      })
    })
    
  }
  clickNote(evt){
const clickedNote=evt.currentTarget;
console.log(clickedNote);
}
}


function addNote() {
  let n = NoteLounge.getAllNotes();
  let l = NoteLounge.saveNote({
    title: 'sixth post ',
    body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium cupiditate minima, libero commodi consectetur, voluptas voluptatum reiciendis maiores sint architecto repella ',
    category: 'test cat 7'
  })
  console.log(n);
}
// addNote()


function timeFormatter(timeInMs = new Date().getTime()) {
  const date = new Date(timeInMs);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  const year = date.getFullYear();
  const day = date.getDate();
  const weekDay = weekDays[date.getDay()];
  const month = months[date.getMonth()];
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const am_pm = hours > 12 ? 'PM' : 'AM';
  const hrs = (hours % 12) || 12;
  const mins = minutes < 10 ? '0' + minutes : minutes;;
  return {
    am_pm,
    hrs,
    mins,
    month,
    weekDay,
    day,
    year,
  
  }

}


function renderNotesToView() {
  const TF = timeFormatter;
  const notes = NoteLounge.getAllNotes()
  let html = '';
  if (notes.length) {
    notes.map((note) => {
      html += `
          <div class="note">
          <h2 class="note__title">${note.title}</h2>
          <div class="note__body">
          ${note.body}
          </div>
          <div class="note__category-pubdate">
            <span class="note__category">
            category: <span>${note.category}</span>
            </span>
            <span class="note__pubdate">
            ${new Date(note.pubdate).toLocaleString(undefined,{dateStyle:'long',timeStyle:'medium'})}</span>
          </div>
</div>
  `

    });
    notesContainer.innerHTML = html;
  }
  else {
    notesContainer.innerHTML = `
    <div class="no-notes-yet-container">
      'no notes yet'
      <button type="button" class="create-note-btn"> create a note </button>
  </div>  `
  }
}
renderNotesToView();