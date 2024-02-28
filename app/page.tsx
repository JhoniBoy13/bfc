"use client"
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, {Draggable, DropArg} from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import React, {Fragment, useEffect, useState} from 'react'
import {EventSourceInput} from '@fullcalendar/core/index.js'
import {DeleteEventDialog} from "@/app/components/dialogs/DeleteEventDialog";
import {CreateDialogContext, DeleteDialogContext, FilterDialogContext} from './components/dialogs/DialogContext'
import {CreateEventDialog} from "@/app/components/dialogs/CreateEventDialog";
import {Event, EventType, EventTypeOption} from "@/app/EventObjects";
import {FilterEventDialog} from "@/app/components/dialogs/FilterEventDialog";

// @ts-ignore

export default function Home() {

    const [eventTypes, setEventTypes] = useState<EventType[]>([
        {id: 0, color: "blue", name: "blue team", iconUrl: "blueTeamUrl"},
        {id: 1, color: "green", name: " green team", iconUrl: "greenTeamUrl"},
        {id: 2, color: "red", name: " red team", iconUrl: "redTeamUrl"},
        {id: 3, color: "yellow", name: " yellow team", iconUrl: "yellowTeamUrl"},
    ])

    const [events, setEvents] = useState([
        {title: 'event 1', id: '1', eventType: eventTypes[0], color: eventTypes[0].color},
        {title: 'event 2', id: '2', eventType: eventTypes[1], color: eventTypes[1].color},
        {title: 'event 3', id: '3', eventType: eventTypes[0], color: eventTypes[0].color},
        {title: 'event 4', id: '4', eventType: eventTypes[0], color: eventTypes[0].color},
        {title: 'event 5', id: '5', eventType: eventTypes[0], color: eventTypes[0].color},
    ])

    const [allEvents, setAllEvents] = useState<Event[]>([])
    const [filteredEvents, setFilteredEvents] = useState<Event[]>([])

    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showFilterModal, setShowFilterModal] = useState(false)
    const [idToDelete, setIdToDelete] = useState<number | null>(null)
    const [newEvent, setNewEvent] = useState<Event>({
        title: '',
        start: '',
        allDay: false,
        id: 0,
        eventType: eventTypes[0],
        color: eventTypes[0].color
    })

    useEffect(() => {
        setFilteredEvents(filterEvents(allEvents))
        console.log(allEvents, filteredEvents, 'use effect after change shows all event')
    }, [showFilterModal, showCreateModal, showDeleteModal]);

    useEffect(() => {
        let draggableEl = document.getElementById('draggable-el')
        if (draggableEl) {
            new Draggable(draggableEl, {
                itemSelector: ".fc-event",
                eventData: function (eventEl) {
                    let title = eventEl.getAttribute("title")
                    let id = eventEl.getAttribute("id")
                    let eventType = eventEl.getAttribute("type")
                    let start = eventEl.getAttribute("start")
                    return {title, id, eventType, start}
                }
            })
        }
        setFilteredEvents(filterEvents(allEvents))

    }, [])

    function filterEvents(events: Event[]): Event[] {
        const filtered = events.filter(event => event.eventType?.isFiltered === undefined || event.eventType?.isFiltered === false)
        console.log(filtered, 'filter func')
        return filtered
    }

    function handleDateClick(arg: { date: Date, allDay: boolean }) {
        setNewEvent({...newEvent, start: arg.date, allDay: arg.allDay, id: new Date().getTime()})
        setShowCreateModal(true)
    }

    function addEvent(data: DropArg) {
        const eventType: EventType = JSON.parse(data.draggedEl.getAttribute('type') as string)
        const event = {...newEvent, start: data.date.toISOString(), title: data.draggedEl.innerText, allDay: data.allDay, id: Number( data.draggedEl.getAttribute('id')), eventType: eventType, color: data.draggedEl.style.backgroundColor}
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
                            customButtons={{
                                filterButton: {
                                    text: 'Filter events',
                                    click: function () {
                                        setShowFilterModal(true);
                                    }
                                }
                            }
                            }

                            headerToolbar={{
                                left: 'prev,next today, filterButton',
                                center: 'title',
                                right: 'dayGridMonth,timeGridWeek,timeGridDay'
                            }}
                            events={filteredEvents as EventSourceInput}
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
                                id={event.id}
                                type={JSON.stringify(event.eventType)}
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
                <FilterDialogContext.Provider value={[setShowFilterModal, showFilterModal, setEventTypes, eventTypes]}>
                    <FilterEventDialog/>
                </FilterDialogContext.Provider>

            </main>
        </>
    )
}
