import React from "react";
import { Layout, Avatar, Menu, Breadcrumb } from "antd";
import Title from "antd/lib/typography/Title";
import SubMenu from "antd/lib/menu/SubMenu";
import { MailOutlined } from "@ant-design/icons";

function Index() {
  const { Header, Footer, Sider, Content } = Layout;
  return (
    <div>
      <Layout>
        <Header style={{ padding: 12,  }} >
          <Avatar
            shape="square"
            size="large"
            style={{ float: "left" }}
            src="./nashtech.jpg"
          />
          <Title style={{ color: "white" }} level={3}></Title>
        </Header>
        <Layout>
          <Sider>
            <Menu mode="inline">
              <Menu.Item key="Menu">Menu</Menu.Item>
              <SubMenu
                key="sub1"
                icon={<MailOutlined />}
                title="Management"
              >
                <Menu.ItemGroup key="Management" title="Management">
                  <Menu.Item key="manage 1">Manage Users</Menu.Item>
                  <Menu.Item key="manage 2">Manage Asset</Menu.Item>
                  <Menu.Item key="manage 3">Manage Assignment</Menu.Item>
                </Menu.ItemGroup>
              </SubMenu>
            </Menu>
            <Menu >
              <Menu.Item key="Request">Request for Returning</Menu.Item>
            </Menu>
            <Menu >
              <Menu.Item key="Report">Report</Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            <Content style={{ padding: "0 50px" }}>
              <Breadcrumb style={{ margin: "16px 0" }}>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
              </Breadcrumb>
              <div style={{background: '#fff', padding: 24, minHeight:795}}>Content</div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Nashtech Rookies ASM ©2021</Footer>
          </Layout>
        </Layout>
      </Layout>
    </div>
  );
}

export default Index;
