import React, {Fragment, useContext, useEffect, useState} from "react";
import {Dialog, Transition} from "@headlessui/react";
import {CheckIcon} from "@heroicons/react/20/solid";
import {FilterDialogContext} from "@/app/components/dialogs/DialogContext";
import {EventType, EventTypeOption} from "@/app/EventObjects";
import Select, {StylesConfig} from 'react-select';
import chroma from 'chroma-js';


export function FilterEventDialog() {

    const [setShowFilterModal, showFilterModal, setEventTypes, eventTypes] = useContext(FilterDialogContext);
    const [allEventTypesOptions, setAllEventTypesOptions] = useState<EventTypeOption[]>([]);
    const [filteredEventTypesOption, setFilteredEventTypesOption] = useState<EventTypeOption[]>([]);
    const [isOpen, setIsOpen] = useState(false);


    useEffect(() => {
        const eventTypeOptionArr: EventTypeOption[] = [];
        eventTypes.forEach((eventType: EventType) => {
            const eventTypeOption: EventTypeOption = {value: eventType.id.toString(), label: eventType.name, color: eventType.color};
            // @ts-ignore
            eventTypeOptionArr.push(eventTypeOption);
        })
        setAllEventTypesOptions(eventTypeOptionArr);
    }, [])

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
        adjustDialogHeight();
    };

    const adjustDialogHeight = () => {
        const dialog = document.getElementById('filter-dialog');
        if (dialog) {
            dialog.style.height = isOpen ? '25vh' : '50vh';
        }
    };

    // function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    //     e.preventDefault()
    //
    //     closeFilterModal()
    // }

    function closeFilterModal() {
        setShowFilterModal(false)
    }

    function changeFilter(selectedEventTypesOption: EventTypeOption[]) {


        const option: EventTypeOption[] = filteredEventTypesOption.length > selectedEventTypesOption.length
            ? filteredEventTypesOption.filter((element) => !selectedEventTypesOption.includes(element))
            : selectedEventTypesOption.filter((element) => !filteredEventTypesOption.includes(element));

        eventTypes.map((eventType: EventType) => {
            if (eventType.id.toString() === option[0].value) {
                eventType.isFiltered = eventType.isFiltered === undefined ? true : !eventType.isFiltered;
            }
        });

        setFilteredEventTypesOption(selectedEventTypesOption)
    }

    function resetFilter() {
        setFilteredEventTypesOption([])
    }

    const colourStyles: StylesConfig<EventTypeOption, true> = {
        control: (styles) => ({...styles, backgroundColor: 'white'}),
        option: (styles, {data, isDisabled, isFocused, isSelected}) => {
            const color = chroma(data.color);
            return {
                ...styles,
                backgroundColor: isDisabled
                    ? undefined
                    : isSelected
                        ? data.color
                        : isFocused
                            ? color.alpha(0.1).css()
                            : undefined,
                color: isDisabled
                    ? '#ccc'
                    : isSelected
                        ? chroma.contrast(color, 'white') > 2
                            ? 'white'
                            : 'black'
                        : data.color,
                cursor: isDisabled ? 'not-allowed' : 'default',

                ':active': {
                    ...styles[':active'],
                    backgroundColor: !isDisabled
                        ? isSelected
                            ? data.color
                            : color.alpha(0.3).css()
                        : undefined,
                },
            };
        },
        multiValue: (styles, {data}) => {
            const color = chroma(data.color);
            return {
                ...styles,
                backgroundColor: color.alpha(0.1).css(),
            };
        },
        multiValueLabel: (styles, {data}) => ({
            ...styles,
            color: data.color,
        }),
        multiValueRemove: (styles, {data}) => ({
            ...styles,
            color: data.color,
            ':hover': {
                backgroundColor: data.color,
                color: 'white',
            },
        }),
    };


    return (
        <Transition.Root show={showFilterModal} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={setShowFilterModal}>
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
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6" id="filter-dialog">
                                <div>
                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                        <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true"/>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-5">
                                        <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                            Filter Event
                                        </Dialog.Title>
                                        <form action="submit" >
                                            <div className="mt-2">
                                                <Select
                                                    id="filter-option-select"
                                                    closeMenuOnSelect={false}
                                                    onMenuOpen={() => toggleDropdown()}
                                                    onMenuClose={() => toggleDropdown()}
                                                    menuIsOpen={isOpen}
                                                    // @ts-ignore
                                                    onChange={changeFilter}
                                                    isMulti
                                                    options={allEventTypesOptions}
                                                    value={filteredEventTypesOption}
                                                    styles={colourStyles}
                                                />
                                            </div>
                                            {/*<div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3" style={{marginTop: isOpen ? '30vh' : '3vh'}}>*/}
                                            {/*    <button type="submit" className="inline-flex w-full justify-center rounded-md bg-violet-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 sm:col-start-2 disabled:opacity-25">*/}
                                            {/*        Submit*/}
                                            {/*    </button>*/}
                                            {/*    <button type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0" onClick={closeFilterModal}>*/}
                                            {/*        Cancel*/}
                                            {/*    </button>*/}
                                            {/*</div>*/}
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