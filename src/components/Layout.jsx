import React, { useState } from 'react';
import { Layout, Menu, Breadcrumb, theme } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content, Footer } = Layout;

const AppLayout = ({children}) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh', width: '100%' }}>
      {/* Sidebar */}
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        width={250}
        style={{
          background: colorBgContainer,
          boxShadow: '2px 0 8px 0 rgba(29, 35, 41, 0.05)',
        }}
      >
        <div className="demo-logo-vertical" style={{ 
          height: '64px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)'
        }}>
          {collapsed ? (
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>LOGO</div>
          ) : (
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>YOUR LOGO</div>
          )}
        </div>
        
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: <UserOutlined />,
              label: 'Dashboard',
            },
            {
              key: '2',
              icon: <VideoCameraOutlined />,
              label: 'Analytics',
            },
            {
              key: '3',
              icon: <UploadOutlined />,
              label: 'Settings',
            },
          ]}
        />
      </Sider>

      {/* Main Layout */}
      <Layout style={{width : '100vh'}}>
        {/* Header */}
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
            boxShadow: '0 1px 4px rgba(0, 21, 41, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: () => setCollapsed(!collapsed),
              style: { padding: '0 24px', fontSize: '18px' }
            })}
            <Breadcrumb style={{ marginLeft: '16px' }}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          
          <div style={{ paddingRight: '24px' }}>
            <span>Welcome, User</span>
          </div>
        </Header>

        {/* Content Area */}
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: '8px',
            
          }}
        >
         
{children}

        </Content>

        {/* Footer */}
        {/* <Footer style={{ 
          textAlign: 'center',
          borderTop: '1px solid rgba(0, 0, 0, 0.06)'
        }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer> */}
      </Layout>
    </Layout>
  );
};

export default AppLayout;