const pool = require('../db');

// 1. Create a new Category (Admin only)
const createCategory = async (req, res) => {
  try {
    const { name, amount, description } = req.body;
    
    const newCategory = await pool.query(
      'INSERT INTO contribution_categories (name, amount, description) VALUES ($1, $2, $3) RETURNING *',
      [name, amount, description]
    );

    res.json(newCategory.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// 2. Get all Categories (For everyone to see)
const getAllCategories = async (req, res) => {
  try {
    const allCategories = await pool.query('SELECT * FROM contribution_categories ORDER BY created_at DESC');
    res.json(allCategories.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, amount, description } = req.body;

    const updatedCategory = await pool.query(
      'UPDATE contribution_categories SET name = $1, amount = $2, description = $3 WHERE id = $4 RETURNING *',
      [name, amount, description, id]
    );

    res.json(updatedCategory.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const check = await pool.query('SELECT * FROM payments WHERE category_id = $1', [id]);
    if (check.rows.length > 0) {
      return res.status(400).json({ message: 'Cannot delete: Payments already exist for this fee.' });
    }

    await pool.query('DELETE FROM contribution_categories WHERE id = $1', [id]);
    res.json({ message: 'Category deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  deleteCategory,
  createCategory,
  getAllCategories,
  updateCategory
};