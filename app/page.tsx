"use client"
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, {Draggable, DropArg} from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import React, {Fragment, useEffect, useState} from 'react'
import {EventSourceInput} from '@fullcalendar/core/index.js'
import {DeleteEventDialog} from "@/app/components/dialogs/DeleteEventDialog";
import {CreateDialogContext, DeleteDialogContext} from './components/dialogs/DialogContext'
import {CreateEventDialog} from "@/app/components/dialogs/CreateEventDialog";
import {Event, EventType} from "@/app/EventObjects";

// @ts-ignore

export default function Home() {

    const [eventTypes, setEventTypes] = useState<EventType[]>([
        {id: 0, color: "blue", name:"blue team", iconUrl: "blueTeamUrl"},
        {id: 1, color: "green", name:" green team", iconUrl: "greenTeamUrl"},
    ])

    const [events, setEvents] = useState([
        {title: 'event 1', id: '1', eventType: {id: 0, color: "blue", iconUrl: "blueTeamUrl"}, color: "red"},
        {title: 'event 2', id: '2', eventType: {id: 1, color: "green", iconUrl: "greenTeamUrl"}, color: "orange"},
        {title: 'event 3', id: '3', eventType: {id: 0, color: "blue", iconUrl: "blueTeamUrl"}, color: "orange"},
        {title: 'event 4', id: '4', eventType: {id: 0, color: "blue", iconUrl: "blueTeamUrl"}, color: "orange"},
        {title: 'event 5', id: '5', eventType: {id: 0, color: "blue", iconUrl: "blueTeamUrl"}, color: "orange"},
    ])

    const [allEvents, setAllEvents] = useState<Event[]>([])
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [idToDelete, setIdToDelete] = useState<number | null>(null)
    const [newEvent, setNewEvent] = useState<Event>({
        title: '',
        start: '',
        allDay: false,
        id: 0,
        eventType: {id: 0, color: "blue",name:"blueTeam", iconUrl: "blueTeamUrl"},
        color: "blue"
    })

    useEffect(() => {
        let draggableEl = document.getElementById('draggable-el')
        if (draggableEl) {
            new Draggable(draggableEl, {
                itemSelector: ".fc-event",
                eventData: function (eventEl) {
                    let title = eventEl.getAttribute("title")
                    let id = eventEl.getAttribute("data")
                    let start = eventEl.getAttribute("start")
                    return {title, id, start}
                }
            })
        }
    }, [])

    function handleDateClick(arg: { date: Date, allDay: boolean }) {
        setNewEvent({...newEvent, start: arg.date, allDay: arg.allDay, id: new Date().getTime()})
        setShowCreateModal(true)
    }

    function addEvent(data: DropArg) {
        const event = {...newEvent, start: data.date.toISOString(), title: data.draggedEl.innerText, allDay: data.allDay, id: new Date().getTime(), color: data.draggedEl.style.backgroundColor}
        setAllEvents([...allEvents, event])
    }

    function handleDeleteModal(data: { event: { id: string } }) {
        setShowDeleteModal(true)
        setIdToDelete(Number(data.event.id))
    }

    return (
        <>
            <nav className="flex justify-between mb-12 border-b border-violet-100 p-4">
                <h1 className="font-bold text-2xl text-gray-700">Calendar</h1>
            </nav>
            <main className="flex min-h-screen flex-col items-center justify-between p-24">
                <div className="grid grid-cols-10">
                    <div className="col-span-8">
                        <FullCalendar
                            plugins={[
                                dayGridPlugin,
                                interactionPlugin,
                                timeGridPlugin
                            ]}
                            headerToolbar={{
                                left: 'prev,next today',
                                center: 'title',
                                right: 'dayGridMonth,timeGridWeek,timeGridDay'
                            }}
                            events={allEvents as EventSourceInput}
                            nowIndicator={true}
                            editable={true}
                            droppable={true}
                            selectable={true}
                            selectMirror={true}
                            dateClick={handleDateClick}
                            drop={(data) => addEvent(data)}
                            eventClick={(data) => handleDeleteModal(data)}
                        />
                    </div>
                    <div id="draggable-el" className="ml-8 w-full border-2 p-2 rounded-md mt-16 lg:h-1/2 bg-violet-50">
                        <h1 className="font-bold text-lg text-center">Drag Event</h1>
                        {events.map(event => (
                            <div
                                className="fc-event border-2 p-1 m-2 w-full rounded-md ml-auto text-center bg-white"
                                title={event.title}
                                key={event.id}
                                style={{backgroundColor: event.color}}
                            >
                                {event.title}
                            </div>
                        ))}
                    </div>
                </div>
                <DeleteDialogContext.Provider value={[setShowDeleteModal, showDeleteModal, setAllEvents, allEvents, setIdToDelete, idToDelete]}>
                    <DeleteEventDialog/>
                </DeleteDialogContext.Provider>
                <CreateDialogContext.Provider value={[setShowCreateModal, showCreateModal, setAllEvents, allEvents, setNewEvent, newEvent, setEventTypes, eventTypes]}>
                    <CreateEventDialog/>
                </CreateDialogContext.Provider>

            </main>
        </>
    )
}
