import { useState, FC } from 'react';
import { Layout, Button, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { Modal } from '@/shared/ui/Modal';
import { MemberForm } from '@/members/ui/MemberForm';
import { MembersTable } from '@/members/ui/MembersTable';

const { Header, Content } = Layout;

const App: FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <Layout>
      <Header className="header-container">
        <h1 className="header-title">회원 목록</h1>
        <Space>
          <Button type="primary" onClick={() => setIsModalVisible(true)}>
            <PlusOutlined />
            추가
          </Button>
        </Space>
      </Header>
      <Content>
        <MembersTable />
        <Modal
          onCancel={() => setIsModalVisible(false)}
          title="회원 추가"
          footer={null}
          open={isModalVisible}
        >
          <MemberForm onClose={() => setIsModalVisible(false)} />
        </Modal>
      </Content>
    </Layout>
  );
};

export default App;
