const newNoteTitle = document.querySelector("#new_note_title");
// const newNoteCategory = document.querySelector("#new_note_category");
const newNoteBody = document.querySelector("#new_note_body");
// const notesContainer = document.querySelector(".notes-container");

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
    const allNotes = JSON.parse(localStorage.getItem('note-lounge') || '[]');
    if(allNotes.length){
      
    return allNotes.sort((a, b) => b.pubdate - a.pubdate);
    }
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
class NotePasse {
  constructor(container){
    
    this.container= document.querySelector(container);
    this.newNoteTitle = document.querySelector("#new_note_title");
    // this.newNoteCategory = document.querySelector("#new_note_category");
    this.newNoteBody = document.querySelector("#new_note_body");
    this.noteToEdit=null;
    this.noteId=null;
    this.renderNotesToView();
    
  this.newNoteBody.addEventListener('blur',()=>{this.saveANote(this.noteToEdit)});  
  [this.newNoteBody,this.newNoteTitle].forEach((newNoteVal)=>{
  newNoteVal.addEventListener('keyup',()=>{
    this.resaveNote()
  });
  })
  }
  clickNote(evt){
const clickedNote=evt.currentTarget;
const allNotes=NoteLounge.getAllNotes();
this.noteId = clickedNote.dataset.noteId
const Note=NoteLounge.editNote(this.noteId)

this.newNoteTitle.value=Note.title || '';
this.newNoteBody.value=Note.body || '';
// this.newNoteCategory.value=Note.category || ''

}
resaveNote(){
  const U=this.Utils();
  const body=U.isEmptyString(this.newNoteBody.value) ? '' : this.newNoteBody.value;
  const title=U.isEmptyString(this.newNoteTitle.value) ? '' : this.newNoteTitle.value;
  // const category=U.isEmptyString(this.newNoteCategory.value) ? '' : this.newNoteCategory.value;
  
  this.noteToEdit = {
    body,
    title,
    id: this.noteId
  }
}
refreshNotes(){
  NoteLounge.getAllNotes();
}
saveANote(note){
  NoteLounge.saveNote(note);
  this.renderNotesToView()
  
}
Utils(){
  return {
    isUndefined(val){
      return (Object.prototype.toString.call(val) === 'object Undefined');
    },
    isEmptyString(val){
      return (val.trim() === '');
    }
  }
}
renderNotesToView() {
const MAX_BODY_LENGTH=70;
  const notes = NoteLounge.getAllNotes()
  let html = '';
  if (notes.length) {
    notes.map((note) => {
      html += `
          <div class="note" data-note-id='${note.id}'>
          <h2 class="note__title">${note.title}</h2>
          <div class="note__body">
          ${note.body.substring(0,MAX_BODY_LENGTH)}
          ${note.body.length > MAX_BODY_LENGTH ? '...' : ''}
          </div>
          <div class="note__category-pubdate">
            <span class="note__category">
            ${note.category ? `category: <span>${note.category}</span>`
           : '' }
            </span>
            <span class="note__pubdate">
            ${new Date(note.pubdate).toLocaleString(undefined,{dateStyle:'long',timeStyle:'medium'})}</span>
          </div>
</div>
  `

    });
    this.container.innerHTML='';
    this.container.insertAdjacentHTML('beforeend',html);
  }
  else {
    this.container.innerHTML = `
    <div class="no-notes-yet-container">
      'no notes yet'
      <button type="button" class="create-note-btn"> create a note </button>
  </div>  `
  }
  const noteElems = this.container.querySelectorAll('.note');
  noteElems.forEach((noteElem) => {
    noteElem.addEventListener('click', (evt) => {
      this.clickNote(evt)
    })
  })
}

}

function addNote() {
  let n = NoteLounge.getAllNotes();
  let l = NoteLounge.saveNote({
    title: 'sixth post ',
    body: 'Lor!!em ipsum dolor sit amet, consectetur adipisicing elit. Accusantium cupiditate minima, libero commodi consectetur, voluptas voluptatum reiciendis maiores sint architecto repella ',
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


// renderNotesToView();
new  NotePasse('.notes-container')
