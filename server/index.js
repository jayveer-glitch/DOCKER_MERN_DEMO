import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (replace with database later)
let employees = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@company.com',
    position: 'Software Engineer',
    department: 'Engineering',
    phone: '(555) 123-4567',
    hireDate: '2023-01-15'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
    position: 'Product Manager',
    department: 'Product',
    phone: '(555) 987-6543',
    hireDate: '2022-11-08'
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike.johnson@company.com',
    position: 'Designer',
    department: 'Design',
    phone: '(555) 456-7890',
    hireDate: '2023-03-22'
  }
];

let nextId = 4;

// Routes
// Get all employees
app.get('/api/employees', (req, res) => {
  res.json(employees);
});

// Get employee by ID
app.get('/api/employees/:id', (req, res) => {
  const employee = employees.find(emp => emp.id === parseInt(req.params.id));
  if (!employee) {
    return res.status(404).json({ message: 'Employee not found' });
  }
  res.json(employee);
});

// Create new employee
app.post('/api/employees', (req, res) => {
  const { name, email, position, department, phone, hireDate } = req.body;
  
  if (!name || !email || !position || !department) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const newEmployee = {
    id: nextId++,
    name,
    email,
    position,
    department,
    phone: phone || '',
    hireDate: hireDate || new Date().toISOString().split('T')[0]
  };

  employees.push(newEmployee);
  res.status(201).json(newEmployee);
});

// Update employee
app.put('/api/employees/:id', (req, res) => {
  const employeeIndex = employees.findIndex(emp => emp.id === parseInt(req.params.id));
  if (employeeIndex === -1) {
    return res.status(404).json({ message: 'Employee not found' });
  }

  const { name, email, position, department, phone, hireDate } = req.body;
  employees[employeeIndex] = {
    ...employees[employeeIndex],
    name: name || employees[employeeIndex].name,
    email: email || employees[employeeIndex].email,
    position: position || employees[employeeIndex].position,
    department: department || employees[employeeIndex].department,
    phone: phone !== undefined ? phone : employees[employeeIndex].phone,
    hireDate: hireDate || employees[employeeIndex].hireDate
  };

  res.json(employees[employeeIndex]);
});

// Delete employee
app.delete('/api/employees/:id', (req, res) => {
  const employeeIndex = employees.findIndex(emp => emp.id === parseInt(req.params.id));
  if (employeeIndex === -1) {
    return res.status(404).json({ message: 'Employee not found' });
  }

  const deletedEmployee = employees.splice(employeeIndex, 1)[0];
  res.json(deletedEmployee);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});