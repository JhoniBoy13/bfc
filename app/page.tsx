"use client"
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, {DateClickArg, Draggable, DropArg, EventResizeDoneArg, EventResizeStartArg} from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import React, {Fragment, useEffect, useState} from 'react'
import {DateSelectArg, DateUnselectArg, EventChangeArg, EventClickArg, EventDropArg, EventSourceInput} from '@fullcalendar/core/index.js'
import {DeleteEventDialog} from "@/app/components/dialogs/DeleteEventDialog";
import {CreateDialogContext, DeleteDialogContext, FilterDialogContext} from './components/dialogs/DialogContext'
import {CreateEventDialog} from "@/app/components/dialogs/CreateEventDialog";
import {Event, EventType} from "@/app/EventObjects";
import {FilterEventDialog} from "@/app/components/dialogs/FilterEventDialog";


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
        const filterEventsCopy = filterEvents(allEvents)
        console.log(allEvents, 'list of all event ')
        console.log(filteredEvents, 'list of all event shown')
        setFilteredEvents(filterEventsCopy);

    }, [showFilterModal, showCreateModal, showDeleteModal]);

    useEffect(() => {
        let draggableEl = document.getElementById('draggable-el')
        if (draggableEl) {
            new Draggable(draggableEl, {
                itemSelector: ".fc-event",
                eventData: function (eventEl) {
                    let title = eventEl.getAttribute("title")
                    let id = eventEl.getAttribute("id")
                    let start = eventEl.getAttribute("start")
                    return {title, id, start}
                }
            })
        }
        const filterEventsCopy = filterEvents(allEvents)
        setFilteredEvents(filterEventsCopy);

    }, [])


    function filterEvents(events: Event[]): Event[] {
        return events.filter(event => event.eventType?.isFiltered === undefined || event.eventType?.isFiltered === false)
    }

    function handleDateClick(data: DateClickArg) {
        setNewEvent({...newEvent, start: data.date, allDay: data.allDay})

        setShowCreateModal(true)
    }

    function handleDateSelect(data: DateSelectArg) {
        console.log(data,'select')
        if (!(data.start > newEvent.start && newEvent.end && data.end < newEvent.end)) {
            setNewEvent({...newEvent, start: data.start, end: data.end, allDay: data.allDay})
        }
        console.log(newEvent,'newEvent')

    }

    function handleEventClick(data: EventClickArg) {
        const event = allEvents.find(event => event.id === Number(data.event.id))
        if (event) setNewEvent(event)
        setShowCreateModal(true)
    }

    function addEvent(data: DropArg) {
        const eventTypeId: number = Number(data.draggedEl.getAttribute('data-eventType'))
        const eventType = eventTypes.find((types: EventType) => types.id === eventTypeId)
        const event = {...newEvent, start: data.date.toISOString(), title: data.draggedEl.innerText, allDay: data.allDay, id: Number(data.draggedEl.getAttribute('id')), eventType: eventType ? eventType : eventTypes[0], color: eventType ? eventType.color : eventTypes[0].color}
        setAllEvents([...allEvents, event])
    }

    function updateEvent(data: EventChangeArg) {
        const event = allEvents.find(event => event.id === Number(data.event.id))
        if (event) {
            event.allDay = data.event.allDay

            if (data.event.start)
                event.start = data.event.start.toISOString()

            if (data.event.end) {
                event.end = data.event.end.toISOString()
            }
            console.log(data.event.title + " event updated " + data.event)
        }
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
                            eventDurationEditable={true}
                            selectable={true}
                            selectMirror={true}
                            select={((data:DateSelectArg) => handleDateSelect(data))}
                            dateClick={(data: DateClickArg) => handleDateClick(data)}
                            drop={(data: DropArg) => addEvent(data)}
                            eventChange={(data: EventChangeArg) => updateEvent(data)}
                            eventDrop={(data: EventDropArg) => updateEvent(data)}
                            eventResize={(data: EventResizeDoneArg) => updateEvent(data)}
                            eventClick={(data: EventClickArg) => handleEventClick(data)}
                        />
                    </div>
                    <div id="draggable-el" className="ml-8 w-full border-2 p-2 rounded-md mt-16 lg:h-1/2 bg-violet-50">
                        <h1 className="font-bold text-lg text-center">Drag Event</h1>
                        {events.map(event => (
                            <div
                                className="fc-event border-2 p-1 m-2 w-full rounded-md ml-auto text-center bg-white"
                                title={event.title}
                                id={event.id}
                                key={event.id}
                                data-eventType={event.eventType.id}
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
                <CreateDialogContext.Provider value={[setShowCreateModal, showCreateModal, setAllEvents, allEvents, setNewEvent, newEvent, setEventTypes, eventTypes, setShowDeleteModal, showDeleteModal, setIdToDelete, idToDelete]}>
                    <CreateEventDialog/>
                </CreateDialogContext.Provider>
                <FilterDialogContext.Provider value={[setShowFilterModal, showFilterModal, setEventTypes, eventTypes]}>
                    <FilterEventDialog/>
                </FilterDialogContext.Provider>

            </main>
        </>
    )

}