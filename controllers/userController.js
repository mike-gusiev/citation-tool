const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const knex = require('../knex');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await knex('users').where({ email }).first();
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [user] = await knex('users')
      .insert({
        username,
        email,
        password: hashedPassword,
      })
      .returning(['id']);
    const userId = user.id;

    await knex('credits').insert({
      user_id: userId,
      balance: 1000,
    });

    res.status(201).json({ userId, message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user', error });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await knex('users').where({ email }).first();
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    
    const credit = await knex('credits').where({ user_id: user.id }).first();

    res.status(200).json({
      token,
      user: { id: user.id, username: user.username, email: user.email,  credit: credit ? credit.balance : 0 },
      message: 'Logged in successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await knex('users').where({ id: req.user.userId }).first();
    const credit = await knex('credits').where({ user_id: req.user.userId }).first();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ id: user.id, username: user.username, email: user.email ,  credit: credit ? credit.balance : 0});
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user data', error });
  }
};

exports.addCredit = async (req, res) => {
  try {
    const userId = req.user.userId;

    const userCredit = await knex('credits').where({ user_id: userId }).first();
    if (!userCredit) {
      return res.status(404).json({ message: 'Credits record not found' });
    }

    const newBalance = userCredit.balance + 1000;
    await knex('credits').where({ user_id: userId }).update({ balance: newBalance });

    res.status(200).json({ message: 'Balance updated successfully', newBalance });
  } catch (error) {
    res.status(500).json({ message: 'Error updating balance', error });
  }
};

exports.getUserTasks = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const tasks = await knex('tasks')
      .where({ user_id: userId })
      .select(
        'task_id',
        'keyword',
        'keyword_type',
        'status',
        'check_url',
        'url_qty',
        'excel_file_path',
        'created_at',
        'updated_at',
        "result_data",
      )
      .orderBy('created_at', 'desc'); 

    res.status(200).json({
      message: 'Tasks fetched successfully',
      tasks,
    });
  } catch (error) {
    console.error('Error fetching user tasks:', error.message);
    res.status(500).json({
      message: 'Failed to fetch tasks',
      error: error.message,
    });
  }
};