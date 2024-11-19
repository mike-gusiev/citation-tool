import React from "react";
import { Checkbox, Col, Form, Input, Button } from "antd";
// import BusinessAutoComplete from "./BusinessAutoComplete";

const CitationFinderForm = ({ form, onSubmit }) => {
  // const handleFill = (businessDetails) => {
  //   form.setFieldsValue({
  //     name: businessDetails.name,
  //     address: businessDetails.address,
  //     phone: businessDetails.phone,
  //     website: businessDetails.website,
  //   });
  // };

  const validateCheckboxGroup = (_, value) => {
    if (value && value.length > 0) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("Please select at least one search type."));
  };
  const checkboxStyle = {
    justifyContent: "center",
    display: "flex",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  const checkboxes = [
    { label: "Name", value: "name" },
    { label: "Name + Address", value: "nameAddress" },
    { label: "Name + Phone", value: "namePhone" },
    { label: "Name + Website", value: "nameWebsite" },
    { label: "Name + Address + Phone", value: "nameAddressPhone" },
  ];

  const validateDepstartentFields = () => {
    const values = form.getFieldsValue();
    const { type, name, address, phone, website } = values;

    const requiredFields = new Set();

    type?.forEach((t) => {
      switch (t) {
        case "name":
          break;
        case "nameAddress":
          requiredFields.add("address");
          break;
        case "namePhone":
          requiredFields.add("phone");
          break;
        case "nameWebsite":
          requiredFields.add("website");
          break;
        case "nameAddressPhone":
          requiredFields.add("address");
          requiredFields.add("phone");
          break;
        default:
          break;
      }
    });

    const errors = [];
    requiredFields.forEach((field) => {
      if (!values[field]) {
        errors.push(`${field} is required for the selected types.`);
      }
    });

    if (errors.length > 0) {
      return Promise.reject(new Error(errors.join(" ")));
    }

    return Promise.resolve();
  };

  return (
    <Form form={form} layout="vertical" onFinish={onSubmit}>
      {/* <Form.Item label="Search Business">
        <BusinessAutoComplete onFill={handleFill} />
      </Form.Item> */}
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: "Name is required." }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="Address" name="address">
        <Input />
      </Form.Item>
      <Form.Item label="Phone" name="phone">
        <Input />
      </Form.Item>
      <Form.Item label="Website" name="website">
        <Input />
      </Form.Item>
      <Form.Item
        name="type"
        label="Search Types"
        rules={[{ validator: validateCheckboxGroup }]}
      >
        <Checkbox.Group
          style={{
            width: "100%",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          {checkboxes.map((checkbox) => (
            <Col key={checkbox.value}>
              <Checkbox value={checkbox.value} style={checkboxStyle}>
                <span title={checkbox.label}>{checkbox.label}</span>
              </Checkbox>
            </Col>
          ))}
        </Checkbox.Group>
      </Form.Item>
      <Form.Item shouldUpdate>
        {() => (
          <Button
            type="primary"
            htmlType="submit"
            disabled={form.getFieldsError().some(({ errors }) => errors.length)}
          >
            Submit
          </Button>
        )}
      </Form.Item>
    </Form>
  );
};

export default CitationFinderForm;
