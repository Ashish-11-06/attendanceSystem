import React, { useState } from 'react';
import { Layout, Menu, Breadcrumb, Avatar, Drawer } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  CalendarOutlined,
  ApartmentOutlined,
  UsergroupAddOutlined,
  EnvironmentOutlined,
  SmileOutlined,
  UserOutlined, 
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const SIDEBAR_WIDTH = 250;

const AppLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { key: '/', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '/events-list', icon: <CalendarOutlined />, label: 'Event List' },
    { key: '/unit-list', icon: <ApartmentOutlined />, label: 'Unit List' },
    { key: '/volunteer-list', icon: <UsergroupAddOutlined />, label: 'Volunteer List' },
    { key: '/location-list', icon: <EnvironmentOutlined />, label: 'Location List' },
    { key: '/profile', icon: <UserOutlined />, label: 'Profile' },
  ];

  const SidebarMenu = (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[location.pathname]}
      onClick={({ key }) => {
        navigate(key);
        if (isMobile) {
          setCollapsed(true); // close drawer on mobile after click
        }
      }}
      items={menuItems}
      style={{
        paddingTop: 16,
        height: '100%',
        borderRight: 0,
        overflow: 'hidden',
      }}
    />
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          width={SIDEBAR_WIDTH}
          collapsedWidth={80}
          breakpoint="md"
          onBreakpoint={(broken) => {
            setIsMobile(broken);
            if (broken) setCollapsed(true);
          }}
          style={{
            position: 'fixed',
            height: '100vh',
            left: 0,
            top: 0,
            bottom: 0,
            zIndex: 1000,
            overflow: 'hidden',
          }}
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
              userSelect: 'none',
            }}
          >
            {collapsed ? '🚀' : 'My Dashboard'}
          </div>
          {SidebarMenu}
        </Sider>
      )}

      {/* Mobile Sidebar Drawer */}
      {isMobile && (
        <Drawer
          placement="left"
          closable={false}
          onClose={() => setCollapsed(true)}
          open={!collapsed}
          bodyStyle={{ padding: 0, backgroundColor: '#001529', overflow: 'hidden' }}
          width={SIDEBAR_WIDTH}
          maskClosable={true}
          headerStyle={{ display: 'none' }}
          drawerStyle={{ backgroundColor: '#001529', overflow: 'hidden' }}
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
              userSelect: 'none',
            }}
          >
            🚀 My Dashboard
          </div>
          {SidebarMenu}
        </Drawer>
      )}

      {/* Main Layout */}
      <Layout
        style={{
          marginLeft: !isMobile ? (collapsed ? 80 : SIDEBAR_WIDTH) : 0,
          transition: 'all 0.2s',
          minHeight: '100vh',
        }}
      >
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
            position: 'sticky',
            top: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: () => setCollapsed(!collapsed),
              style: { fontSize: 20, cursor: 'pointer', marginRight: 16 },
            })}
            <Breadcrumb>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>
                {menuItems.find((item) => item.key === location.pathname)?.label || 'Page'}
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
