import React, { useEffect, useState } from 'react';
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
import { fetchVolunteerReport } from '../Redux/Api/dashboardApi';
import CountUp from 'react-countup';

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { counts, loading, error } = useSelector(state => state.dashboard);
  const [volunteerReport, setVolunteerReport] = useState({});
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 576);

  useEffect(() => {
    dispatch(getTotalCounts());
    fetchVolunteerReport()
      .then(data => {
        setVolunteerReport(Array.isArray(data) ? data[0] || {} : data);
      })
      .catch(() => setVolunteerReport({}));
  }, [dispatch]);

  useEffect(() => {
    if (error) message.error('Failed to load dashboard data.');
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 576);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [error]);

  const iconStyle = {
    width: 64,
    height: 64,
    margin: '0 auto 16px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 30,
    color: '#fff',
  };

  const labelColors = {
    'Male': '#000',
    'Female': '#000',
    'Registered': '#000',
    'Unreg. Male': '#000',
    'Unreg. Female': '#000',
    'Unreg.': '#000',
  };

  const breakdownItems = [
    { label: 'Male', value: volunteerReport.total_male ?? volunteerReport.male ?? 0 },
    { label: 'Female', value: volunteerReport.total_female ?? volunteerReport.female ?? 0 },
    { label: 'Registered', value: volunteerReport.total_registered ?? volunteerReport.registered ?? 0 },
    { label: 'Unreg. Male', value: volunteerReport.unreg_male ?? 0 },
    { label: 'Unreg. Female', value: volunteerReport.unreg_female ?? 0 },
    { label: 'Unreg.', value: volunteerReport.total_unregistered ?? volunteerReport.unregistered ?? 0 },
  ];

  const otherCards = [
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
      title: 'Total Locations',
      icon: <EnvironmentOutlined />,
      count: counts.locations,
      gradient: 'linear-gradient(135deg, #f368e0, #fcd3ff)',
      route: '/location-list',
    },
  ];

  const renderBreakdownCards = () => (
    <Row gutter={[16, 16]} justify="center" style={{ marginTop: 16 }}>
      {breakdownItems.map(({ label, value }) => (
        <Col span={isMobileView ? 24 : 6} key={label}>
          <Card
            hoverable
            style={{
              borderRadius: 16,
              background: 'linear-gradient(135deg, #54a0ff, #a0c4ff)',
              color: '#000',
              textAlign: 'center',
              boxShadow: '0 0 12px rgba(41, 75, 116, 0.4)',
              backdropFilter: 'blur(6px)',
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: labelColors[label] }}>
              {label}
            </div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>
              <CountUp end={value} duration={1.4} />
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );

  return (
    <div style={{ padding: '30px' }}>
      {loading ? (
        <Spin size="large" />
      ) : (
        <>
          {isMobileView ? (
            <>
              {/* 📱 MOBILE layout */}
              <Row gutter={[16, 16]} justify="center">
                <Col span={24}>
                  <Card
                    hoverable
                    onClick={() => setShowBreakdown(prev => !prev)}
                    style={{
                      borderRadius: 20,
                      boxShadow: '0 6px 18px rgba(0,0,0,0.1)',
                      cursor: 'pointer',
                      background: '#fff',
                      textAlign: 'center',
                      padding: 20,
                    }}
                  >
                    <div style={{ ...iconStyle, background: 'linear-gradient(135deg, #54a0ff, #a0c4ff)' }}>
                      <UsergroupAddOutlined />
                    </div>
                    <h3 style={{ fontWeight: 600, fontSize: 20, marginBottom: 8, color: '#555' }}>
                      Total Volunteers
                    </h3>
                    <p style={{ fontWeight: 800, fontSize: 38, margin: 0, color: '#222' }}>
                      {counts.volunteers}
                    </p>
                  </Card>

                  {showBreakdown && renderBreakdownCards()}
                </Col>
              </Row>

              <Row gutter={[16, 16]} justify="center" style={{ marginTop: 24 }}>
                {otherCards.map(({ title, icon, count, gradient, route }) => (
                  <Col span={24} key={title}>
                    <Card
                      hoverable
                      onClick={() => navigate(route)}
                      style={{
                        borderRadius: 20,
                        boxShadow: '0 6px 18px rgba(0,0,0,0.1)',
                        cursor: 'pointer',
                        background: '#fff',
                        textAlign: 'center',
                        padding: 20,
                      }}
                    >
                      <div style={{ ...iconStyle, background: gradient }}>{icon}</div>
                      <h3 style={{ fontWeight: 600, fontSize: 20, marginBottom: 8, color: '#555' }}>
                        {title}
                      </h3>
                      <p style={{ fontWeight: 800, fontSize: 38, margin: 0, color: '#222' }}>
                        {count}
                      </p>
                    </Card>
                  </Col>
                ))}
              </Row>
            </>
          ) : (
            <>
              {/* 💻 DESKTOP layout */}
              <Row gutter={[24, 24]} justify="center">
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Card
                    hoverable
                    onClick={() => setShowBreakdown(prev => !prev)}
                    style={{
                      borderRadius: 20,
                      boxShadow: '0 6px 18px rgba(0,0,0,0.1)',
                      cursor: 'pointer',
                      background: '#fff',
                      textAlign: 'center',
                      padding: 20,
                    }}
                  >
                    <div style={{ ...iconStyle, background: 'linear-gradient(135deg, #54a0ff, #a0c4ff)' }}>
                      <UsergroupAddOutlined />
                    </div>
                    <h3 style={{ fontWeight: 600, fontSize: 20, marginBottom: 8, color: '#555' }}>
                      Total Volunteers
                    </h3>
                    <p style={{ fontWeight: 800, fontSize: 38, margin: 0, color: '#222' }}>
                      {counts.volunteers}
                    </p>
                  </Card>
                </Col>

                {otherCards.map(({ title, icon, count, gradient, route }) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={title}>
                    <Card
                      hoverable
                      onClick={() => navigate(route)}
                      style={{
                        borderRadius: 20,
                        boxShadow: '0 6px 18px rgba(0,0,0,0.1)',
                        cursor: 'pointer',
                        background: '#fff',
                        textAlign: 'center',
                        padding:20,
                      }}
                    >
                      <div style={{ ...iconStyle, background: gradient }}>{icon}</div>
                      <h3 style={{ fontWeight: 600, fontSize: 20, marginBottom: 8, color: '#555' }}>
                        {title}
                      </h3>
                      <p style={{ fontWeight: 800, fontSize: 38, margin: 0, color: '#222' }}>
                        {count}
                      </p>
                    </Card>
                  </Col>
                ))}
              </Row>

              {showBreakdown && (
                <Row gutter={[16, 16]} justify="center" style={{ marginTop: 24 }}>
                  {breakdownItems.map(({ label, value }) => (
                    <Col xs={12} sm={8} md={6} lg={4} key={label}>
                      <Card
                        hoverable
                        style={{
                          borderRadius: 16,
                          background: 'linear-gradient(135deg, #54a0ff, #a0c4ff)',
                          color: '#000',
                          textAlign: 'center',
                          boxShadow: '0 0 12px rgba(41, 75, 116, 0.4)',
                          backdropFilter: 'blur(6px)',
                        }}
                      >
                        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: labelColors[label] }}>
                          {label}
                        </div>
                        <div style={{ fontSize: 28, fontWeight: 700 }}>
                          <CountUp end={value} duration={1.4} />
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Home;