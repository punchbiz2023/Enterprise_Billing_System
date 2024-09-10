import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Project.css';

function Project() {
  const [projectName, setProjectName] = useState('');
  const [projectCode, setProjectCode] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [billingMethod, setBillingMethod] = useState('');
  const [totalProjectCost, setTotalProjectCost] = useState('');
  const [description, setDescription] = useState('');
  const [costBudget, setCostBudget] = useState('');
  const [revenueBudget, setRevenueBudget] = useState('');
  const [hoursBudgetType, setHoursBudgetType] = useState('');
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [availableCustomers, setAvailableCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/customers');
        const data = await response.json();
        setAvailableCustomers(data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    fetchCustomers();
  }, []);

  

  const addNewTask = () => {
    setTasks([...tasks, { name: '', description: '' }]);
  };

  const removeTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleUserChange = (index, field, value) => {
    const newUsers = [...users];
    newUsers[index][field] = value;
    setUsers(newUsers);
  };

  const handleTaskChange = (index, field, value) => {
    const newTasks = [...tasks];
    newTasks[index][field] = value;
    setTasks(newTasks);
  };

  return (
    <div className="new-project">
      <h2 className="text-2xl font-semibold mb-10 mt-20 text-gray-700">New Project</h2>

      <form>
        <div className="form-group">
          <label>Project Name*</label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter project name"
          />
        </div>

        <div className="form-group">
          <label>Project Code</label>
          <input
            type="text"
            value={projectCode}
            onChange={(e) => setProjectCode(e.target.value)}
            placeholder="Enter project code"
          />
        </div>

        <div className="form-group">
          <label>Customer Name*</label>
          <select value={customerName} onChange={(e) => setCustomerName(e.target.value)}>
            <option value="">Select a customer</option>
            {availableCustomers.map((customer) => (
              <option key={customer.sno} value={customer.name}>{customer.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Billing Method*</label>
          <select value={billingMethod} onChange={(e) => setBillingMethod(e.target.value)}>
            <option value="Fixed Cost for Project">Fixed Cost for Project</option>
            <option value="Hourly Billing">Based on Project Hours</option>
            <option value="Task billing">Based on Task Hours</option>
            <option value="Staff billing">Based on Staff Hours</option>
          </select>
        </div>

        <div className="form-group">
          <label>Total Project Cost*</label>
          <input
            type="text"
            value={totalProjectCost}
            onChange={(e) => setTotalProjectCost(e.target.value)}
            placeholder="Enter project cost"
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Max. 2000 characters"
          ></textarea>
        </div>

        <h3 className="text-l font-semibold mb-6 text-gray-700">Budget</h3>

        <div className="form-group">
          <label>Cost Budget</label>
          <input
            type="text"
            value={costBudget}
            onChange={(e) => setCostBudget(e.target.value)}
            placeholder="INR"
          />
        </div>

        <div className="form-group">
          <label>Revenue Budget</label>
          <input
            type="text"
            value={revenueBudget}
            onChange={(e) => setRevenueBudget(e.target.value)}
            placeholder="INR"
          />
        </div>

        <div className="form-group">
          <label>Hours Budget Type</label>
          <select value={hoursBudgetType} onChange={(e) => setHoursBudgetType(e.target.value)}>
            <option value="Total Project Hours (HH:MM)">Total Project Hours (HH:MM)</option>
            <option value="Hours per staff">Hours per staff</option>
            <option value="Hours per task">Hours per Task</option>
          </select>
        </div>

        <h3 className="text-l font-semibold mb-6 text-gray-700">Users</h3>
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>User Name</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <input
                    type="text"
                    value={user.name}
                    onChange={(e) => handleUserChange(index, 'name', e.target.value)}
                    placeholder="Enter user name"
                  />
                </td>
                <td>
                  <input
                    type="email"
                    value={user.email}
                    onChange={(e) => handleUserChange(index, 'email', e.target.value)}
                    placeholder="Enter email"
                  />
                </td>
                <td>
                  <button type="button" onClick={() => removeUser(index)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" className="add-user" >Add User</button>

        <h3 className="text-l font-semibold mb-6 text-gray-700">Project Tasks</h3>
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Task Name</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <input
                    type="text"
                    value={task.name}
                    onChange={(e) => handleTaskChange(index, 'name', e.target.value)}
                    placeholder="Enter task name"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={task.description}
                    onChange={(e) => handleTaskChange(index, 'description', e.target.value)}
                    placeholder="Enter task description"
                  />
                </td>
                <td>
                  <button type="button" onClick={() => removeTask(index)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" className="add-task" >Add Project Task</button>

        <div className="form-actions">
          <button type="submit" className='save'>Save and Select</button>
          <button type="button" className="cancel">Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default Project;
