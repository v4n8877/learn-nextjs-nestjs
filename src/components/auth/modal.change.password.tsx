"use client";
import React, { useState } from "react";
import { Button, Form, Input, Modal, notification, Steps } from "antd";
import { useHasMounted } from "@/utils/customHook";
import { SmileOutlined, SolutionOutlined, UserOutlined } from "@ant-design/icons";
import { sendRequest } from "@/utils/api";

const ModalChangePassword = ({
  isModalOpen,
  setIsModalOpen,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
}) => {
  const [current, setCurrent] = useState(0);
  const [userEmail, setUserEmail] = useState("");
  const [form] = Form.useForm();
  const hasMounted = useHasMounted();

  if (!hasMounted) return <></>;

  const onFinishStep0 = async (values: any) => {
    const { email } = values;
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}auth/retry-password`,
      method: "POST",
      body: {
        email,
      },
    });
    if (res?.data) {
      setUserEmail(res?.data?.email);
      setCurrent(1);
    } else {
      notification.error({
        message: "Error",
        description: res?.message || "Unknown error",
      });
    }
  };

  const onFinishStep1 = async (values: any) => {
    const { code, password, confirmPassword } = values;
    if (password !== confirmPassword) {
      notification.error({
        message: "Invalid input",
        description: "Mật khẩu và xác nhận mật khẩu không trùng khớp",
      });
      return;
    }
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}auth/change-password`,
      method: "POST",
      body: {
        code,
        password,
        confirmPassword,
        email: userEmail,
      },
    });
    if (res?.data) {
      setCurrent(2);
    } else {
      notification.error({
        message: "Error",
        description: res?.message || "Unknown error",
      });
    }
  };

  const resetModal = () => {
    setIsModalOpen(false);
    setCurrent(0);
    setUserEmail("");
    form.resetFields();
  };

  return (
    <>
      <Modal
        title="Kích hoạt tài khoản"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
        onOk={resetModal}
        onCancel={resetModal}
        maskClosable={false}
        footer={null}
      >
        <Steps
          current={current}
          items={[
            {
              title: "Login",
              // status: "finish",
              icon: <UserOutlined />,
            },
            {
              title: "Verification",
              // status: "finish",
              icon: <SolutionOutlined />,
            },
            {
              title: "Done",
              // status: "wait",
              icon: <SmileOutlined />,
            },
          ]}
        />
        {current === 0 && (
          <>
            <div style={{ margin: "20px 0" }}>
              <p>Vui lòng nhập email đã đăng ký trước đó</p>
            </div>
            <Form
              name="Verify"
              onFinish={onFinishStep0}
              autoComplete="off"
              layout="vertical"
              form={form}
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: "Vui lòng nhập email" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Button
                    type="primary"
                    htmlType="submit"
                  >
                    Resend
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </>
        )}
        {current === 1 && (
          <>
            <div style={{ margin: "20px 0" }}>
              <p>Vui lòng nhập mật khẩu mới</p>
            </div>
            <Form
              name="Quên mật khẩu"
              onFinish={onFinishStep1}
              autoComplete="off"
              layout="vertical"
              form={form}
            >
              <Form.Item
                label="Code"
                name="code"
                rules={[{ required: true, message: "Vui lòng nhập mã xác nhận" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Mật khẩu mới"
                name="password"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới" }]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                label="Xác nhận lại mật khẩu mới"
                name="confirmPassword"
                rules={[{ required: true, message: "Vui lòng nhập lại mật khẩu mới" }]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Button
                    type="primary"
                    htmlType="submit"
                  >
                    Confirm
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </>
        )}
        {current === 2 && (
          <>
            <div style={{ margin: "20px 0" }}>
              <p>Đã đổi mật khẩu thành công</p>
            </div>
          </>
        )}
      </Modal>
    </>
  );
};

export default ModalChangePassword;
