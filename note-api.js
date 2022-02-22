

class NoteAPI {
   static saveNote(newNote) {
      const Notes = NoteAPI.getAllNotes();
      const alreadyExist = Notes.find((note) => note.id == newNote.id);

      if (alreadyExist) {
         alreadyExist.title = newNote.title;
         alreadyExist.body = newNote.body;
         alreadyExist.pubdate = new Date().getTime();
      }
    localStorage.setItem('note-lounge', JSON.stringify(Notes));     


   }
   static addNote(newNote){
      const Notes =NoteAPI.getAllNotes()
 newNote.pubdate = new Date().getTime();
 Notes.push(newNote);
 
 localStorage.setItem('note-lounge', JSON.stringify(Notes));     
   }
   static getAllNotes() {
      const Notes = JSON.parse(localStorage.getItem('note-lounge') || '[]');
      if (!Notes.length) {

         return Notes;
      } 
   return Notes.sort((a, b) => b.pubdate - a.pubdate);
      
   }getSingleNote
   static deleteNote(id) {
      const Notes = NoteAPI.getAllNotes();
      const filteredNotes = Notes.filter((note) => note.id != id);
      localStorage.setItem('note-lounge', JSON.stringify(filteredNotes));
   }
   static getSingleNote(id) {
      const Notes = NoteAPI.getAllNotes();
      const singleNote = Notes.find((note) => note.id == id);
      return singleNote;
   }
}


export default NoteAPI;