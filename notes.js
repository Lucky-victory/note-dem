import NoteAPI from './note-api';
``
export default function Notes(notesContainer){
   
   const MAX_BODY_LENGTH=70;
  const notes = NoteAPI.getAllNotes()
  let html = '';
  if (notes.length) {
html=(`<div class="notes-container">
   ${ notes.map((note,index) => {
      return`<div class="note" data-note-id='${note.id}' style='--delay:${index}'>
          <h2 class="note__title">${note.title}</h2>
          <div class="note__body">
          ${note.body.substring(0,MAX_BODY_LENGTH)}
          ${note.body.length > MAX_BODY_LENGTH ? '...' : ''}
          </div>
          <div class="note__category-pubdate">
         
         
         <span class="note__pubdate">
      ${new Date(note.pubdate).toLocaleString(undefined,{dateStyle:'long',timeStyle:'medium'})}</span>
          </div>
          </div>`}).join('')
         } </div>`)
     
    notesContainer.innerHTML='';
    notesContainer.insertAdjacentHTML('beforeend',html);
  }
  else {
    notesContainer.innerHTML = `
    <div class="no-notes-container">
<span class="material-icons-outlined icon">lightbulb</span>
    
      Notes you add appear here
      
  </div>  `
}
      
      
}