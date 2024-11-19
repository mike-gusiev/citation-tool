import React from 'react';
import { Modal, List, Button, Tooltip, message } from 'antd';
import { CopyOutlined, LinkOutlined } from '@ant-design/icons';

const LinksModal = ({ visible, data, onClose }) => {
  const handleCopy = (link) => {
    navigator.clipboard.writeText(link).then(() => {
      message.success('Link copied to clipboard!');
    });
  };
  return (
    <Modal
      title={`Links for ${data?.keyword} (${data?.data?.date})`}
      open ={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <List
        dataSource={data.links}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Tooltip title="Copy Link">
                <Button
                  icon={<CopyOutlined />}
                  onClick={() => handleCopy(item.url)}
                />
              </Tooltip>,
              <Tooltip title="Open Link">
                <Button
                  icon={<LinkOutlined />}
                  onClick={() => window.open(item.url, '_blank', 'noopener,noreferrer')}
                />
              </Tooltip>,
            ]}
          >
            <List.Item.Meta title={item.url} />
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default LinksModal;
