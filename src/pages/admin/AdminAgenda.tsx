import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Calendar, Filter, Grip } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import ExternalDraggingevent from "../../components/agenda/ExternalDraggingevent";
import EventModal from "../../components/agenda/EventModal";

const AdminAgenda = () => {
  const calendarComponentRef = useRef(null);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [categories, setCategories] = useState([
    { value: "business", label: "Negócios", activeClass: "text-indigo-500", className: "" },
    { value: "meeting", label: "Reunião", activeClass: "text-yellow-500", className: "" },
    { value: "holiday", label: "Feriado", activeClass: "text-red-500", className: "" },
    { value: "etc", label: "Outros", activeClass: "text-cyan-500", className: "" },
  ]);
  const [selectedCategories, setSelectedCategories] = useState(["business", "meeting", "holiday", "etc"]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editEvent, setEditEvent] = useState(null);
  const [events] = useState([
    { title: "Planejamento de Novo Evento", id: "1", tag: "business" },
    { title: "Reunião", id: "2", tag: "meeting" },
    { title: "Gerando Relatórios", id: "3", tag: "holiday" },
    { title: "Criar Novo Tema", id: "4", tag: "etc" },
  ]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const draggableEl = document.getElementById("external-events");

    const initDraggable = () => {
      if (draggableEl) {
        new Draggable(draggableEl, {
          itemSelector: ".fc-event",
          eventData: function (eventEl) {
            let title = eventEl.getAttribute("title");
            let id = eventEl.getAttribute("data");
            let event = events.find((e) => e.id === id);
            let tag = event ? event.tag : "";
            return {
              title: title,
              id: id,
              extendedProps: {
                calendar: tag,
              },
            };
          },
        });
      }
    };

    initDraggable();

    return () => {
      draggableEl?.removeEventListener("mousedown", initDraggable);
    };
  }, [events]);

  const handleDateClick = (arg) => {
    setEditEvent(null);
    setShowModal(true);
    setSelectedEvent(arg);
    console.log(selectedEvent, "seleted events");
  };
  // event click
  const handleEventClick = (arg) => {
    setShowModal(true);
    setEditEvent(arg);
    console.log(arg, "event click");
  };
  // handle close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setEditEvent(null);
    setSelectedEvent(null);
  };

  // add event
  const handleAddEvent = (newEvent) => {
    const eventToAdd = {
      ...newEvent,
      id: Date.now().toString(),
    };
    setCalendarEvents([...calendarEvents, eventToAdd]);
    console.log(newEvent, "ami new event");
  };

  // edit event
  const handleEditEvent = (updatedEvent) => {
    setCalendarEvents(
      calendarEvents.map((event) =>
        event.id === editEvent.event.id ? { ...event, ...updatedEvent } : event
      )
    );
    console.log(updatedEvent, "ami update event");
    console.log(editEvent.event.id, "ami id");
  };
  
  const handleCategorySelection = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleClassName = (arg) => {
    console.log(arg.event.extendedProps.calendar, "ami arg");
    if (arg.event.extendedProps.calendar === "holiday") {
      return "danger";
    } else if (arg.event.extendedProps.calendar === "business") {
      return "primary";
    } else if (arg.event.extendedProps.calendar === "personal") {
      return "success";
    } else if (arg.event.extendedProps.calendar === "family") {
      return "info";
    } else if (arg.event.extendedProps.calendar === "etc") {
      return "info";
    } else if (arg.event.extendedProps.calendar === "meeting") {
      return "warning";
    }
  };

  //filter events
  const filteredEvents = calendarEvents?.filter((event) =>
    selectedCategories.includes(event.extendedProps.calendar)
  );

  const handleDeleteEvent = (eventId) => {
    setCalendarEvents(calendarEvents.filter((event) => event.id !== eventId));
  };

  return (
    <div className="container mx-auto p-6 admin-page">
      <div className="space-y-6">
        <PageHeader
          title="Agenda de Eventos"
          description="Gerencie eventos, reuniões e compromissos da feira"
          icon={Calendar}
          actions={[
            {
              label: "Novo Evento",
              icon: Plus,
              onClick: () => setShowModal(true),
              variant: "default"
            }
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar com controles */}
          <div className="lg:col-span-1 space-y-6">
            {/* Eventos para arrastar */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Grip className="h-4 w-4" />
                  Eventos Rápidos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground mb-4">
                  Arraste para o calendário ou clique em uma data
                </p>
                <div id="external-events" className="space-y-2">
                  {events.map((event) => (
                    <ExternalDraggingevent key={event.id} event={event} />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Filtros */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filtros
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="select-all"
                      checked={selectedCategories?.length === categories?.length}
                      onCheckedChange={() => {
                        if (selectedCategories?.length === categories?.length) {
                          setSelectedCategories([]);
                        } else {
                          setSelectedCategories(categories.map((c) => c.value));
                        }
                      }}
                    />
                    <label 
                      htmlFor="select-all"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Selecionar Todos
                    </label>
                  </div>
                  
                  <div className="border-t pt-3 space-y-2">
                    {categories?.map((category) => (
                      <div key={category.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={category.value}
                          checked={selectedCategories.includes(category.value)}
                          onCheckedChange={() => handleCategorySelection(category.value)}
                          className={category.className}
                        />
                        <label 
                          htmlFor={category.value}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {category.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Calendário principal */}
          <div className="lg:col-span-3">
            <Card className="h-full">
              <CardContent className="p-6">
                <div className="calendar-container">
                  <FullCalendar
                    plugins={[
                      dayGridPlugin,
                      timeGridPlugin,
                      interactionPlugin,
                      listPlugin,
                    ]}
                    ref={calendarComponentRef}
                    headerToolbar={{
                      left: "prev,next today",
                      center: "title",
                      right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
                    }}
                    locale="pt-br"
                    buttonText={{
                      today: "Hoje",
                      month: "Mês",
                      week: "Semana",
                      day: "Dia",
                      list: "Lista"
                    }}
                    events={filteredEvents}
                    editable={true}
                    rerenderDelay={10}
                    eventDurationEditable={false}
                    selectable={true}
                    selectMirror={true}
                    droppable={true}
                    dayMaxEvents={3}
                    weekends={true}
                    eventClassNames={handleClassName}
                    dateClick={handleDateClick}
                    eventClick={handleEventClick}
                    initialView="dayGridMonth"
                    height="auto"
                    aspectRatio={1.8}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <EventModal
          showModal={showModal}
          onClose={handleCloseModal}
          categories={categories}
          onAdd={handleAddEvent}
          selectedEvent={selectedEvent}
          event={editEvent}
          onEdit={handleEditEvent}
          onDelete={handleDeleteEvent}
        />
      </div>
    </div>
  );
};

export default AdminAgenda;