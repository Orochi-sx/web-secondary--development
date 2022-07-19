import React, { useEffect } from "react";
// const { Form, InputNumber } = window.antd || ;
import { Form, Input } from 'antd'

const DesignConfiguration = ({ changeConfiguration, configuration }) => {
  const [form] = Form.useForm();
  useEffect(() => {
    try {
      form.setFieldsValue(JSON.parse(configuration || '{}'));
    } catch (error) {
      console.error("configuration解析错误", error);
    }
  }, []);

  const onFormLayoutChange = (changedValues, allValues) => {
    // console.log('allValues==',allValues);
    changeConfiguration(JSON.stringify(allValues));
  };

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 },
  };

  return (
    <>
      <Form
        {...formItemLayout}
        form={form}
        onValuesChange={onFormLayoutChange}
      >
        <Form.Item label="数据源ID" name="assetId" initialValue={''}>
          <Input />
        </Form.Item>

      </Form>
    </>
  );
};

DesignConfiguration.propTypes = {};

export default DesignConfiguration;
