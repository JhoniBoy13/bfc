import React, {Fragment, useContext, useEffect, useState} from "react";
import {Dialog, Transition} from "@headlessui/react";
import {CheckIcon} from "@heroicons/react/20/solid";
import {FilterDialogContext} from "@/app/components/dialogs/DialogContext";
import {EventType, EventTypeOption} from "@/app/EventObjects";
import Select, {ActionMeta, OnChangeValue, StylesConfig} from 'react-select';
import chroma from 'chroma-js';


export function FilterEventDialog() {

    const [setShowFilterModal, showFilterModal, setEventTypes, eventTypes] = useContext(FilterDialogContext);
    const [allEventTypesOptions, setAllEventTypesOptions] = useState<EventTypeOption[]>([]);
    const [filteredEventTypesOption, setFilteredEventTypesOption] = useState<EventTypeOption[]>([]);
    const [isOpen, setIsOpen] = useState(false);


    useEffect(() => {
        const eventTypeOptionArr: EventTypeOption[] = [];
        eventTypes.forEach((eventType: EventType) => {
            const eventTypeOption: EventTypeOption = {value: eventType.id.toString(), label: eventType.name, color: eventType.color, isFiltered: eventType.isFiltered === undefined ? false : !eventType.isFiltered};
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

    function updateEventType(id: string, isFiltered: boolean) {
        const eventType: EventType = eventTypes.find((eventType: EventType) => eventType.id.toString() === id)
        eventType.isFiltered = isFiltered;
        console.log(eventTypes, 'event types')
    }

    function changeFilter(newValue: OnChangeValue<EventTypeOption, true>, actionMeta: ActionMeta<EventTypeOption>) {
        console.log('New Value:', newValue);
        console.log('Action Meta:', actionMeta);

        switch (actionMeta.action) {
            case "select-option":
                if (actionMeta.option) {
                    updateEventType(actionMeta.option.value, true)
                    actionMeta.option.isFiltered = true
                    setFilteredEventTypesOption([...newValue])
                }
                break;
            case "remove-value":
                if (actionMeta.removedValue) {
                    updateEventType(actionMeta.removedValue.value, false)
                    actionMeta.removedValue.isFiltered = false
                    setFilteredEventTypesOption(filteredEventTypesOption.filter((option: EventTypeOption) => option.isFiltered))
                }
                break;
        }
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
                                        <form action="submit">
                                            <div className="mt-2">
                                                <Select
                                                    id="filter-option-select"
                                                    closeMenuOnSelect={false}
                                                    onMenuOpen={() => toggleDropdown()}
                                                    onMenuClose={() => toggleDropdown()}
                                                    onChange={(newValue, actionMeta) => changeFilter(newValue, actionMeta)}
                                                    menuIsOpen={isOpen}
                                                    isMulti
                                                    value={filteredEventTypesOption}
                                                    options={allEventTypesOptions}
                                                    styles={colourStyles}
                                                />
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