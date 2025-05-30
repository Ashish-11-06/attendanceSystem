import React from 'react';
import { Table } from 'antd';

// Sample student data
const data = [
  {
    key: '1',
    name: 'John Doe',
    age: 20,
    grade: 'A',
  },
  {
    key: '2',
    name: 'Jane Smith',
    age: 22,
    grade: 'B',
  },
  {
    key: '3',
    name: 'Alice Johnson',
    age: 21,
    grade: 'A+',
  },
];

// Define columns for the table
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Grade',
    dataIndex: 'grade',
    key: 'grade',
  },
];

const Shru = () => {
  return (
    <>
      <Table dataSource={data} columns={columns} />
    </>
  );
};

export default Shru;
