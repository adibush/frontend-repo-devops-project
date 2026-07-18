const API_URL = "http://localhost:5000";

const reservationForm = document.getElementById("reservationForm");
const lookupForm = document.getElementById("lookupForm");
const hotelSelect = document.getElementById("hotel");
const reservationMessage = document.getElementById("reservationMessage");
const lookupMessage = document.getElementById("lookupMessage");
const reservationDetails = document.getElementById("reservationDetails");
const cancelButton = document.getElementById("cancelButton");
const confirmationModal = document.getElementById("confirmationModal");
const confirmationMessage = document.getElementById("confirmationMessage");
const confirmButton = document.getElementById("confirmButton");
const modalCancelButton = document.getElementById("modalCancelButton");

let currentReservationId = "";
let pendingReservation = null;

function showMessage(element, message, type) {
    element.innerHTML = "";
    element.textContent = message;
    element.className = "message " + type;
}

function clearMessage(element) {
    element.innerHTML = "";
    element.className = "message";
}

function showReservationSuccess(reservationId) {
    reservationMessage.innerHTML = "";
    reservationMessage.className = "message success";

    const messageLine = document.createElement("div");
    messageLine.textContent = "Reservation created successfully";

    const labelLine = document.createElement("div");
    labelLine.textContent = "Reservation ID:";

    const idLine = document.createElement("strong");
    idLine.textContent = reservationId;

    reservationMessage.appendChild(messageLine);
    reservationMessage.appendChild(labelLine);
    reservationMessage.appendChild(idLine);
}

function openConfirmationModal(reservation) {
    pendingReservation = reservation;

    const selectedHotel = hotelSelect.options[hotelSelect.selectedIndex];

    document.getElementById("confirmFullName").textContent = reservation.fullName;
    document.getElementById("confirmEmail").textContent = reservation.email;
    document.getElementById("confirmHotelName").textContent = selectedHotel.dataset.hotelName;
    document.getElementById("confirmCheckIn").textContent = reservation.checkIn;
    document.getElementById("confirmCheckOut").textContent = reservation.checkOut;

    clearMessage(confirmationMessage);
    confirmationModal.classList.remove("hidden");
}

function closeConfirmationModal() {
    pendingReservation = null;
    confirmationModal.classList.add("hidden");
    clearMessage(confirmationMessage);
}

async function loadHotels() {
    try {
        const response = await fetch(API_URL + "/hotels");
        const hotels = await response.json();

        hotelSelect.innerHTML = '<option value="">Select a hotel</option>';

        hotels.forEach(function (hotel) {
            const option = document.createElement("option");
            option.value = hotel.hotelId;
            option.dataset.hotelName = hotel.hotelName;
            option.textContent = hotel.hotelName + " - " + hotel.location;
            hotelSelect.appendChild(option);
        });
    } catch (error) {
        hotelSelect.innerHTML = '<option value="">Unable to load hotels</option>';
        showMessage(reservationMessage, "Unable to load hotels", "error");
    }
}

reservationForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    clearMessage(reservationMessage);

    const reservation = {
        fullName: document.getElementById("fullName").value,
        email: document.getElementById("email").value,
        hotelId: Number(hotelSelect.value),
        checkIn: document.getElementById("checkIn").value,
        checkOut: document.getElementById("checkOut").value,
    };

    openConfirmationModal(reservation);
});

modalCancelButton.addEventListener("click", function () {
    closeConfirmationModal();
});

confirmButton.addEventListener("click", async function () {
    if (pendingReservation === null) {
        return;
    }

    const reservation = pendingReservation;
    closeConfirmationModal();

    try {
        const response = await fetch(API_URL + "/reservation", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(reservation),
        });

        const result = await response.json();

        if (response.ok) {
            showReservationSuccess(result.reservationId);
            reservationForm.reset();
            hotelSelect.selectedIndex = 0;
        } else {
            showMessage(reservationMessage, result.message, "error");
        }
    } catch (error) {
        showMessage(reservationMessage, "Unable to create reservation", "error");
    }
});

lookupForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    clearMessage(lookupMessage);
    reservationDetails.classList.add("hidden");

    const reservationId = document.getElementById("reservationId").value.trim();

    try {
        const response = await fetch(API_URL + "/reservation/" + reservationId);
        const result = await response.json();

        if (response.ok) {
            currentReservationId = reservationId;

            document.getElementById("detailId").textContent = result._id;
            document.getElementById("detailFullName").textContent = result.fullName;
            document.getElementById("detailEmail").textContent = result.email;
            document.getElementById("detailHotelId").textContent = result.hotelId;
            document.getElementById("detailCheckIn").textContent = result.checkIn;
            document.getElementById("detailCheckOut").textContent = result.checkOut;

            reservationDetails.classList.remove("hidden");
        } else {
            showMessage(lookupMessage, result.message, "error");
        }
    } catch (error) {
        showMessage(lookupMessage, "Unable to find reservation", "error");
    }
});

cancelButton.addEventListener("click", async function () {
    clearMessage(lookupMessage);

    try {
        const response = await fetch(API_URL + "/reservation/" + currentReservationId, {
            method: "DELETE",
        });

        const result = await response.json();

        if (response.ok) {
            showMessage(lookupMessage, result.message, "success");
            reservationDetails.classList.add("hidden");
            lookupForm.reset();
            currentReservationId = "";
        } else {
            showMessage(lookupMessage, result.message, "error");
        }
    } catch (error) {
        showMessage(lookupMessage, "Unable to cancel reservation", "error");
    }
});

loadHotels();
