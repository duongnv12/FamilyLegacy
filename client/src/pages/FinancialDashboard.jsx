// src/pages/FinancialDashboard.jsx
import React from 'react';
import { Tabs } from 'antd';
import SetContributionForm from '../components/SetContributionForm';
import IncomeStats from '../components/IncomeStats';
import RecordVoluntaryContributionForm from '../components/RecordVoluntaryContributionForm'; 
import EventBudgetForm from '../components/EventBudgetForm';
import ExpenseApproval from '../components/ExpenseApproval';
import ExpenseStats from '../components/ExpenseStats';
import EventExpenseForm from '../components/EventExpenseForm';

const { TabPane } = Tabs;

const FinancialDashboard = () => {


  return (
    <div style={{ padding: '24px' }}>
      <h2>Quản lý Tài chính</h2>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Thiết lập đóng góp" key="1">
          <SetContributionForm />
        </TabPane>
        <TabPane tab="Ghi nhận ủng hộ" key="3">
          <RecordVoluntaryContributionForm />
        </TabPane>
        <TabPane tab="Thống kê thu" key="4">
          <IncomeStats />
        </TabPane>
        <TabPane tab="Ngân sách sự kiện" key="5">
          <EventBudgetForm />
        </TabPane>
        <TabPane tab="Duyệt chi tiêu" key="6">
          <ExpenseApproval />
        </TabPane>
        <TabPane tab="Ghi nhận chi" key="7">
          <EventExpenseForm />
        </TabPane>
        <TabPane tab="Thống kê chi" key="8">
          <ExpenseStats />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default FinancialDashboard;
