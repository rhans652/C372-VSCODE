const Pet = require('../models/petModel');
const Service = require('../models/serviceModel');
const ServiceBooking = require('../models/serviceBookingModel');

// Local calendar date as YYYY-MM-DD (not UTC, so the day boundary is the server's local day).
function getToday() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Positive integer ID submitted as a plain string (rejects arrays/objects, 0, negatives, decimals).
function parseId(value) {
  if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value)) return null;
  const n = Number(value);
  return Number.isSafeInteger(n) ? n : null;
}

// Real calendar date in YYYY-MM-DD, today or later.
function isValidBookingDate(value, today) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const real = date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
  return real && value >= today;
}

function listServices(req, res) {
  const ownerId = req.session.user.id;

  Pet.getByOwner(ownerId, (petErr, pets) => {
    if (petErr) {
      console.error('Error loading pets:', petErr);
      return res.status(500).send('Unable to load pets.');
    }

    Service.getActiveServices((serviceErr, services) => {
      if (serviceErr) {
        console.error('Error loading services:', serviceErr);
        return res.status(500).send('Unable to load services.');
      }

      // Preselect only a pet that belongs to the signed-in customer.
      let selectedPetId = '';
      const requested = req.query.petId;
      if (typeof requested === 'string' && pets.some((p) => String(p.id) === requested)) {
        selectedPetId = requested;
      }

      return res.render('services', {
        pets,
        services,
        selectedPetId,
        today: getToday(),
        messages: req.flash('success'),
        errors: req.flash('error'),
        session: req.session
      });
    });
  });
}

function createBooking(req, res) {
  const ownerId = req.session.user.id;
  const body = req.body || {};
  const petId = parseId(body.petId);
  const serviceId = parseId(body.serviceId);
  const bookingDate = body.bookingDate;

  if (petId === null || serviceId === null || !isValidBookingDate(bookingDate, getToday())) {
    req.flash('error', 'Choose a pet, service, and valid booking date.');
    return res.redirect('/services');
  }

  ServiceBooking.createPendingBooking(ownerId, petId, serviceId, bookingDate, (err, result) => {
    if (err) {
      console.error('Error creating booking:', err);
      req.flash('error', 'Unable to create the booking. Please try again.');
      return res.redirect(`/services?petId=${encodeURIComponent(petId)}`);
    }

    if (!result) {
      req.flash('error', 'That pet or service is unavailable for booking.');
      return res.redirect('/services');
    }

    req.flash('success', 'Booking created. Payment is pending; no payment has been processed.');
    return res.redirect('/bookings');
  });
}

function listBookings(req, res) {
  const ownerId = req.session.user.id;

  ServiceBooking.getBookingsByOwner(ownerId, (err, bookings) => {
    if (err) {
      console.error('Error loading booking history:', err);
      return res.status(500).send('Unable to load booking history.');
    }

    return res.render('bookings', {
      bookings,
      messages: req.flash('success'),
      errors: req.flash('error'),
      session: req.session
    });
  });
}

module.exports = { listServices, createBooking, listBookings };
