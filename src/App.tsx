import "./App.css";
import { useEffect, useState } from "react";
import Logo from "./assets/RajaG.gif";
import {
  deleteNote,
  createNote,
  getNotes,
  updateNote,
  pinnedNote,
} from "./services/notesService";
// import DUMMY_NOTES from "./DUMMY_NOTES";
import Note from "./components/Note/Note";
import INote from "./interfaces/note.interface";
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap";

function App() {
  // const getNotes = () =>{
  //   console.log('we are awesome')
  // }
  // let notesList: any[] = []; //note list variable
  enum ModalNotes {
    Add,
    Edit,
  }
  const [notesList, setNotesList] = useState<Array<INote>>([]);
  const [ShowAddModal, setShowAddModal] = useState(false);
  const [modalNote, setModalNote] = useState(ModalNotes.Add);
  // const [ShowUpdateModal, setShowUpdateModal] = useState(false);
  const handleCloseAddModal = () => {
    setNewNote({
      link: "",
      text: "",
      pinned: false,
    });
    setShowAddModal(false);
  };
  const handleShowAddModal = () => {
    setModalNote(ModalNotes.Add);
    setShowAddModal(true);
  };

  const handleShowUpdateModal = (note: INote) => {
    setNewNote(note);
    setModalNote(ModalNotes.Edit);
    setShowAddModal(true);
    // updateNoteItem(newNote as INote);
    // updateNoteItem(note);
  };

  // const handleCloseUpdateModal = () => setShowUpdateModal(false);

  const [newNote, setNewNote] = useState<Partial<INote>>({
    link: "",
    text: "",
    pinned: false,
  });
  // const [notesList, setNotesList] = useState<any[]>([]);

  // App components renders first time get items from local storage
  // useEffect(() => {
  //   const listFromStorageString = localStorage.getItem("my-notes");
  //   if (listFromStorageString) {
  //     const listFromStorageArray = JSON.parse(listFromStorageString);
  //     setNotesList(listFromStorageArray);
  //   } else {
  //     setNotesList(DUMMY_NOTES);
  //   }
  // }, []);
  useEffect(() => {
    getNotesFromServer();
  }, []);

  const getNotesFromServer = async () => {
    const notes = await getNotes();
    // console.log(notes[0].pinned);
    const sortNotesList = notes.sort((noteItem: INote) => {
      return noteItem.pinned ? -1 : 1;
    });
    console.log(sortNotesList);
    setNotesList(sortNotesList);
  };

  // useEffect(() => {
  //   console.log("saving to localstorage");
  //   const notesListString = JSON.stringify(notesList);
  //   localStorage.setItem("my-notes", notesListString);
  // }, [notesList]);

  // useEffect(() => {
  //   console.log("noteList list value changed");
  //   console.log(notesList);
  // }, [notesList]);

  // get notes method
  // async function getNotes() {
  //   try {
  //     const response = await axios.get("http://localhost:5000/notes");
  //     // noteslist = response.data.notes;
  //     setNotesList(response.data.notes);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }
  // console.log("rerendering");
  // console.log(notesList);

  const updateNoteItem = async (updatedNote: INote) => {
    const noteFromServer = await updateNote(updatedNote);
    // temporary variable
    const updatedList = notesList.map((noteItem: INote) => {
      if (noteItem._id === noteFromServer._id) {
        return noteFromServer;
      }
      return noteItem;
    });
    setNotesList(updatedList); // updating the state of notes list
  };

  const addNote = async () => {
    const savedNote = await createNote(newNote);
    setNotesList([...notesList, savedNote]);
    handleCloseAddModal();
  };

  const editNote = async () => {
    updateNoteItem(newNote as INote);
    setShowAddModal(false);
  };

  const deleteNoteItem = async (noteToDelete: INote) => {
    await deleteNote(noteToDelete._id);
    const remainingNotes = notesList.filter((noteItem) => {
      return noteItem._id !== noteToDelete._id;
    });
    setNotesList(remainingNotes);
  };

  const pinnedItem = async (pinned: INote) => {
    const notePinned = await pinnedNote(pinned);
    const updatedPinList = notesList.map((noteItem: INote) => {
      if (noteItem._id === notePinned._id) {
        return notePinned;
      }
      return noteItem;
    });
    const sortNotesList = updatedPinList.sort((noteItem: INote) => {
      return noteItem.pinned ? -1 : 1;
    });
    setNotesList(sortNotesList);
    // console.log(notePin);
    // const updatedList = notesList.map((noteItem: INote) => {
    //   if (noteItem._id === notePin._id) {
    //     return !noteItem.pinned;
    //   }
    //   return noteItem;
    // });
    // const noteId = note._id;
    // const updatedList = notesList.map((noteItem: INote) => {
    //   if (noteItem._id === noteFromServer._id) {
    //     return noteFromServer;
    //   }
    //   return noteItem;
    // });

    // console.log(remainingNotes);
  };

  return (
    <div className="App">
      <div className="t1-main">Notes Application</div>
      <Button
        variant="dark"
        className="add-button"
        onClick={handleShowAddModal}
      >
        +
      </Button>

      <Modal show={ShowAddModal} onHide={handleCloseAddModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalNote === ModalNotes.Add ? "Add" : "Edit"} Note
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FloatingLabel controlId="floatingTextarea2" label="Text">
            <Form.Control
              onChange={(event) => {
                const NewVal = event.currentTarget.value;
                setNewNote({
                  ...newNote,
                  text: NewVal,
                });
              }}
              as="textarea"
              value={newNote.text}
              placeholder="Leave a comment here"
              style={{ height: "100px" }}
            />
          </FloatingLabel>
          <FloatingLabel
            controlId="floatingTextarea"
            label="Link"
            className="mb-3 note-link"
          >
            <Form.Control
              onChange={(event) => {
                const NewVal = event.currentTarget.value;
                setNewNote({
                  ...newNote,
                  link: NewVal,
                });
              }}
              placeholder="Enter note Url"
              type="url"
              value={newNote.link}
            />
          </FloatingLabel>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddModal}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={modalNote === ModalNotes.Add ? addNote : editNote}
          >
            {modalNote === ModalNotes.Add ? "Create" : "Update"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* <Modal show={ShowUpdateModal} onHide={handleCloseUpdateModal}>
          <Modal.Header closeButton>
            <Modal.Title>Update Note</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FloatingLabel controlId="floatingTextarea2" label="Text">
              <Form.Control
                onChange={(event) => {
                  const NewVal = event.currentTarget.value;
                  setNewNote({
                    ...newNote,
                    text: NewVal,
                  });
                }}
                value={newNote.text}
                as="textarea"
                placeholder="Leave a comment here"
                style={{ height: "100px" }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="floatingTextarea"
              label="Link"
              className="mb-3 note-link"
            >
              <Form.Control
                onChange={(event) => {
                  const NewVal = event.currentTarget.value;
                  setNewNote({
                    ...newNote,
                    link: NewVal,
                  });
                }}
                value={newNote.link}
                placeholder="Enter note Url"
                type="url"
              />
            </FloatingLabel>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseUpdateModal}>
              Close
            </Button>
            <Button variant="primary" onClick={editNote}>
              Update
            </Button>
          </Modal.Footer>
        </Modal> */}
      <div className="notes-list">
        {notesList.map((noteItem, index) => {
          return (
            <Note
              note={noteItem}
              onNoteUpdate={updateNoteItem}
              onNoteDelete={deleteNoteItem}
              key={index}
              toggleHandler={handleShowUpdateModal}
              isPinned={pinnedItem}
            />
          );
        })}
      </div>
      <div className="note__logo">
        <img src={Logo} alt="" />
      </div>
    </div>
  );
}

export default App;
