import NoteAPI from './note-api';
import generateID from './generate-id'
import Notes from './notes';
import { template } from './template';

import { Converter } from 'showdown';
const converter = new Converter();

class NoteDem {
   constructor(container) {
      const cont = Object.prototype.toString.call(container);
      this.container = null;
      if (typeof container == 'object' && cont.includes('HTML')) {

         this.container = container
      }
      else {

         this.container = document.querySelector(container);
      }
      // renders the html template for the note app.
      this.container.innerHTML = this._loadTemplate();

      // gets all notes from localStorage
      this.Notes = NoteAPI.getAllNotes();

      // checks if the user is searching
      this.isSearching = false;

      // an array of selected notes
      this.notesToDelete = [];
      // this.container.oncontextmenu=((evt)=> {evt.preventDefault(); return false})
      this.notesContainer = this.container.querySelector(".all-notes-container");

      this.newNoteFormContainer = this.container.querySelector(".new-note-container");
      
      this.preview= this.container.querySelector(".preview");
      this.previewCheckbox = this.container.querySelector(".preview-checkbox");
      this.backBtn = this.container.querySelector(".back-home-btn");
      this.addNewNoteBtn = this.container.querySelector(".create-note-btn");

      this.newNoteTitle = this.container.querySelector(".new-note-title");
      this.searchBox = this.container.querySelector('.search-box');
      this.editTime = this.container.querySelector('.edit-time');
      this.newNoteBody = this.container.querySelector(".new-note-body");
      this.deleteBtnWrapper = this.container.querySelector('.delete-btn-wrapper');
      this.deleteCount = this.container.querySelector('.delete-count');
      this.deleteBtn = this.container.querySelector('.delete-btn');
      this.noteToEdit = null;
      this.noteId = null;
      this.mobileScreen = matchMedia('(max-width:724px)');
      // event listeners
      this.mobileScreen.addEventListener('change', (evt) => {
         if (evt.matches && this.previewCheckbox.checked) {
            this.newNoteFormContainer.classList.add('show-preview');
         }
         else {
            this.newNoteFormContainer.classList.remove('show-preview');

         }
      });
      this.previewCheckbox.addEventListener('click', () => {
         this.renderPreview()
      })
      this.addNewNoteBtn.addEventListener('click', () => {
         this.showNewNoteFields()
      });
      this.backBtn.addEventListener('click', () => {
         this.goHome()
      })
      this.deleteBtn.addEventListener('click', () => {
         this.deleteNotes();
      })
      this.searchBox.addEventListener('keyup', (evt) => {
         this.searchNotes(evt)
      })
      this.searchBox.addEventListener('blur', (evt) => {
         this.isSearching = false;
         this.renderNotesToView()
      })
      // renders the previous notes
      this.renderNotesToView();

     [this.newNoteBody, this.newNoteTitle].forEach((newNoteVal) => {
         newNoteVal.addEventListener('keyup', () => {

            this.resaveNote();
            this.renderPreview();
         });
      });
     [this.newNoteBody, this.newNoteTitle].forEach((newNoteVal) => {
         newNoteVal.addEventListener('blur', () => {

            this.resaveNote();

         });
      });


   }
   searchNotes(evt) {
      this.isSearching = true;
      const { isEmptyString, toLower } = this.Utils();
      const query = toLower(evt.target.value);
      if (isEmptyString(query)) {
         this.Notes = NoteAPI.getAllNotes()
         this.renderNotesToView();
         return
      }
      const Notes = NoteAPI.getAllNotes();
      const results = Notes.filter((note) => {
         return (toLower(note.title).indexOf(query) != -1 || toLower(note.body).indexOf(query) != -1)
      });
      this.Notes = results;
      this.renderNotesToView()
   }
   showNewNoteFields() {
      this.container.classList.add('view');
      this.newNoteTitle.focus();
      const id = generateID('note_', '_' + new Date().getTime());
      this.noteId = id;
      this.addNote()

   }
   hideNewNoteFields() {
      this.container.classList.remove('view');
      this.noteId = null;
      this.newNoteTitle.blur()
   }
   _loadTemplate() {
      return (template)
   }
   clickNote(evt) {
      const clickedNote = evt.currentTarget;
      this.noteId = clickedNote.dataset.noteId
      const Note = NoteAPI.getSingleNote(this.noteId);
      const noteElems = this.container.querySelectorAll('.note');
      noteElems.forEach((noteElem) => {
         noteElem.classList.remove('active');
      })
      this.container.querySelector(`.note[data-note-id="${this.noteId}"]`).classList.add('active');
      this.newNoteTitle.focus()
      this.newNoteTitle.value = Note.title;
      this.newNoteBody.value = Note.body;
      this.container.classList.add('view')
      this.editTime.textContent = 'Edited at ' + new Date(Note.pubdate).toLocaleTimeString()

   }
   resaveNote() {
      const U = this.Utils();
      const body = this.newNoteBody.value
      const title = this.newNoteTitle.value;
      if (U.isEmptyString(title) && U.isEmptyString(body)) return;
      this.noteToEdit = {
         body,
         title,
         id: this.noteId
      }
      NoteAPI.saveNote(this.noteToEdit);

   }
   renderPreview() {
      if (this.mobileScreen.matches && this.previewCheckbox.checked) {
         this.newNoteFormContainer.classList.add('show-preview');

      }
      else {
         this.newNoteFormContainer.classList.remove('show-preview');
}
      if (!this.previewCheckbox.checked) {
         this.preview.innerHTML = " <span class='muted-text'> preview here</span>";
         return
      }
      
      this.preview.innerHTML = converter.makeHtml(this.newNoteBody.value);
   }

