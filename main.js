import NoteAPI from './note-api';
import generateID from './generate-id'
import Notes from './notes';
// const newNoteTitle = document.querySelector("#new_note_title");
// const newNoteCategory = document.querySelector("#new_note_category");
// const newNoteBody = document.querySelector("#new_note_body");
// const notesContainer = document.querySelector(".notes-container");



class NotePasse {
  constructor(container){
   //  this.addNote()
   const cont=Object.prototype.toString.call(container);
   this.container=null;
   if(typeof container == 'object' && cont.includes('HTML')){
      
    this.container= container
   }
else{
   
    this.container= document.querySelector(container);
}
    // renders the html template for the note app.
    this.container.innerHTML=this._loadTemplate();

   this.newNoteContainer = document.querySelector(".new-container");
   this.notesContainer = document.querySelector(".all-notes-container");
   
   this.backBtn = document.querySelector(".back-home-btn");
   this.addNewNoteBtn = document.querySelector("#add_new_note_btn");
    this.addNewNoteBtn.addEventListener('click',()=>{
    this.showNewNoteFields()
    })
    this.backBtn.addEventListener('click',()=>{
    this.goHome()
    })
   this.newNoteTitle = document.querySelector("#new_note_title");
   
   this.newNoteBody = document.querySelector("#new_note_body");
   this.noteToEdit = null;
   this.noteId = null;
   
   // renders the previous notes
   this.renderNotesToView();
   
     [this.newNoteBody, this.newNoteTitle].forEach((newNoteVal) => {
      newNoteVal.addEventListener('blur', () => {
   
         this.resaveNote();
   
      });
   })    
   

  }
  showNewNoteFields(){
     this.newNoteContainer.classList.add('view');
     this.newNoteTitle.focus();
       const id = generateID('note_', '_' + new Date().getTime());
       this.noteId=id;
     this.newNoteContainer.setAttribute('data-note-id',id);
     this.addNote()

  }
  hideNewNoteFields(){
     this.newNoteContainer.classList.remove('view');
     this.noteId=null;
     this.newNoteTitle.blur()
  }
  _loadTemplate(){
     return (` <div class="all-notes-container"></div>
     
     <div class='new-container'>
        <button type='button' class='back-home-btn'>
  
           <span class='material-icons-outlined'>west </span>
  
  
        </button>
       <div class='new-note-container'>
           <div class="form-group">
              <input type="text" class="new-note-title" id="new_note_title" placeholder="Title"/>
           </div>
           <textarea id="new_note_body" class="new-note-body" placeholder="Note" value=""></textarea>
        </div>
     </div>   
  </div>
   <div class="bottom-nav">
      
   <button class="create-note-btn" id="add_new_note_btn" >
         <span class="btn-title">create note</span>
         <span class="btn-icon"></span>
   </button>
      
`)
  }
  clickNote(evt){
const clickedNote=evt.currentTarget;
const allNotes=NoteAPI.getAllNotes();
this.noteId = clickedNote.dataset.noteId
const Note=NoteAPI.getSingleNote(this.noteId);
const noteElems = this.container.querySelectorAll('.note');
noteElems.forEach((noteElem) => {
  noteElem.classList.remove('active');
})
this.container.querySelector(`.note[data-note-id="${this.noteId}"]`).classList.add('active');
// this.newNoteTitle.focus()
this.newNoteTitle.value=Note.title ;
this.newNoteBody.value=Note.body ;
this.newNoteContainer.classList.add('view')


}
resaveNote(){
  const U=this.Utils();
  const body=this.newNoteBody.value
  const title=this.newNoteTitle.value;
  if(U.isEmptyString(title) && U.isEmptyString(body)) return;
  this.noteToEdit = {
    body,
    title,
    id:this.noteId
  }
  NoteAPI.saveNote(this.noteToEdit);
  
}
refreshNotes(){
  this.renderNotesToView()
  
}

Utils(){
  return {
    isEmptyString(val){
      return (val.trim() === '');
    }
  }
}
renderNotesToView() {

  Notes(this.notesContainer);
  const noteElems = this.container.querySelectorAll('.note');
  noteElems.forEach((noteElem) => {
    noteElem.addEventListener('click', (evt) => {
      this.clickNote(evt)
    });
    noteElem.addEventListener('dblclick', (evt) => {
      this.deleteANote(evt);
    });
  })
}
deleteANote(evt){
  const noteId=evt.currentTarget.dataset.noteId;
  const canDelete=confirm('Are you sure want to delete this Note?');
  if(canDelete){
    
  NoteAPI.deleteNote(noteId);
  this.refreshNotes();
  this.resetInputFields()
  }
}
addNote() {
  let n = NoteAPI.getAllNotes();
  let l = NoteAPI.addNote({
     id:this.noteId,
    title: '',
    body: ''});
  
}
resetInputFields(){
  this.newNoteBody.value = ''
  this.newNoteTitle.value = '' 
}
discardEmptyNote(){
   const U=this.Utils();
      const currentID=this.noteId
   const note=NoteAPI.getSingleNote(currentID);
   if(note && (U.isEmptyString(note.body) && U.isEmptyString(note.title))){
    NoteAPI.deleteNote(currentID);
    
   }

}
goHome(){
this.discardEmptyNote()
   this.renderNotesToView();
   this.resetInputFields();
   this.hideNewNoteFields()
}
}


const notePasse=new  NotePasse('#root')
