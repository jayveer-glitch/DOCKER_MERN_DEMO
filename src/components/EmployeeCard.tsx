import React from 'react';
import { Employee } from '../types/Employee';
import { Edit, Trash2, Mail, Phone, Calendar, Building } from 'lucide-react';

interface EmployeeCardProps {
  employee: Employee;
  onEdit: (employee: Employee) => void;
  onDelete: (id: number) => void;
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, onEdit, onDelete }) => {
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${employee.name}?`)) {
      onDelete(employee.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{employee.name}</h3>
          <p className="text-blue-600 font-medium">{employee.position}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(employee)}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Building size={14} />
          <span>{employee.department}</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail size={14} />
          <span>{employee.email}</span>
        </div>
        {employee.phone && (
          <div className="flex items-center gap-2">
            <Phone size={14} />
            <span>{employee.phone}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Calendar size={14} />
          <span>Hired: {new Date(employee.hireDate).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};