import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import PageWrap from "@/components/page-wrap";
import ProfileSettings from "@/components/profileSettings/profile-settings";
import DisplaySettings from "@/components/displaySettings/display-settings";
import NotificationsSettings from "@/components/notificationsSettings/notifications-settings";
import PrivacySettings from "@/components/privacySettings/privacy-settings";
import DataManagementSettings from "@/components/dataManagementSettings/data-management-settings";
import GdprSettings from "@/components/gdprSettings/gdpr-settings";
import AccountStats from "@/components/accountStats/account-stats";

export const Route = createFileRoute("/_authenticated/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <PageWrap
        title={"Settings"}
        subtitle="Customize your Video Game Organizer experience."
      />
      <div className="grid gap-6">
        <ProfileSettings />
        <DisplaySettings />
        <NotificationsSettings />
        <PrivacySettings />
        <DataManagementSettings />
        <GdprSettings />
        <AccountStats />
      </div>
    </>
  );
}