   Utils() {
      return {
         isEmptyString(val) {
            return (val.trim() === '');
         },
         toLower(val) {
            return String(val).toLowerCase();
         }
      }
   }
   selectToDelete(evt) {

      const target = evt.currentTarget;
      target.classList.add('selected');
      const { noteId } = target.dataset;
      const note = NoteAPI.getSingleNote(noteId)
      const isSelected = this.notesToDelete.find((note) => note.id == noteId);
      if (target.classList.contains('selected') && !isSelected) {
         this.notesToDelete.push(note);
      }
      else {
         target.classList.remove('selected');
         this.notesToDelete = this.notesToDelete.filter((note) => note.id !== noteId);
      }
      if (this.notesToDelete.length > 0) {
         this.deleteBtnWrapper.classList.add('show');
         this.deleteCount.textContent = this.notesToDelete.length;
      }
      else this.deleteBtnWrapper.classList.remove('show');
   }
   renderNotesToView(notes = this.Notes) {
      const { notesContainer, isSearching } = this

      // Note template
      Notes({ notesContainer, notes, isSearching });

      // select all notes
      const noteElems = this.container.querySelectorAll('.note');
      const downEvents = ['mousedown', 'touchstart'];
      noteElems.forEach((noteElem) => {
         noteElem.addEventListener('click', (evt) => {
            this.clickNote(evt);
            evt.stopImmediatePropagation();
         });
         noteElem.addEventListener('contextmenu', (evt) => {
            evt.preventDefault();
            return false
         });
         for (const type of downEvents) {
            noteElem.addEventListener(type, (evt) => {

               this.selectToDelete(evt)
               evt.stopImmediatePropagation()
            })
         }


      })
   }

   deleteNotes() {
      const canDelete = confirm('Are you sure you want to delete these notes?');
      if (canDelete) {

         for (const note of this.notesToDelete) {
            NoteAPI.deleteNote(note.id);
         }
         this.notesToDelete = [];
         window.location.reload()
         this.renderNotesToView();
      }
   }
   addNote() {
      NoteAPI.addNote({
         id: this.noteId,
         title: '',
         body: ''
      });

   }
   resetInputFields() {
      this.newNoteBody.value = ''
      this.newNoteTitle.value = ''
   }
   discardEmptyNote() {
      const U = this.Utils();
      const currentID = this.noteId
      const note = NoteAPI.getSingleNote(currentID);
      if (note && (U.isEmptyString(note.body) && U.isEmptyString(note.title))) {
         NoteAPI.deleteNote(currentID);

      }

   }
   goHome() {
      this.discardEmptyNote();
      this.resetInputFields();
      this.hideNewNoteFields();
      window.location.reload();
      this.renderNotesToView();

   }
}


const notePasse = new NoteDem('#root')