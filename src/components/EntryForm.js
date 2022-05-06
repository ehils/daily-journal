import React, { useState, useEffect } from "react"
import { getTags } from "./EntryManager"

export const EntryForm = ({ tags, entry, moods, onFormSubmit }) => {
    const [editMode, setEditMode] = useState(false)
    const [checkedState, setCheckedState] = useState([])
    const [updatedEntry, setUpdatedEntry] = useState(entry)

    useEffect(() => {
        setUpdatedEntry(entry)
        if ('id' in entry) {
            setEditMode(true)
            let copy = entry.tags.map(tag => { return tag.id})
            setCheckedState(copy)
        }
        else {
            setEditMode(false)
            
        }
    }, [entry])

    const checkedStateChange = (event) => {
        let copy = [...checkedState]
        if (copy.includes(parseInt(event.target.value))) {
            let index = copy.indexOf(parseInt(event.target.value))
            if (index > -1) {
                copy.splice(index, 1) 
                setCheckedState(copy)
            }
                      
        }
        else copy.push(parseInt(event.target.value))
        setCheckedState(copy)
    }

    const handleControlledInputChange = (event) => {
        /*
            When changing a state object or array, always create a new one
            and change state instead of modifying current one
        */
       
        const newEntry = Object.assign({}, updatedEntry)
        newEntry[event.target.name] = event.target.value
        
        setUpdatedEntry(newEntry)
    }



    const constructNewEntry = () => {
        const copyEntry = { ...updatedEntry }
        copyEntry.moodId = parseInt(copyEntry.mood_id)
        copyEntry.tags = checkedState
        if (!copyEntry.date) {
            copyEntry.date = Date(Date.now()).toLocaleString('en-us').split('GMT')[0]
        }
        onFormSubmit(copyEntry)
        setCheckedState([])
        setUpdatedEntry({mood_id: 0})
    }

    return (
        <article className="panel is-info">
            <h2 className="panel-heading">{editMode ? "Update Entry" : "Create Entry"}</h2>
            <div className="panel-block">
                <form style={{ width: "100%" }}>
                    <div className="field">
                        <label htmlFor="concept" className="label">Concept: </label>
                        <div className="control">
                            <input type="text" name="concept" required autoFocus className="input"
                                proptype="varchar"
                                placeholder="Concept"
                                value={updatedEntry.concept}
                                onChange={handleControlledInputChange}
                            />
                        </div>
                    </div>
                    <div className="field">
                        <label htmlFor="entry" className="label">Entry: </label>
                        <div className="control">
                            <textarea
                                className="textarea"
                                name="entry"
                                value={updatedEntry.entry}
                                onChange={handleControlledInputChange}
                            ></textarea>
                        </div>
                    </div>
                    <div className="field">
                        <label htmlFor="moodId" className="label">Mood: </label>
                        <div className="control">
                            <div className="select">
                                <select name="mood_id"
                                    proptype="int"
                                    
                                    value={updatedEntry.mood_id}
                                    onChange={handleControlledInputChange}>

                                    <option value="0">Select a mood</option>
                                    {moods.map(m => (
                                        <option key={m.id} value={m.id}>
                                            {m.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="field">
                        <label htmlFor="topicSelection" className="label">Entry Topics: </label>
                        <ul>
                            {tags.map((tag) => {
                                return (
                                    <li key={tag.id}>
                                        <div className="tag-item">
                                            <input
                                                type="checkbox"
                                                id={`tag-checkbox--${tag}`}
                                                name={`name-${tag.tag}`}
                                                value={tag.id}
                                                defaultValue={entry.tags}
                                                onChange={checkedStateChange}
                                                checked={
                                                    checkedState.includes(tag.id) ? 
                                                    true : false
                                                }
                                            />
                                            {/* state that is array, checked adds item to array
                                            add array of tags to entry */}
                                            <label htmlFor={`custom-checkbox-${tag.id}`}>{tag.tag}</label>
                                        </div>
                                    </li>)
                            }
                            )}
                        </ul>
                    </div>
                    <div className="field">
                        <div className="control">
                            <button type="submit"
                                onClick={evt => {
                                    evt.preventDefault()
                                    constructNewEntry()
                                }}
                                className="button is-link">
                                {editMode ? "Update" : "Save"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </article>
    )
}
