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
  UnderlineOutlined,
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
    { key: '/attendance', icon: <CalendarOutlined />, label: 'Mark Attendance' }, 
    { key: '/attendance-list', icon: <UnderlineOutlined />, label: 'Attendance List' },
  ];

  const profileMenuItem = { key: '/profile', icon: <UserOutlined />, label: 'Profile' };

  const onMenuClick = ({ key }) => {
    navigate(key);
    if (isMobile) {
      setCollapsed(true);
    }
  };

  const SidebarMenu = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 64px)', // Full height minus header/logo height
        justifyContent: isMobile ? 'flex-start' : 'space-between',
        paddingTop: 16,
        paddingBottom: 16,
        overflow: 'hidden',
      }}
    >
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        onClick={onMenuClick}
        items={menuItems}
        style={{
          borderRight: 0,
          marginBottom: 0,
        }}
      />

      {/* Add extra margin-top on mobile to push profile menu down */}
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        onClick={onMenuClick}
        items={[profileMenuItem]}
        style={{
          borderRight: 0,
          marginTop: isMobile ? 380 : 0,  // <-- Increase this value to push profile lower on mobile
        }}
      />
    </div>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
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
            {collapsed ? '🚀' : 'Attendance'}
          </div>
          {SidebarMenu}
        </Sider>
      )}

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
            Attendance
          </div>
          {SidebarMenu}
        </Drawer>
      )}

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
               <Breadcrumb.Item>...</Breadcrumb.Item> 
              <Breadcrumb.Item>
                {[...menuItems, profileMenuItem].find((item) => item.key === location.pathname)?.label || 'Page'}
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
            margin: '10px',
            // padding: 24,
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
