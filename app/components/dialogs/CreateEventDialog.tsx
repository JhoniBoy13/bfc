import React, {Fragment, useContext, useEffect, useState} from "react";
import {Dialog, Transition} from "@headlessui/react";
import {CheckIcon, InformationCircleIcon} from "@heroicons/react/20/solid";
import {CreateDialogContext} from "@/app/components/dialogs/DialogContext";
import {EventType, Event} from "@/app/EventObjects";

export function CreateEventDialog() {

    const [setShowCreateModal, showCreateModal, setAllEvents, allEvents, setNewEvent, newEvent, setEventTypes, eventTypes] = useContext(CreateDialogContext);
    const [color, setColor] = React.useState(newEvent.eventType.color);
    const [eventIdIterator, setEventIdIterator] = useState<number>(5);
    const [isNewEvent, setIsNewEvent] = React.useState<boolean>();

    useEffect(() => {
        if (newEvent.id===eventIdIterator || newEvent.id===0){
            setNewEvent({...newEvent, id: eventIdIterator})
            setIsNewEvent(true) ;
        }
        else {
            setIsNewEvent(false)
        }
    }, [showCreateModal]);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setNewEvent({...newEvent, title: e.target.value})
    }

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
        setNewEvent({...newEvent, description: e.target.value})
    }

    const changeEventType = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const value: string[] = e.target.value.split(',');
        setColor(value[1])
        const newEventType : EventType = eventTypes.find((types: EventType) => types.id === Number(value[0]))
        setNewEvent({...newEvent, eventType: newEventType, color: newEventType.color})
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (isNewEvent){
            setAllEvents([...allEvents, newEvent])
            setEventIdIterator(eventIdIterator + 1)
        }
        else {
            const event = allEvents.find((event: Event) => event.id === Number(newEvent.id))
            if (event){
                event.title = newEvent.title;
                event.eventType = newEvent.eventType;
                event.color = newEvent.eventType.color;
                event.description = newEvent.description;
            }
            // setAllEvents({...allEvents})
        }

        closeCreateModal();
    }

    function closeCreateModal() {
        setNewEvent({title: '', start: '', allDay: false, id: 0, eventType: eventTypes[0], color: eventTypes[0].color})
        setShowCreateModal(false)
        console.log('creat model closed')
    }

    return (
        <Transition.Root show={showCreateModal} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={setShowCreateModal}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                <div>
                                    <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${isNewEvent ? "bg-green-100" : "bg-blue-100"}`}>
                                        {isNewEvent
                                            ? <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true"/>
                                            : <InformationCircleIcon className="h-6 w-6 text-blue-600" aria-hidden="true"/>
                                        }
                                    </div>
                                    <div className="mt-3 text-center sm:mt-5">
                                        <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                            {isNewEvent ? 'Add Event': 'Event Info'}

                                        </Dialog.Title>
                                        <form action="submit" onSubmit={handleSubmit}>
                                            <div className="mt-2">
                                                <input type="text" name="title" className="block w-full rounded-md border-0 py-1.5 text-gray-900  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6" value={newEvent.title} onChange={(e) => handleTitleChange(e)} placeholder="Title"/>
                                            </div>
                                            <div className="mt-2">
                                                <select name="selectedGroup" onChange={changeEventType} style={{color: newEvent.eventType.color}} className="block w-full rounded-md border-0 py-1.5 text-gray-900  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6">
                                                    {
                                                        eventTypes.map((item: EventType) => {
                                                            return (
                                                                // @ts-ignore
                                                                <option selected={newEvent.eventType.id === item.id} id={item.id} style={{color: item.color}} value={[item.id.toString(), item.color]}>{item.name}</option>
                                                            );
                                                        })
                                                    }
                                                </select>
                                            </div>
                                            <div className="form-outline mt-2">
                                                <textarea className="block w-full rounded-md border-0 py-1.5 text-gray-900  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6" style={{textIndent: "5px"}} id="textAreaExample1" rows={4} placeholder={"Description"} value={newEvent.description} onChange={(e) => handleDescriptionChange(e)} ></textarea>
                                            </div>
                                            <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                                <button type="submit" className="inline-flex w-full justify-center rounded-md bg-violet-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 sm:col-start-2 disabled:opacity-25" disabled={newEvent.title === ''}>
                                                    {isNewEvent ? 'Create': 'Update'}
                                                </button>
                                                <button type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0" onClick={closeCreateModal}>
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}