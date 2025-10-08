'use client'

import withAuth from "../../utils/withAuth";
import Dashboard from "../../components/Dashboard";

const DashboardPage = () => <Dashboard />;

export default withAuth(DashboardPage);
