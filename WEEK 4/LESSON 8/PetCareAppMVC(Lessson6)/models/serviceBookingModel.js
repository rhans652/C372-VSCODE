const pool = require('../config/db');

// Creates a pending booking and its pending payment in ONE transaction.
// callback(null, { bookingId, paymentId })  -> both committed
// callback(null, null)                      -> pet not owned / service unavailable
// callback(err)                             -> database failure (rolled back)
function createPendingBooking(ownerId, petId, serviceId, bookingDate, callback) {
  let finished = false;
  function done(err, result) {
    if (finished) return;
    finished = true;
    callback(err, result);
  }

  pool.getConnection((connErr, conn) => {
    if (connErr) return done(connErr);

    // Roll back (best effort), release the connection, then report.
    function fail(err) {
      conn.rollback(() => {
        conn.release();
        done(err);
      });
    }

    conn.beginTransaction((beginErr) => {
      if (beginErr) {
        conn.release();
        return done(beginErr);
      }

      // Ownership, active status and the price are all resolved inside the insert.
      const bookingSql =
        'INSERT INTO service_bookings (pet_id, service_id, booking_status, booked_price, booking_date) ' +
        "SELECT p.id, s.id, 'pending', s.price, ? " +
        'FROM pets p JOIN services s ON s.id = ? AND s.is_active = 1 ' +
        'WHERE p.id = ? AND p.owner_id = ?';

      conn.query(bookingSql, [bookingDate, serviceId, petId, ownerId], (bookingErr, bookingResult) => {
        if (bookingErr) return fail(bookingErr);

        if (bookingResult.affectedRows !== 1) {
          // Not an error: pet not owned, or service unknown/inactive.
          return conn.rollback((rollbackErr) => {
            conn.release();
            if (rollbackErr) return done(rollbackErr);
            done(null, null);
          });
        }

        const bookingId = bookingResult.insertId;

        // Amount comes from the stored booking price; payment_reference stays NULL.
        const paymentSql =
          "INSERT INTO payments (booking_id, amount, payment_status) " +
          "SELECT id, booked_price, 'pending' FROM service_bookings WHERE id = ?";

        conn.query(paymentSql, [bookingId], (paymentErr, paymentResult) => {
          if (paymentErr) return fail(paymentErr);
          if (paymentResult.affectedRows !== 1) {
            return fail(new Error('Payment record was not created.'));
          }

          const paymentId = paymentResult.insertId;

          conn.commit((commitErr) => {
            if (commitErr) return fail(commitErr);
            conn.release();
            done(null, { bookingId, paymentId });
          });
        });
      });
    });
  });
}

function getBookingsByOwner(ownerId, callback) {
  const sql =
    'SELECT sb.id AS booking_id, ' +
    "DATE_FORMAT(sb.booking_date, '%Y-%m-%d') AS booking_date, " +
    'p.name AS pet_name, s.name AS service_name, ' +
    'sb.booked_price, sb.booking_status, ' +
    'pay.payment_status, pay.payment_reference, sb.created_at ' +
    'FROM service_bookings sb ' +
    'JOIN pets p ON p.id = sb.pet_id ' +
    'JOIN services s ON s.id = sb.service_id ' +
    'LEFT JOIN payments pay ON pay.booking_id = sb.id ' +
    'WHERE p.owner_id = ? ' +
    'ORDER BY sb.created_at DESC, sb.id DESC';

  pool.query(sql, [ownerId], (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
}

module.exports = { createPendingBooking, getBookingsByOwner };
