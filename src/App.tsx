import React, { useState, useEffect } from 'react';
import { Employee } from './types/Employee';
import { employeeService } from './services/employeeService';
import { EmployeeCard } from './components/EmployeeCard';
import { EmployeeForm } from './components/EmployeeForm';
import { SearchBar } from './components/SearchBar';
import { Plus, Users } from 'lucide-react';

function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    const filtered = employees.filter(employee =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmployees(filtered);
  }, [employees, searchTerm]);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getAllEmployees();
      setEmployees(data);
      setError(null);
    } catch (err) {
      setError('Failed to load employees. Please make sure the server is running.');
      console.error('Error loading employees:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setIsFormOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsFormOpen(true);
  };

  const handleDeleteEmployee = async (id: number) => {
    try {
      await employeeService.deleteEmployee(id);
      setEmployees(employees.filter(emp => emp.id !== id));
    } catch (err) {
      alert('Failed to delete employee');
      console.error('Error deleting employee:', err);
    }
  };

  const handleFormSubmit = async (employeeData: Omit<Employee, 'id'> | Employee) => {
    try {
      if (editingEmployee) {
        // Update existing employee
        const updatedEmployee = await employeeService.updateEmployee(
          editingEmployee.id,
          employeeData
        );
        setEmployees(employees.map(emp => 
          emp.id === editingEmployee.id ? updatedEmployee : emp
        ));
      } else {
        // Create new employee
        const newEmployee = await employeeService.createEmployee(employeeData);
        setEmployees([...employees, newEmployee]);
      }
      setIsFormOpen(false);
      setEditingEmployee(null);
    } catch (err) {
      alert('Failed to save employee');
      console.error('Error saving employee:', err);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingEmployee(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading employees...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800">{error}</p>
          </div>
          <button
            onClick={loadEmployees}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="text-blue-600" size={28} />
              <h1 className="text-2xl font-bold text-gray-900">Employee Management</h1>
            </div>
            <button
              onClick={handleAddEmployee}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
            >
              <Plus size={20} />
              Add Employee
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by name, position, department, or email..."
          />
        </div>

        {filteredEmployees.length === 0 ? (
          <div className="text-center py-12">
            <Users className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No employees found' : 'No employees yet'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Get started by adding your first employee'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={handleAddEmployee}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Add First Employee
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-gray-600">
                {filteredEmployees.length} employee{filteredEmployees.length !== 1 ? 's' : ''} found
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredEmployees.map((employee) => (
                <EmployeeCard
                  key={employee.id}
                  employee={employee}
                  onEdit={handleEditEmployee}
                  onDelete={handleDeleteEmployee}
                />
              ))}
            </div>
          </>
        )}
      </main>

      <EmployeeForm
        employee={editingEmployee}
        onSubmit={handleFormSubmit}
        onClose={handleFormClose}
        isOpen={isFormOpen}
      />
    </div>
  );
}

export default App;