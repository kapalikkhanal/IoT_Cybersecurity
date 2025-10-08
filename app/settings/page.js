"use client";

import Settings from "../../components/Settings";
import withAuth from "../../utils/withAuth";

const SettingsPage = () => <Settings />;

export default withAuth(SettingsPage);