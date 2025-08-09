const CreateBtn = document.getElementById("EventNewBtn");
const EventFormSubmitBtn = document.getElementById("EventFormSubmitBtn");
const EventFormModalEl = document.getElementById("EventFormModal");
const EventFormModal = new bootstrap.Modal(EventFormModalEl, { backdrop: "static", keyboard: true });
const EventDetailsModalEl = document.getElementById("EventDetailsModal");
const EventDetailsModal = new bootstrap.Modal(EventDetailsModalEl, { backdrop: "static", keyboard: true });
const EventForm = EventFormModalEl.querySelector('form#event-form');

var calendarEl, calendar;
document.addEventListener('DOMContentLoaded', function () {
    /** Initializing and Rendering Calendar */
    calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        themeSystem: 'bootstrap5',
        headerToolbar: {
            start: 'title',
            center: 'dayGridMonth,timeGridWeek,listWeek',
            end: 'today prev,next'
        },
        selectable: true,
        dateClick: function (info) {
            // console.log(info);
            var time = "";
            if (info.view.type != "dayGridMonth") {
                // console.log(info.date.getTime());
                var hour = info.date.getHours();
                var min = info.date.getMinutes();
                hour = String(hour).padStart(2, "0");
                min = String(min).padStart(2, "0");
                time = `${hour}:${min}`;
            }
            OpenEventFormModal({
                start_date: info.dateStr,
                allday: info.allDay,
                start_time: time
            });
        },
        eventClick: function (info) {
            EventDetailsModalEl.querySelector('#EditEvent').dataset.id = info.event.id;
            EventDetailsModalEl.querySelector('#DeleteEvent').dataset.id = info.event.id;
            EventDetailsModalEl.querySelector('.title').innerText = info.event.title;
            EventDetailsModalEl.querySelector('.description').innerText = info.event.extendedProps.description;
            var start_date = new Date(info.event.startStr);
            start_date = start_date.toLocaleDateString(undefined, undefined);
            if(info.event.endStr != ""){
                var end_date = new Date(info.event.endStr);
                end_date = end_date.toLocaleDateString(undefined, undefined);
                if (start_date == end_date) {
                    EventDetailsModalEl.querySelector('.date').innerText = (info.event.start).toLocaleDateString(undefined, { month: "long", day: "2-digit", year: "numeric" });
                } else {
                    EventDetailsModalEl.querySelector('.date').innerText = (info.event.start).toLocaleDateString(undefined, { month: "long", day: "2-digit", year: "numeric" }) + " - " + (info.event.end).toLocaleDateString(undefined, { month: "long", day: "2-digit", year: "numeric" });
                }
            }else{
                EventDetailsModalEl.querySelector('.date').innerText = (info.event.start).toLocaleDateString(undefined, { month: "long", day: "2-digit", year: "numeric" });
            }

            if (info.event.allDay) {
                EventDetailsModalEl.querySelector('.time').innerText = "All Day";
            } else {
                EventDetailsModalEl.querySelector('.time').innerText = (info.event.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }) + " - " + (info.event.end).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", hour12: true });
            }
            EventDetailsModal.show();
        }
    });
    calendar.render();
    LoadEvent();

    /**
     * Open Event Form Modal for New Event Data
     * @param {
     *  title (string)
     *  description (string)
     *  start_date (date)
     *  end_date   (date)
     *  start_time (time)
     *  end_date   (time)
     *  allday     (boolean)
     *  singleDate (boolean)
     * } defaultData 
     */
    function OpenEventFormModal(defaultData = {}) {
        EventFormModalEl.querySelector(".modal-title").innerText = "Create New Event";
        if (!!defaultData.id && defaultData.id != ""){
            EventFormModalEl.querySelector("input#id").value = defaultData.id;
            EventFormModalEl.querySelector(".modal-title").innerText = "Edit Event";
        }
        if (!!defaultData.title && defaultData.title != "")
            EventFormModalEl.querySelector("input#title").value = defaultData.title;
        if (!!defaultData.description && defaultData.description != "")
            EventFormModalEl.querySelector("textarea#description").value = defaultData.description;
        if (!!defaultData.start_date && defaultData.start_date != ""){
            var start_date = new Date(defaultData.start_date);
            var start_date_month = start_date.getMonth() + 1;
            var start_date_day = start_date.getDate();
            var start_date_year = start_date.getFullYear();
                start_date_month = String(start_date_month).padStart(2, "0");
                start_date_day = String(start_date_day).padStart(2, "0");
            start_date = `${start_date_year}-${start_date_month}-${start_date_day}`;
            EventFormModalEl.querySelector("input#start_date").value = start_date;
        }
        if (!!defaultData.end_date && defaultData.end_date != ""){
            var end_date = new Date(defaultData.end_date);
            var end_date_month = end_date.getMonth() + 1;
            var end_date_day = end_date.getDate();
            var end_date_year = end_date.getFullYear();
                end_date_month = String(end_date_month).padStart(2, "0");
                end_date_day = String(end_date_day).padStart(2, "0");
            end_date = `${end_date_year}-${end_date_month}-${end_date_day}`;
            EventFormModalEl.querySelector("input#end_date").value = end_date;
        }
        if (!!defaultData.start_time && defaultData.start_time != ""){
            EventFormModalEl.querySelector("input#start_time").value = defaultData.start_time;
        }
        if (!!defaultData.end_date && defaultData.end_time != "")
            EventFormModalEl.querySelector("input#end_time").value = defaultData.end_time;
        EventFormModalEl.querySelector("input#all_day").checked = !!defaultData.allday;
        EventFormModalEl.querySelector("input#use_single_date").checked = !!defaultData.singleDate;

        EventFormModal.show();
    }

    CreateBtn.addEventListener("click", OpenEventFormModal);


    /**
     * Input functions when Event Form Modal is Shown
     */

    // Use Single Day Date for an Event
    const UseSingleDayListener = () => {
        var is_checked = EventFormModalEl.querySelector('#use_single_date').checked;
        if (is_checked) {
            EventFormModalEl.querySelector("#event-form-date-container>div:nth-child(2)").style.display = 'none';
            EventFormModalEl.querySelector("#event-form-date-container>div:nth-child(2) input").removeAttribute("required");
            EventFormModalEl.querySelector("#event-form-date-container>div:nth-child(1) .form-label").innerText = 'Date';
        } else {
            EventFormModalEl.querySelector("#event-form-date-container>div:nth-child(1) .form-label").innerText = 'Start Date';
            EventFormModalEl.querySelector("#event-form-date-container>div:nth-child(2)").style.display = null;
            EventFormModalEl.querySelector("#event-form-date-container>div:nth-child(2) input").setAttribute("required", true);
        }
    };

    // Set Event as All Day
    const SetAllDay = () => {
        var is_checked = EventFormModalEl.querySelector('#all_day').checked;
        if (is_checked) {
            EventFormModalEl.querySelector("#event-form-time-container>div:nth-child(1)").style.display = 'none';
            EventFormModalEl.querySelector("#event-form-time-container>div:nth-child(1) input").removeAttribute("required", false);
            EventFormModalEl.querySelector("#event-form-time-container>div:nth-child(2)").style.display = 'none';
            EventFormModalEl.querySelector("#event-form-time-container>div:nth-child(2) input").removeAttribute("required", false);
        } else {
            EventFormModalEl.querySelector("#event-form-time-container>div:nth-child(1)").style.display = null;
            EventFormModalEl.querySelector("#event-form-time-container>div:nth-child(1) input").setAttribute("required", true);
            EventFormModalEl.querySelector("#event-form-time-container>div:nth-child(2)").style.display = null;
            EventFormModalEl.querySelector("#event-form-time-container>div:nth-child(2) input").setAttribute("required", true);
        }
    };

    /**
     * Event's Form/Details Modal
     */
    EventFormModalEl.addEventListener("shown.bs.modal", () => {
        UseSingleDayListener();
        SetAllDay();
        EventFormModalEl.querySelector("#use_single_date").addEventListener("change", UseSingleDayListener);
        EventFormModalEl.querySelector("#all_day").addEventListener("change", SetAllDay);
    })
    EventFormModalEl.addEventListener("hide.bs.modal", () => {
        EventFormModalEl.querySelector("#use_single_date").removeEventListener("change", UseSingleDayListener);
        EventFormModalEl.querySelector("#all_day").removeEventListener("change", SetAllDay);

        EventFormModalEl.querySelectorAll("input, textarea").forEach(function (el) {
            if (el.type == "checkbox") {
                el.checked = false;
            } else {
                el.value = null;
            }
        })
        UseSingleDayListener();
        SetAllDay();
    })

    EventDetailsModalEl.addEventListener("hidden.bs.modal", () => {
        EventDetailsModalEl.querySelector('#EditEvent').dataset.id = null;
        EventDetailsModalEl.querySelector('#DeleteEvent').dataset.id = null;
        EventDetailsModalEl.querySelector('.title').innerText = null;
        EventDetailsModalEl.querySelector('.description').innerText = null;
        EventDetailsModalEl.querySelector('.date').innerText = null;
        EventDetailsModalEl.querySelector('.time').innerText = null;
    })

    /**
     * Edit Event Detials
     */

    const edit_event = (id) => {
        var event = calendar.getEventById(id);
        var data = {
            id: event.id,
            title: event.title,
            description: event.extendedProps.description || "",
            allday: event.allDay,
            start_date: (event.start).toLocaleDateString([]),
            end_date: (event.end == null) ? null : (event.end).toLocaleDateString([]),
            start_time: (event.start).toLocaleTimeString([], {hour12: false}),
            end_time: (event.end == null) ? null : (event.end).toLocaleTimeString([], {hour12: false}),
            singleDate: event.extendedProps.singleDate || false
        };

        EventDetailsModal.hide();
        OpenEventFormModal(data);
    }
    EventDetailsModalEl.querySelector('#EditEvent').addEventListener("click", function (e) {
        e.preventDefault();

        var id = this.dataset.id || "";
        if(id == "")
        return;
        edit_event(id);
    })
    EventDetailsModalEl.querySelector('#DeleteEvent').addEventListener("click", function (e) {
        e.preventDefault();

        var id = this.dataset.id || "";
        if(id == "")
            return;
        var conf = confirm("Are you sure to delete this Event?");
        if(conf)
        deleteEvent(id);
    })
    /**
     * Form Submission
     */
    function form_submission(e) {
        e.preventDefault();
        var data = JSON.parse(window.localStorage.getItem("Events") || "[]");

        var id = EventForm.querySelector("#id").value;
        var title = EventForm.querySelector("#title").value;
        var description = EventForm.querySelector("#description").value;
        var start_date = EventForm.querySelector("#start_date").value;
        var end_date = EventForm.querySelector("#end_date").value;
        var is_single_date = (EventForm.querySelector("#use_single_date").checked) ? "true" : "false";
        var start_time = EventForm.querySelector("#start_time").value;
        var end_time = EventForm.querySelector("#end_time").value;
        var is_all_day = (EventForm.querySelector("#all_day").checked) ? "true" : "false";


        var do_exist = false;
        var dataObj = {
            id: id,
            title: title,
            description: description,
            start_date: start_date,
            end_date: end_date,
            is_single_date: is_single_date,
            start_time: start_time,
            end_time: end_time,
            is_all_day: is_all_day,
        };

        for (var i = 0; i < data.length; i++) {
            if (parseInt(id) != parseInt(data[i].id))
                continue;
            dataObj.id = id;
            data[i] = dataObj;
            do_exist = true;
        }

        if (!do_exist) {
            if (data.length <= 0) {
                id = 1;
            } else {
                id = parseInt(data[data.length - 1].id) + 1;
            }

            dataObj.id = id;
            data.push(dataObj);
        }
        window.localStorage.setItem("Events", JSON.stringify(data));
        if (!do_exist) {
            alert("New Event Data has been created successfullly!");
        } else {
            calendar.getEventById(id).remove();
            alert("Event Data has been updated successfullly!");
        }
        AddToCalendar(dataObj);
        //location.reload();
        EventFormModal.hide();
    }
    EventForm.addEventListener("submit", form_submission);

    function deleteEvent(id)
    {
        var data = JSON.parse(window.localStorage.getItem("Events") || "[]");
        var do_exist = false;
        if(data.length > 0){
            for(var i = 0; i < data.length; i++)
            {
                if(parseInt(data[i].id) != parseInt(id))
                continue;
                do_exist = true;
                delete data[i];
            }
        }
        if(!do_exist){
            alert("Event ID is not existing!");
        }else{
            data = data.filter(item => item != null);
            window.localStorage.setItem("Events", JSON.stringify(data));
            calendar.getEventById(id).remove();
            EventDetailsModal.hide();
        }
    }
    /**
     * Load Events to Calendar
     */

    function LoadEvent() {
        var data = JSON.parse(window.localStorage.getItem("Events") || "[]");
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                AddToCalendar(data[i]);
            }
        }
    }

    function AddToCalendar(event) {
        var data = {};
        data.id = event.id || "";
        data.title = event.title || "";
        data.description = event.description || "";
        data.allDay = ((event.is_all_day || "fales") == "true");

        var sdate = event.start_date || "";
        var edate = event.end_date || "";

        var stime = event.start_time || "";
        var etime = event.end_time || "";

        var is_single_date = ((event.is_single_date || "fales") == "true");
        data.singleDate = is_single_date;

        if (is_single_date) {
            edate = sdate;
        }

        if (data.allDay) {
            data.start = sdate;
            data.end = edate;
        } else {
            data.start = `${sdate}T${stime}`;
            data.end = `${edate}T${etime}`;
        }
        if (calendar != null)
            calendar.addEvent(data);
    }
});