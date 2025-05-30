// src/components/Layout.jsx
import React, { useState } from 'react';
import { Layout, Menu, Breadcrumb, Avatar } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  CalendarOutlined,
  ApartmentOutlined,
  UsergroupAddOutlined,
  EnvironmentOutlined,
  SmileOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const AppLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/events-list',
      icon: <CalendarOutlined />,
      label: 'Event List',
    },
    {
      key: '/unit-list',
      icon: <ApartmentOutlined />,
      label: 'Unit List',
    },
    {
      key: '/volunteer-list',
      icon: <UsergroupAddOutlined />,
      label: 'Volunteer List',
    },
    {
      key: '/location-list',
      icon: <EnvironmentOutlined />,
      label: 'Location List',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={250}
       
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
            fontWeight: 'bold',
            color: '#fff',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {collapsed ? '🚀' : 'My Dashboard'}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={({ key }) => navigate(key)}
          items={menuItems}
          style={{ paddingTop: '16px' }}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: 0,
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingRight: 24,
            paddingLeft: 16,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            zIndex: 1,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: 'trigger',
                onClick: () => setCollapsed(!collapsed),
                style: { fontSize: 20, cursor: 'pointer', marginRight: 16 },
              }
            )}
            <Breadcrumb>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>
                {menuItems.find(item => item.key === location.pathname)?.label || 'Page'}
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontWeight: 500 }}>Welcome, User</span>
            <Avatar size="large" icon={<SmileOutlined />} />
          </div>
        </Header>

        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: '#fff',
            borderRadius: 12,
            boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
            transition: 'all 0.3s ease-in-out',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
