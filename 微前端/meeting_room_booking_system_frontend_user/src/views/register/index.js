import React, { useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, Form, Input, message } from "antd";
import { useForm } from "antd/es/form/Form";
import { sendRegisterCaptcha, register } from "@/api";
import { RegisterWrapper } from "./style";

export default function Register() {
  const [form] = useForm();
  const navigate = useNavigate();
  // 注册
  const onFinish = useCallback(
    async (values) => {
      console.log(values);
      if (values.password !== values.confirmPassword) {
        return message.error("两次密码不一致");
      }
      const res = await register(values);
      if (res.status === 201 || res.status === 200) {
        message.success("注册成功");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        message.error(res.data.data || "系统繁忙，请稍后再试");
      }
    },
    [navigate]
  );
  // 发送验证码
  const sendCaptcha = useCallback(async () => {
    const address = form.getFieldValue("email");
    const res = await sendRegisterCaptcha(address);

    if (res.status === 201 || res.status === 200) {
      message.success(res.data.data);
    } else {
      message.error(res.data.data || "系统繁忙，请稍后再试");
    }
  }, [form]);
  // 表单布局
  const layout1 = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };
  // 表单布局
  const layout2 = {
    labelCol: { span: 0 },
    wrapperCol: { span: 24 },
  };

  return (
    <RegisterWrapper>
      <h1>会议室预订系统</h1>
      <Form
        {...layout1}
        form={form}
        onFinish={onFinish}
        colon={false}
        autoComplete="off"
      >
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: "请输入用户名!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="昵称"
          name="nickName"
          rules={[{ required: true, message: "请输入昵称!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: "请输入密码!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="确认密码"
          name="confirmPassword"
          rules={[{ required: true, message: "请输入确认密码!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="邮箱"
          name="email"
          rules={[
            { required: true, message: "请输入邮箱!" },
            { type: "email", message: "请输入合法邮箱地址!" },
          ]}
        >
          <Input />
        </Form.Item>

        <div className="captcha-wrapper">
          <Form.Item
            label="验证码"
            name="captcha"
            rules={[{ required: true, message: "请输入验证码!" }]}
          >
            <Input />
          </Form.Item>
          <Button type="primary" onClick={sendCaptcha}>
            发送验证码
          </Button>
        </div>

        <Form.Item {...layout2}>
          <div className="links">
            已有账号？去<Link to={"/login"}>登录</Link>
          </div>
        </Form.Item>

        <Form.Item {...layout1} label=" ">
          <Button className="btn" type="primary" htmlType="submit">
            注册
          </Button>
        </Form.Item>
      </Form>
    </RegisterWrapper>
  );
}
