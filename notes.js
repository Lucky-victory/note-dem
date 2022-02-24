
export default function Notes({notesContainer,notes,isSearching=false}){
   
   const MAX_BODY_LENGTH=100;
   const MAX_TITLE_LENGTH=40;
  let html = '';
  if (notes.length) {
html=(`<div class="notes-container">
   ${ notes.map((note,index) => {
      return`<div class="note" data-note-id='${note.id}' style='--delay:${index}'>
          <h2 class="note__title">
          ${note.title.substring(0,MAX_TITLE_LENGTH)}
          ${note.title.length > MAX_TITLE_LENGTH ?'...':''}
          </h2>
          <div class="note__body">
          ${note.body.substring(0,MAX_BODY_LENGTH)}
          ${note.body.length > MAX_BODY_LENGTH ? '...' : ''}
          </div>
            <div class="note__category-pubdate">
               <span class="pubdate">${new Date(note.pubdate).toLocaleString(undefined,{dateStyle:"medium",timeStyle:"short"})}</span>
            </div>
         </div>`
    }).join('')
         } </div>`)
     
    notesContainer.innerHTML='';
    notesContainer.insertAdjacentHTML('beforeend',html);
  }
  else {
    notesContainer.innerHTML = `
    <div class="no-notes-container">
    ${!isSearching ? `
    
<span class="material-icons-outlined icon">lightbulb</span>
Notes you add appear here
`
  : `
   <span class="material-icons-outlined icon">search</span>
   No results found
  `}
    
      
  </div>  `
}
      
      
}