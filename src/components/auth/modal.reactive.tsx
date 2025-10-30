"use client";
import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal, notification, Steps } from "antd";
import { useHasMounted } from "@/utils/customHook";
import { SmileOutlined, SolutionOutlined, UserOutlined } from "@ant-design/icons";
import { sendRequest } from "@/utils/api";

const ModalReactive = ({
  isModalOpen,
  setIsModalOpen,
  userEmail,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  userEmail: string;
}) => {
  const [current, setCurrent] = useState(0);
  const [userId, setUserId] = useState("");
  const [form] = Form.useForm();
  const hasMounted = useHasMounted();

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (userEmail) {
      form.setFieldsValue({
        email: userEmail,
      });
    }
  }, [userEmail]);

  if (!hasMounted) return <></>;

  const onFinishStep0 = async (values: any) => {
    const { email } = values;
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}auth/retry-active`,
      method: "POST",
      body: {
        email,
      },
    });
    if (res?.data) {
      setUserId(res?.data?._id);
      setCurrent(1);
    } else {
      notification.error({
        message: "Error",
        description: res?.message || "Unknown error",
      });
    }
  };

  const onFinishStep1 = async (values: any) => {
    const { code } = values;
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}auth/check-code`,
      method: "POST",
      body: {
        code,
        _id: userId,
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

  return (
    <>
      <Modal
        title="Kích hoạt tài khoản"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
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
              <p>Tài khoản của bạn chưa được kích hoạt</p>
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
              >
                <Input
                  disabled
                  value={userEmail}
                />
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
              <p>Vui lòng nhập mã xác nhận</p>
            </div>
            <Form
              name="Verify"
              onFinish={onFinishStep1}
              autoComplete="off"
              layout="vertical"
            >
              <Form.Item
                label="Code"
                name="code"
                rules={[{ required: true, message: "Vui lòng nhập mã xác nhận" }]}
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
                    Send
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </>
        )}
        {current === 2 && (
          <>
            <div style={{ margin: "20px 0" }}>
              <p>Tài khoản của bạn đã được kích hoạt thành công</p>
            </div>
          </>
        )}
      </Modal>
    </>
  );
};

export default ModalReactive;
