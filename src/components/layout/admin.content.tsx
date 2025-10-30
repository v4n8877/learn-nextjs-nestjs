"use client";
import { Layout } from "antd";
import { theme } from "antd";

const AdminContent = ({ children }: { children: React.ReactNode }) => {
  const { Content } = Layout;
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Content
      style={{
        margin: "24px 16px",
        padding: 24,
        minHeight: "calc(100vh - 112px)",
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
      }}
    >
      {children}
    </Content>
  );
};

export default AdminContent;
