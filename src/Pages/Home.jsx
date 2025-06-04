import React, { useEffect } from 'react';
import { Card, Row, Col, Spin, message } from 'antd';
import {
  CalendarOutlined,
  UsergroupAddOutlined,
  ApartmentOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getTotalCounts } from '../Redux/Slices/dashboardSlice';
const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { counts, loading, error } = useSelector(state => state.dashboard);

  useEffect(() => {
    dispatch(getTotalCounts());
  }, [dispatch]);

  useEffect(() => {
    if (error) message.error('Failed to load dashboard data.');
  }, [error]);

  const cardData = [
    {
      title: 'Total Events',
      icon: <CalendarOutlined />,
      count: counts.events,
      gradient: 'linear-gradient(135deg, #ff6b6b, #ff9a9e)',
      route: '/events-list',
    },
    {
      title: 'Total Units',
      icon: <ApartmentOutlined />,
      count: counts.units,
      gradient: 'linear-gradient(135deg, #1dd1a1, #a0ffe6)',
      route: '/unit-list',
    },
    {
      title: 'Total Volunteers',
      icon: <UsergroupAddOutlined />,
      count: counts.volunteers,
      gradient: 'linear-gradient(135deg, #54a0ff, #a0c4ff)',
      route: '/volunteer-list',
    },
    {
      title: 'Total Locations',
      icon: <EnvironmentOutlined />,
      count: counts.locations,
      gradient: 'linear-gradient(135deg, #f368e0, #fcd3ff)',
      route: '/location-list',
    },
  ];

  return (
    <div style={{ padding: '30px' }}>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Row gutter={[24, 24]}>
          {cardData.map(({ title, icon, count, gradient, route }) => (
            <Col xs={24} sm={12} md={12} lg={6} key={title}>
              <Card
                hoverable
                onClick={() => navigate(route)}
                style={{
                  borderRadius: 20,
                  boxShadow: `0 6px 18px rgba(0, 0, 0, 0.1)`,
                  transition: 'all 0.3s ease-in-out',
                  cursor: 'pointer',
                  background: '#ffffff',
                  textAlign: 'center',
                  padding: 20,
                }}
                bodyStyle={{ padding: '20px 0' }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = `0 12px 24px rgba(0,0,0,0.15)`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = `0 6px 18px rgba(0, 0, 0, 0.1)`;
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    margin: '0 auto 16px',
                    borderRadius: '50%',
                    background: gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ fontSize: 30, color: '#fff' }}>{icon}</span>
                </div>
                <h3 style={{ fontWeight: '600', fontSize: 20, marginBottom: 8, color: '#555' }}>
                  {title}
                </h3>
                <p style={{ fontWeight: '800', fontSize: 38, margin: 0, color: '#222' }}>
                  {count}
                </p>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default Home;
