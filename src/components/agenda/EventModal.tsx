import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import Textinput from "@/components/ui/Textinput";
import { useForm, Controller } from "react-hook-form";
import SelectForm from "@/components/ui/SelectForm";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Flatpickr from "react-flatpickr";
import FormGroup from "@/components/ui/FormGroup";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Calendar, Clock, Users, MapPin, Plus, X } from "lucide-react";

const EventModal = ({
  showModal,
  onClose,
  categories,
  selectedEvent,
  onAdd,
  onEdit,
  event,
  onDelete,
}) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [participants, setParticipants] = useState([]);
  const [newParticipant, setNewParticipant] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  const FormValidationSchema = yup
    .object({
      title: yup.string().required("Título do compromisso é obrigatório"),
      cata: yup.string().required("Categoria é obrigatória"),
      startDate: yup.date().nullable(),
      endDate: yup.date().nullable(),
    })
    .required();

  const addParticipant = () => {
    if (newParticipant.trim() && !participants.includes(newParticipant.trim())) {
      setParticipants([...participants, newParticipant.trim()]);
      setNewParticipant('');
    }
  };

  const removeParticipant = (participant) => {
    setParticipants(participants.filter(p => p !== participant));
  };

  useEffect(() => {
    if (selectedEvent) {
      setStartDate(selectedEvent.date);
      setEndDate(selectedEvent.date);
    }
    if (event) {
      setStartDate(event.event.start);
      setEndDate(event.event.end);
      setDescription(event.event.extendedProps?.description || '');
      setLocation(event.event.extendedProps?.location || '');
      setParticipants(event.event.extendedProps?.participants || []);
    }
    reset(event);
  }, [selectedEvent, event]);

  const {
    register,
    control,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(FormValidationSchema),
    mode: "all",
  });

  const onSubmit = (data) => {
    const eventData = {
      title: data.title,
      start: startDate,
      end: endDate,
      allDay: false,
      extendedProps: {
        calendar: data.cata,
        description,
        location,
        participants,
      },
    };

    const updatedEvent = {
      ...event,
      ...eventData,
    };

    if (event) {
      onEdit(updatedEvent);
      toast.info("Compromisso atualizado com sucesso");
    } else {
      onAdd(eventData);
      toast.success("Compromisso criado com sucesso");
    }

    handleClose();
  };

  const handleClose = () => {
    onClose();
    setParticipants([]);
    setNewParticipant('');
    setLocation('');
    setDescription('');
    reset();
  };

  const handleDelete = (id) => {
    onClose();
    Swal.fire({
      title: "Tem certeza?",
      text: "Você não poderá reverter esta ação!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Sim, excluir!",
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete(id);
        Swal.fire("Excluído!", "Seu evento foi excluído.", "success");
      }
    });
  };

  return (
    <div>
      <Modal
        title={event ? "Editar Evento" : "Adicionar Evento"}
        activeModal={showModal}
        onClose={onClose}
      >
        <div className="w-full max-w-2xl mx-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Título */}
            <div className="space-y-2">
              <Textinput
                name="title"
                label="Título do Compromisso"
                type="text"
                placeholder="Ex: Reunião de planejamento estratégico"
                register={register}
                error={errors.title}
                defaultValue={event ? event.event.title : ""}
              />
            </div>

            {/* Data e Hora */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormGroup
                label="Data e Hora de Início"
                id="start-date-picker"
                error={errors.startDate}
              >
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <Flatpickr
                      className="form-control w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      id="start-date-picker"
                      placeholder="Selecione data e hora"
                      value={startDate}
                      onChange={(date) => setStartDate(date[0])}
                      options={{
                        enableTime: true,
                        time_24hr: true,
                        dateFormat: "Y-m-d H:i",
                        altInput: true,
                        altFormat: "d/m/Y às H:i",
                        locale: {
                          firstDayOfWeek: 1,
                          weekdays: {
                            shorthand: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
                            longhand: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']
                          },
                          months: {
                            shorthand: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                            longhand: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
                          }
                        }
                      }}
                    />
                  )}
                />
              </FormGroup>

              <FormGroup
                label="Data e Hora de Término"
                id="end-date-picker"
                error={errors.endDate}
              >
                <Controller
                  name="endDate"
                  control={control}
                  render={({ field }) => (
                    <Flatpickr
                      className="form-control w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      id="end-date-picker"
                      placeholder="Selecione data e hora"
                      value={endDate}
                      onChange={(date) => setEndDate(date[0])}
                      options={{
                        enableTime: true,
                        time_24hr: true,
                        dateFormat: "Y-m-d H:i",
                        altInput: true,
                        altFormat: "d/m/Y às H:i",
                        locale: {
                          firstDayOfWeek: 1,
                          weekdays: {
                            shorthand: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
                            longhand: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']
                          },
                          months: {
                            shorthand: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                            longhand: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
                          }
                        }
                      }}
                    />
                  )}
                />
              </FormGroup>
            </div>

            {/* Categoria */}
            <div className="space-y-2">
              <SelectForm
                label="Categoria"
                options={categories}
                register={register}
                error={errors.cata}
                name="cata"
              />
            </div>

            {/* Local */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Local (opcional)
              </label>
              <input
                type="text"
                placeholder="Ex: Sala de reuniões, Escritório central..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Descrição (opcional)
              </label>
              <textarea
                placeholder="Adicione detalhes sobre o compromisso..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Participantes */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Participantes (opcional)
              </label>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Digite o nome ou email do participante"
                  value={newParticipant}
                  onChange={(e) => setNewParticipant(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addParticipant())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={addParticipant}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar
                </button>
              </div>

              {participants.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500">Participantes ({participants.length}):</p>
                  <div className="flex flex-wrap gap-2">
                    {participants.map((participant, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-sm"
                      >
                        <span>{participant}</span>
                        <button
                          type="button"
                          onClick={() => removeParticipant(participant)}
                          className="text-blue-600 hover:text-red-600 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Botões de Ação */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <div>
                {event && (
                  <button
                    type="button"
                    className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-200 flex items-center gap-2"
                    onClick={() => handleDelete(event?.event.id)}
                  >
                    <X className="h-4 w-4" />
                    Excluir Compromisso
                  </button>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors duration-200 font-medium"
                >
                  {event ? "Atualizar" : "Criar"} Compromisso
                </button>
              </div>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default EventModal;