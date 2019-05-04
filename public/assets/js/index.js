var $noteTitle = $('.note-title');
var $noteText = $('.note-textarea');
var $saveNoteBtn = $('.save-note');
var $newNoteBtn = $('.new-note');
var $noteList = $('.list-container .list-group');

// activeNote is used to keep track of the note in the textarea
var activeNote = {};

// If there is an activeNote, display it, otherwise render empty inputs
function renderActiveNote() {
  $saveNoteBtn.hide();
  if (activeNote.id) {
    $noteTitle.attr('readonly', true);
    $noteText.attr('readonly', true);
    $noteTitle.val(activeNote.title);
    $noteText.val(activeNote.text);
  } else {
    $noteTitle.attr('readonly', false);
    $noteText.attr('readonly', false);
    $noteTitle.val('');
    $noteText.val('');
  }
}

// Get the note data from the inputs, save it to the notes array and update the view
function handleNoteSave() {
  var newNote = {
    title: $noteTitle.val(),
    text: $noteText.val(),
    id:
      '_' +
      Math.random()
        .toString(36)
        .substr(2, 9)
  };

  $.ajax({
    url: '/api/notes',
    data: newNote,
    method: 'POST'
  }).then(function(data) {
    getAndRenderNotes();
    renderActiveNote();
  });
}

// Delete the clicked note
function handleNoteDelete(event) {
  // Prevent the click listener for the list from being called when the button inside of it is clicked
  event.stopPropagation();

  var note = $(this)
    .parent('.list-group-item')
    .data();

  if (activeNote.id === note.id) {
    activeNote = {};
  }

  // Delete the note with the id of `note.id`
  // Render the active note
  $.ajax({
    url: '/api/notes/' + note.id,
    method: 'DELETE'
  }).then(function() {
    getAndRenderNotes();
    renderActiveNote();
  });
}

// Set the activeNote and display it
function handleNoteView() {
  activeNote = $(this).data();
  renderActiveNote();
}

// Set the activeNote to and empty object and allow the user to enter a new note
function handleNewNoteView() {
  activeNote = {};
  renderActiveNote();
}

// If a note's title or text are empty, hide the save button
// Or else show it
function handleRenderSaveBtn() {
  if (
    Object.keys(activeNote).length ||
    !$noteTitle.val().trim() ||
    !$noteText.val().trim()
  ) {
    $saveNoteBtn.hide();
  } else {
    $saveNoteBtn.show();
  }
}

// Render the list of note titles
function renderNoteList(notes) {
  $noteList.empty();

  var noteListItems = [];

  for (var i = 0; i < notes.length; i++) {
    var note = notes[i];

    var $li = $("<li class='list-group-item'>").data(note);
    var $span = $('<span>').text(note.title);
    var $delBtn = $(
      "<i class='fas fa-trash-alt float-right text-danger delete-note'>"
    );

    $li.append($span, $delBtn);
    noteListItems.push($li);
  }

  $noteList.append(noteListItems);
}

// Get notes from the db and render them to the sidebar
function getAndRenderNotes() {
  $.ajax({
    url: '/api/notes',
    method: 'GET'
  }).then(function(data) {
    renderNoteList(data);
  });
}

$saveNoteBtn.on('click', handleNoteSave);
$noteList.on('click', '.list-group-item', handleNoteView);
$newNoteBtn.on('click', handleNewNoteView);
$noteList.on('click', '.delete-note', handleNoteDelete);
$noteTitle.on('keyup', handleRenderSaveBtn);
$noteText.on('keyup', handleRenderSaveBtn);

// Gets and renders the initial list of notes
getAndRenderNotes();
