import "./App.css";
import { useEffect, useState } from "react";
import DUMMY_NOTES from "./DUMMY_NOTES";
import Note from "./components/Note/Note";
import INote from "./interfaces/note.interface";

function App() {
  // const getNotes = () =>{
  //   console.log('we are awesome')
  // }
  // let notesList: any[] = []; //note list variable

  const [notesList, setNotesList] = useState<Array<INote>>([]);
  // const [notesList, setNotesList] = useState<any[]>([]);

  // App components renders first time
  useEffect(() => {
    const listFromStorageString = localStorage.getItem("my-notes");
    if (listFromStorageString) {
      const listFromStorageArray = JSON.parse(listFromStorageString);
      setNotesList(listFromStorageArray);
    } else {
      setNotesList(DUMMY_NOTES);
    }
  }, []);

  useEffect(() => {
    console.log("saving to localstorage");
    const notesListString = JSON.stringify(notesList);
    localStorage.setItem("my-notes", notesListString);
  }, [notesList]);

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
  console.log("rerendering");
  console.log(notesList);

  const updateNoteItem = (updatedNote: INote) => {
    console.log("value updated in the app component");
    console.log(updatedNote);

    // temporary variable
    const updatedList = notesList.map((noteItem: INote) => {
      if (noteItem._id === updatedNote._id) {
        return updatedNote;
      }
      return noteItem;
    });
    setNotesList(updatedList); // updating the state of notes list
  };

  return (
    <div className="App">
      <div className="t1-main">Notes Application</div>
      <div></div>
      <div className="notes-list">
        {notesList.map((noteItem, index) => {
          return (
            <Note note={noteItem} onNoteUpdate={updateNoteItem} key={index} />
          );
        })}
      </div>
    </div>
  );
}

export default App;
