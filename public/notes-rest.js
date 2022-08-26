const SERVER = axios.create({
    baseURL: 'http://localhost:3000'
})

async function loadNotes() {
    let res = await SERVER.get("/notes")
    let notes = res.data.map((note, idx) => `
        <li>
            ${note.text} 
            <a onclick="deleteNote('${note._id}')" style="cursor: pointer;font-size:small">&#128686;</a>
            <a onclick="editNote('${note._id}')" style="cursor: pointer;">edit</a>
        </li>
    `).join("");
    document.getElementById("placeholder").innerHTML = `
        <ul>${notes}</ul>
    `;
}

async function addNote() {
    let noteInput = document.getElementById("noteText");
    let noteText = noteInput.value;
    await SERVER.post("/notes", {text: noteText})
    noteInput.value = "";
    await loadNotes();
}

async function deleteNote(idx) {
    await SERVER.delete(`/notes/${idx}`);
    await loadNotes();
}

async function editNote(idx) {
    let noteInput = document.getElementById("noteText");
    let noteText = noteInput.value;
    await SERVER.patch(`/notes/${idx}/${noteText}`);
    await loadNotes();
}

async function deleteAll() {
    await SERVER.delete(`/notes`);
    await loadNotes();
}

loadNotes().then(r => {
    console.log(r);
});
