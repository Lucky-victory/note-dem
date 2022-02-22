import NoteAPI from './note-api';
import generateID from './generate-id'
import Notes from './notes';
import { customAlert } from './custom-alert';
class NotePasse {
  constructor(container){
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

    // gets all notes from localStorage
this.Notes=NoteAPI.getAllNotes();

// checks if the user is searching
this.isSearching=false;
this.notesToDelete=[];
// this.container.oncontextmenu=((evt)=> {evt.preventDefault(); return false})
   this.newNoteContainer = this.container.querySelector(".new-container");
   this.notesContainer = this.container.querySelector(".all-notes-container");
   
   this.backBtn = this.container.querySelector(".back-home-btn");
   this.addNewNoteBtn = this.container.querySelector("#add_new_note_btn");
    this.addNewNoteBtn.addEventListener('click',()=>{
    this.showNewNoteFields()
    })
    this.backBtn.addEventListener('click',()=>{
    this.goHome()
    })
   this.newNoteTitle = this.container.querySelector("#new_note_title");
   this.searchBox=this.container.querySelector('.search-box');
   this.newNoteBody = this.container.querySelector("#new_note_body");
   this.deleteBtnWrapper=this.container.querySelector('.delete-btn-wrapper');
   this.deleteBtn=this.container.querySelector('.delete-btn');
   this.noteToEdit = null;
   this.noteId = null;

   this.deleteBtn.addEventListener('click',()=>{
     this.deleteNotes();
   })
   this.searchBox.addEventListener('keyup',(evt)=>{
     this.searchNotes(evt)
   })
   // renders the previous notes
   this.renderNotesToView();
   
     [this.newNoteBody, this.newNoteTitle].forEach((newNoteVal) => {
      newNoteVal.addEventListener('keyup', () => {
   
         this.resaveNote();
   
      });
   });   
     [this.newNoteBody, this.newNoteTitle].forEach((newNoteVal) => {
      newNoteVal.addEventListener('blur', () => {
   
         this.resaveNote();
   
      });
   })   ;
   

  }
  searchNotes(evt){
    this.isSearching=true;
    const query=evt.target.value;
    const U=this.Utils();
    if(U.isEmptyString(query)){
      this.Notes=NoteAPI.getAllNotes()
      this.renderNotesToView();
      return
    }
    const Notes=NoteAPI.getAllNotes();
    const results=Notes.filter((note)=>{
return (note.title.includes(query) || note.body.includes(query))
    });
    this.Notes=results;
    this.renderNotesToView()
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
     return (`
     <div class='delete-btn-wrapper'>
     <button type='button' class='delete-btn'>
     <span class='material-icons-outlined'>delete</span>
     </button>
     </div>
     <div class='search-box-wrapper'><input type='search' placeholder='Search Notes' class='search-box'/></div>
     <div class="all-notes-container"></div>
     
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
this.noteId = clickedNote.dataset.noteId
const Note=NoteAPI.getSingleNote(this.noteId);
const noteElems = this.container.querySelectorAll('.note');
noteElems.forEach((noteElem) => {
  noteElem.classList.remove('active');
})
this.container.querySelector(`.note[data-note-id="${this.noteId}"]`).classList.add('active');
this.newNoteTitle.focus()
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
selectToDelete(evt){
  const target=evt.currentTarget;
  target.classList.add('selected');
  const {noteId}=target.dataset;
  const note=NoteAPI.getSingleNote(noteId)
  const isSelected=this.notesToDelete.find((note)=>note.id == noteId);
if(target.classList.contains('selected') && !isSelected){
this.notesToDelete.push(note);
}
else{
  target.classList.remove('selected');
  this.notesToDelete=this.notesToDelete.filter((note)=> note.id !== noteId);
}
if(this.notesToDelete.length >0){
  this.deleteBtnWrapper.classList.add('show')
}
else this.deleteBtnWrapper.classList.remove('show');
}
renderNotesToView(notes=this.Notes) {
const {notesContainer,isSearching}=this
  Notes({notesContainer,notes,isSearching});
  const noteElems = this.container.querySelectorAll('.note');
  const downEvents=['mousedown','touchstart'];
  noteElems.forEach((noteElem) => {
    noteElem.addEventListener('click', (evt) => {
      this.clickNote(evt);
      evt.stopImmediatePropagation();
    });
    noteElem.addEventListener('contextmenu', (evt) => {
      evt.preventDefault();
      return false
    });
    for(const type of downEvents){
      noteElem.addEventListener(type, (evt) => {
        this.selectToDelete(evt);
        evt.stopImmediatePropagation()
      })
    }
   
    
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
deleteNotes(){
  const canDelete=customAlert('Are you sure you want to delete this notes?');

console.log(canDelete)
  return
if(canDelete){

  for(const note of this.notesToDelete){
    NoteAPI.deleteNote(note.id);
  }
  this.notesToDelete=[];
  this.renderNotesToView();
  window.location.reload()
}
}
addNote() {
   NoteAPI.addNote({
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
this.discardEmptyNote();
this.renderNotesToView();
window.location.reload();
   this.resetInputFields();
   this.hideNewNoteFields();
  
}
}


const notePasse=new  NotePasse('#root')
