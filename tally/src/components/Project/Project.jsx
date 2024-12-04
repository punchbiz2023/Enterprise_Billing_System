import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import './Project.css';

function Project() {
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState('');
  const [projectCode, setProjectCode] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [billingMethod, setBillingMethod] = useState('');
  const [totalProjectCost, setTotalProjectCost] = useState('');
  const [description, setDescription] = useState('');
  const [costBudget, setCostBudget] = useState('');
  const [revenueBudget, setRevenueBudget] = useState('');
  const [hoursBudgetType, setHoursBudgetType] = useState('');
  const [users, setUsers] = useState([{ name: '', email: '' }]);
  const [tasks, setTasks] = useState([{ name: '', description: '' }]);
  const [availableCustomers, setAvailableCustomers] = useState([]);

  // Fetch available customers when component mounts
  const [loggedUser, setLoggedUser] = useState(null);

  useEffect(() => {
    if (loggedUser) {
      fetchCustomers(loggedUser);
    }
  }, [loggedUser]);
  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    const decoded = jwtDecode(token)
    setLoggedUser(decoded.email); 
    
  }, []);
  const fetchCustomers = async (loggedUser) => {
    try {
      const response = await axios.get('https://enterprisebillingsystem.onrender.com/api/customers', {
        params: { loggedUser }
      });
      setAvailableCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

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

  const addNewUser = () => {
    setUsers([...users, { name: '', email: '' }]);
  };

  const saveProject = async (e) => {
    e.preventDefault();

    const projectData = {
      projectName,
      projectCode,
      customerName,
      billingMethod,
      totalProjectCost,
      description,
      costBudget,
      revenueBudget,
      hoursBudgetType,
      users,
      tasks,
    };
    const data = { ...projectData, loggedUser }

    try {
      await axios.post('https://enterprisebillingsystem.onrender.com/api/projects', data);
      alert('Project saved successfully!');
      navigate('/dashboard/sales/estimate/form');
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  return (
    <div className="new-project">
      <h2 className="text-2xl font-semibold mb-10 mt-20 text-gray-700">New Project</h2>

      <form onSubmit={saveProject}>
        <div className="form-group">
          <label>Project Name*</label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter project name"
            required
          />
        </div>

        <div className="form-group">
          <label>Project Code</label>
          <input
            type="text"
            value={projectCode}
            onChange={(e) => setProjectCode(e.target.value)}
            placeholder="Enter project code"
            required
          />
        </div>

        <div className="form-group">
          <label>Customer Name*</label>
          <select value={customerName} onChange={(e) => setCustomerName(e.target.value)} required>
            <option value="">Select a customer</option>
            {availableCustomers.map((customer) => (
              <option key={customer.sno} value={customer.name}>{customer.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Billing Method*</label>
          <select value={billingMethod} onChange={(e) => setBillingMethod(e.target.value)} required>
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
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Max. 2000 characters"
            required
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
            required
          />
        </div>

        <div className="form-group">
          <label>Revenue Budget</label>
          <input
            type="text"
            value={revenueBudget}
            onChange={(e) => setRevenueBudget(e.target.value)}
            placeholder="INR"
            required
          />
        </div>

        <div className="form-group">
          <label>Hours Budget Type</label>
          <select value={hoursBudgetType} onChange={(e) => setHoursBudgetType(e.target.value)} required>
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
                    required
                  />
                </td>
                <td>
                  <input
                    type="email"
                    value={user.email}
                    onChange={(e) => handleUserChange(index, 'email', e.target.value)}
                    placeholder="Enter email"
                    required
                  />
                </td>
                <td>
                  <button type="button" onClick={() => setUsers(users.filter((_, i) => i !== index))}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" className="add-user" onClick={addNewUser}>
          Add User
        </button><br /><br />

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
                    required
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={task.description}
                    onChange={(e) => handleTaskChange(index, 'description', e.target.value)}
                    placeholder="Enter task description"
                    required
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
        <button type="button" className="add-task" onClick={addNewTask}>
          Add Project Task
        </button><br /><br />

        <div className="form-actions" >
          <button type="submit" className="save">
            Save Project
          </button>
        </div>
      </form>
    </div>
  );
}

export default Project;
