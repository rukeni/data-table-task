import { useState, FC } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Layout, Button, Space, Modal } from 'antd';

import { RecordForm } from '@/shared/ui/RecordForm';
import { MembersTable } from '@/app/members/ui/MembersTable';

const { Header, Content } = Layout;

const App: FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'white',
        }}
      >
        <h1
          style={{
            flex: 1,
            margin: 0,
            fontSize: '16px',
            fontWeight: '600',
            lineHeight: '24px',
            letterSpacing: '0%',
            verticalAlign: 'middle',
          }}
        >
          회원 목록
        </h1>
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
          <RecordForm onClose={() => setIsModalVisible(false)} />
        </Modal>
      </Content>
    </Layout>
  );
};

export default App;
