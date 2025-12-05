const pool = require('../db');

const createAnnouncement = async (req, res) => {
  try {
    const { title, text, type, priority, target_audience, status } = req.body;

    const created_by = req.user.id;

    const newAnnouncement = await pool.query(
        `INSERT INTO announcements (title, text, type, priority, target_audience, status, created_by) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [title, text, type, priority, target_audience, status, created_by]
    )
    res.json(newAnnouncement.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const getAllAnnouncements = async (req, res) => {
  try {
    const allAnnouncements = await pool.query('SELECT * FROM announcements ORDER BY created_at DESC');
    res.json(allAnnouncements.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  createAnnouncement,
  getAllAnnouncements
};