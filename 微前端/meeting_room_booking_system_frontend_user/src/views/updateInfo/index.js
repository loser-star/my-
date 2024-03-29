import React, { useCallback, useEffect } from "react";
import { Button, Form, Input, message } from "antd";
import { useForm } from "antd/es/form/Form";

import { getUserInfo, updateUserInfoCaptcha, updateInfo } from "@/api";

import HeadPicUpload from "./c-cmp/HeadPicUpload";
import { UpdateInfoWrapper } from "./style";
export default function UpdateInfo() {
  const [form] = useForm();
  useEffect(() => {
    async function query() {
      const res = await getUserInfo();
      if (res.status === 200 || res.status === 201) {
        form.setFieldValue("headPic", res.data.data.headPic);
        form.setFieldValue("nickName", res.data.data.nickName);
        form.setFieldValue("email", res.data.data.email);
      }
    }
    query();
  }, [form]);

  const layout1 = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

  const onFinish = useCallback(async (values) => {
    const res = await updateInfo(values);

    if (res.status === 201 || res.status === 200) {
      const { message: msg, data } = res.data;
      if (msg === "success") {
        message.success("用户信息更新成功");
      } else {
        message.error(data);
      }
    } else {
      message.error("系统繁忙，请稍后再试");
    }
  }, []);

  const sendCaptcha = useCallback(async function () {
    const res = await updateUserInfoCaptcha();
    if (res.status === 201 || res.status === 200) {
      message.success(res.data.data);
    } else {
      message.error("系统繁忙，请稍后再试");
    }
  }, []);

  return (
    <UpdateInfoWrapper>
      <Form
        form={form}
        {...layout1}
        onFinish={onFinish}
        colon={false}
        autoComplete="off"
      >
        <Form.Item
          label="头像"
          name="headPic"
          rules={[{ required: true, message: "请输入头像!" }]}
        >
          <HeadPicUpload headPic={form.headPic} />
        </Form.Item>

        <Form.Item
          label="昵称"
          name="nickName"
          rules={[{ required: true, message: "请输入昵称!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="邮箱"
          name="email"
          rules={[
            { required: true, message: "请输入邮箱!" },
            { type: "email", message: "请输入合法邮箱地址!" },
          ]}
        >
          <Input disabled />
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

        <Form.Item {...layout1} label=" ">
          <Button className="btn" type="primary" htmlType="submit">
            修改信息
          </Button>
        </Form.Item>
      </Form>
    </UpdateInfoWrapper>
  );
}
