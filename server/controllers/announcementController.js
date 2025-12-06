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

const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, text, type, priority, target_audience, status } = req.body;


    const updateAnnouncement = await pool.query(
      `UPDATE announcements SET title = $1, text = $2, type = $3, priority = $4, target_audience = $5, status = $6 WHERE id = $7 RETURNING *`,
      [title, text, type, priority, target_audience, status, id]
    );

    res.json(updateAnnouncement.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}

const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM announcements WHERE id = $1', [id]);
    res.json({ message: 'Announcement deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}

module.exports = {
  createAnnouncement,
  getAllAnnouncements,
  updateAnnouncement,
  deleteAnnouncement
};