import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Spin, Alert, Tooltip, notification, Form, Input, Select } from 'antd';
import { FileTextOutlined, DownloadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const AcceuilJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  useEffect(() => {
    fetchJobs();
    fetchUsers();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://colabhub.onrender.com/jobs/get');
      setJobs(response.data);
    } catch (error) {
      console.error('Error loading jobs:', error);
      notification.error({
        message: 'Error Loading Jobs',
        description: 'There was an error loading the job offers.'
      });
    }
    setLoading(false);
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://colabhub.onrender.com/api/auth/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      notification.error({
        message: 'Error Fetching Users',
        description: 'There was an error fetching the list of users.'
      });
    }
  };

  useEffect(() => {
    setFilteredJobs(jobs.filter(job => job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.technologies.join(', ').toLowerCase().includes(searchTerm.toLowerCase())));
  }, [searchTerm, jobs]);

  const deleteJob = async (jobId) => {
    setLoading(true);
    try {
      await axios.delete(`https://colabhub.onrender.com/jobs/delete/${jobId}`);
      fetchJobs();
      notification.success({
        message: 'Job Deleted',
        description: 'The job offer has been successfully deleted.'
      });
    } catch (error) {
      notification.error({
        message: 'Error Deleting Job',
        description: 'There was an error deleting the job offer.'
      });
    }
    setLoading(false);
  };

  const showEditModal = (job) => {
    setEditingJob(job);
    setIsModalVisible(true);
  };

  const handleUpdate = async (values) => {
    setLoading(true);
    try {
      await axios.put(`https://colabhub.onrender.com/jobs/update/${editingJob._id}`, values);
      notification.success({
        message: 'Job Updated',
        description: 'The job offer has been successfully updated.'
      });
      fetchJobs();
      setIsModalVisible(false);
    } catch (error) {
      notification.error({
        message: 'Failed to Update Job',
        description: 'There was an error updating the job offer.'
      });
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      <div className="flex flex-col mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Jobs Dashboard</h1>
        <input
          type="text"
          placeholder="Search jobs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="rounded-lg border-transparent flex-1 appearance-none border border-orange-700 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent"
        />
      </div>
      <div className="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 border-b border-gray-200 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {filteredJobs.map(job => (
              <tr key={job._id}>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                  <div className="text-sm leading-5 text-gray-900">{job.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                  <div className="text-sm leading-5 text-gray-900">
                    <p><strong>Rate:</strong> {job.rate || 'Not specified'}</p>
                    <p><strong>Expertise Level:</strong> {job.expertiseLevel || 'Unspecified'}</p>
                    <p><strong>Duration:</strong> {job.duration || 'Unspecified'} hours</p>
                    <p><strong>Technologies:</strong> {job.technologies.join(', ')}</p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 font-medium">
                  <button
                    onClick={() => showEditModal(job)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4">
                    <EditOutlined />
                  </button>
                  <button
                    onClick={() => deleteJob(job._id)}
                    className="text-red-600 hover:text-red-900">
                    <DeleteOutlined />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal title="Edit Job" visible={isModalVisible} onCancel={() => setIsModalVisible(false)}
        footer={null}>
        <Form initialValues={{ title: editingJob?.title, rate: editingJob?.rate, ownerId: editingJob?.ownerId }} onFinish={handleUpdate}>
          <Form.Item name="title" label="Title">
            <Input />
          </Form.Item>
          <Form.Item name="rate" label="Rate">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="ownerId" label="Job Owner">
            <Select
                showSearch
                style={{ width: 200 }}
                placeholder="Select an owner"
                optionFilterProp="children"
                filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }>
                {users.map(user => (
                    <Option key={user._id} value={user._id}>{user.email}</Option>
                ))}
            </Select>
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Update
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default AcceuilJobs;
