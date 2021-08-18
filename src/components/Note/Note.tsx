import { FC, FocusEvent } from "react"; // Importing Functional Component and it used to define type
import INote from "../../interfaces/note.interface";
import "./Note.css";

type Props = {
  note: INote;
  onNoteUpdate: (note: INote) => void;
  //   onNoteUpdate: Function;
};

const Note: FC<Props> = ({ note, onNoteUpdate }) => {
  const noteTextUpdated = (e: FocusEvent<HTMLDivElement>) => {
    console.log("note text change");
    const newTextValue = e.currentTarget.textContent;
    if (newTextValue === note.text) {
      return;
    }
    const updatedNoteobject: INote = {
      ...note,
      text: newTextValue || "",
    };
    // console.log(e.currentTarget.textContent);
    onNoteUpdate(updatedNoteobject);
  };

  return (
    <div className="note">
      <div
        onBlur={noteTextUpdated}
        contentEditable={true}
        suppressContentEditableWarning={true}
        className="note__text"
      >
        {note.text}
      </div>
      <div className="note__link">
        <a href={note.link}>link</a>
      </div>
    </div>
  );
};

export default Note;
