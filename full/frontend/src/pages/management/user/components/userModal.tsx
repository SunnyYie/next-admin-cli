import { Form, Input, Modal, Select } from 'antd'
import { useEffect } from 'react'

import { RoleEnum } from '@/types/role'
import type { UserInfo } from '@/types/store/type'

interface UserFormProps {
  visible: boolean
  onCancel: () => void
  onSave: (values: UserInfo) => void
  initialValues?: UserInfo | null
}

export default function UserModal({ visible, onCancel, onSave, initialValues }: UserFormProps) {
  const [form] = Form.useForm()

  useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue({ ...initialValues, roleId: Number(initialValues.role?.id) })
    } else {
      form.resetFields()
    }
  }, [visible, initialValues, form])

  const handleOk = () => {
    form.validateFields().then(values => {
      onSave(values)
      // form.resetFields()
    })
  }

  return (
    <Modal
      title={initialValues ? '编辑用户' : '添加用户'}
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      cancelText="取消"
      okText="保存"
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="姓名" rules={[{ required: true, message: '请输入用户姓名' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="邮箱"
          rules={[
            { required: true, message: '请输入用户邮箱' },
            { type: 'email', message: '请输入有效的邮箱地址' },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="roleId" label="角色" rules={[{ required: true, message: '请选择角色' }]}>
          <Select defaultValue={RoleEnum.USER}>
            <Select.Option value={RoleEnum.AMDIN}>管理员</Select.Option>
            <Select.Option value={RoleEnum.USER}>普通用户</Select.Option>
          </Select>
        </Form.Item>

        {!initialValues && (
          <Form.Item
            name="password"
            label="密码"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6位' },
            ]}
          >
            <Input placeholder="请输入不少于6位的密码" />
          </Form.Item>
        )}
      </Form>
    </Modal>
  )
}
