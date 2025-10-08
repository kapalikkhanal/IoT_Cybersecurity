"use client";

import UserProfile from "@/components/Profile";
import withAuth from "../../utils/withAuth";

const ProfilePage = () => <UserProfile />;

export default withAuth(ProfilePage);